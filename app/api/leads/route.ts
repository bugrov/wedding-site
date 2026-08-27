import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/schemas/lead";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

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

  const lead = await prisma.lead.create({
    data: {
      contactName: data.contactName,
      groomName: data.groomName,
      brideName: data.brideName,
      weddingDate: data.weddingDate,
      phone: data.phone,
      telegram: data.telegram || null,
      comment: data.comment || null,
      templateId: data.templateId,
      themeId: data.themeId || null,
      blocksConfig: data.blocksConfig,
    },
  });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
