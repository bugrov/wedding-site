import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/session";
import { projectUpdateSchema } from "@/lib/schemas/project";
import { Prisma } from "@/app/generated/prisma/client";

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
        slug: data.slug,
        groomName: data.groomName,
        brideName: data.brideName,
        weddingDate: data.weddingDate,
        templateId: data.templateId,
        status: data.status,
        blocksConfig: data.blocksConfig,
      },
    });
  } catch (error) {
    // The DB's unique constraint on slug is the actual source of truth for
    // "is this taken" (a pre-check query here would race against another
    // save) — P2002 is Prisma's code for exactly that violation.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Такой адрес сайта уже занят другим проектом" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
