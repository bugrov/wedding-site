import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/session";
import { projectUpdateSchema } from "@/lib/schemas/project";

// Saves the operator's edits (names, date, template, status, block content) —
// never touches publishedAt, so a project stays live to guests while the
// operator keeps working on it (see plan: "сайт остаётся опубликованным всё
// это время" even if status moves back to "на согласовании").
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminUser = await getAdminSession();
  if (!adminUser) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectUpdateSchema.safeParse(body);

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

  try {
    await prisma.project.update({
      where: { id },
      data: {
        groomName: data.groomName,
        brideName: data.brideName,
        weddingDate: data.weddingDate,
        templateId: data.templateId,
        status: data.status,
        blocksConfig: data.blocksConfig,
      },
    });
  } catch {
    return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
