import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/session";
import { generateUniqueSlug } from "@/lib/slug";
import { LeadStatus, ProjectStatus } from "@/app/generated/prisma/client";
import { deleteFile, extractPublicUrls } from "@/lib/storage/s3";

const actionSchema = z.object({ action: z.enum(["convert", "reject"]) });

// Turns a submitted lead into a real project (see plan: "оператор вручную
// превращает [заявку] в реальный проект") or marks it rejected — the only
// two things an operator does to a lead besides reading it.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminSession();
  if (!adminUser) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  if (lead.status !== LeadStatus.NEW) {
    return NextResponse.json({ error: "Заявка уже обработана" }, { status: 409 });
  }

  if (parsed.data.action === "reject") {
    await prisma.lead.update({ where: { id }, data: { status: LeadStatus.REJECTED } });
    return NextResponse.json({ ok: true });
  }

  const slug = await generateUniqueSlug(lead.groomName, lead.brideName, lead.weddingDate);
  const clientAccessToken = randomBytes(24).toString("hex");

  const project = await prisma.$transaction(async (tx) => {
    const created = await tx.project.create({
      data: {
        leadId: lead.id,
        slug,
        groomName: lead.groomName,
        brideName: lead.brideName,
        weddingDate: lead.weddingDate,
        templateId: lead.templateId,
        themeId: lead.themeId,
        blocksConfig: lead.blocksConfig as object,
        status: ProjectStatus.IN_PROGRESS,
        clientAccessToken,
      },
    });
    await tx.lead.update({ where: { id }, data: { status: LeadStatus.IN_PROGRESS } });
    return created;
  });

  return NextResponse.json({ ok: true, projectId: project.id });
}

// Removes a lead the operator never meant to keep (their own test
// submissions, mainly — see feedback: "мало ли я демо заявок для теста
// создал"), together with the project it was converted into, if any. Guests
// and RsvpResponses cascade via the schema's onDelete: Cascade on Project;
// leadId on Project has no cascade of its own (deleting a Lead alone would
// just null it out), so the project is deleted explicitly in the same
// transaction instead of relying on that.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminSession();
  if (!adminUser) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    select: { blocksConfig: true, project: { select: { id: true, blocksConfig: true } } },
  });
  if (!lead) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });

  // Collected before the delete — once the rows are gone there's nothing
  // left to read the URLs back out of.
  const candidateUrls = extractPublicUrls(
    JSON.stringify(lead.blocksConfig) + JSON.stringify(lead.project?.blocksConfig ?? null),
  );

  await prisma.$transaction(async (tx) => {
    if (lead.project) {
      await tx.project.delete({ where: { id: lead.project.id } });
    }
    await tx.lead.delete({ where: { id } });
  });

  // Same safety check as /api/upload/cleanup: only delete a file from
  // storage once nothing else (another lead/project — the demo seeds, for
  // instance, intentionally reuse the same photo across all 5) still points
  // to it.
  await Promise.all(
    candidateUrls.map(async (url) => {
      const [projectMatch, leadMatch] = await Promise.all([
        prisma.$queryRaw<
          { exists: boolean }[]
        >`SELECT EXISTS (SELECT 1 FROM projects WHERE strpos(blocks_config::text, ${url}) > 0) AS exists`,
        prisma.$queryRaw<
          { exists: boolean }[]
        >`SELECT EXISTS (SELECT 1 FROM leads WHERE strpos(blocks_config::text, ${url}) > 0) AS exists`,
      ]);
      if (!projectMatch[0]?.exists && !leadMatch[0]?.exists) {
        await deleteFile(url);
      }
    }),
  );

  return NextResponse.json({ ok: true });
}
