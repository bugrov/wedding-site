import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rsvpSchema } from "@/lib/schemas/rsvp";
import { ProjectStatus } from "@/app/generated/prisma/client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Проверьте правильность заполнения полей",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { status: true, publishedAt: true },
  });

  // Not just "does this project exist" — an unpublished project shouldn't
  // silently accept RSVPs guests can't even see the form for, and a
  // published-but-unpaid one is a watermarked preview (see
  // components/site-payment-watermark.tsx): the client re-check on the form
  // itself (previewMode) already stops a guest from submitting there, but
  // this is the actual enforcement — never trust the disabled-button alone.
  const isPaid =
    !!project?.publishedAt &&
    (project.status === ProjectStatus.PAID || project.status === ProjectStatus.PUBLISHED);

  if (!isPaid) {
    return NextResponse.json({ error: "Форма пока недоступна" }, { status: 403 });
  }

  // Soft dedup, no personalized links yet (see plan): a case/whitespace
  // -insensitive name match against this project's existing responses is
  // treated as "changed their mind" (update) rather than a new guest.
  const normalizedName = data.name.trim().replace(/\s+/g, " ");
  const existing = await prisma.rsvpResponse.findFirst({
    where: { projectId: data.projectId, name: { equals: normalizedName, mode: "insensitive" } },
  });

  const responseData = {
    projectId: data.projectId,
    name: normalizedName,
    attending: data.attending,
    headcount: data.headcount ?? 1,
    foodPref: data.foodPref || null,
    drinkPref: data.drinkPref || null,
    plusOneName: data.plusOneName || null,
    comment: data.comment || null,
  };

  if (existing) {
    await prisma.rsvpResponse.update({ where: { id: existing.id }, data: responseData });
  } else {
    await prisma.rsvpResponse.create({ data: responseData });
  }

  return NextResponse.json({ ok: true });
}
