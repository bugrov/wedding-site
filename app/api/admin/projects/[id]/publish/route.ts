import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/session";

// Toggles publishedAt — the only field that gates guest visibility (see
// app/sites/[slug]/page.tsx). Independent from Save: publishing doesn't
// require re-submitting the whole draft, and un-publishing doesn't discard it.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminSession();
  if (!adminUser) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!project) return NextResponse.json({ error: "Проект не найден" }, { status: 404 });

  const updated = await prisma.project.update({
    where: { id },
    data: { publishedAt: project.publishedAt ? null : new Date() },
    select: { publishedAt: true },
  });

  return NextResponse.json({ ok: true, publishedAt: updated.publishedAt });
}
