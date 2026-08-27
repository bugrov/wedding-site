import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/session";
import { generateUniqueSlug } from "@/lib/slug";
import { LeadStatus, ProjectStatus } from "@/app/generated/prisma/client";

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

  const slug = await generateUniqueSlug(lead.groomName, lead.brideName);
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
