import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/schemas/lead";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  // Public, unauthenticated endpoint — without this, a script can flood the
  // leads inbox and, at volume, exhaust the DB connection pool. A generous
  // cap: legitimate use is one couple submitting once, not a login form.
  const { allowed, retryAfterSeconds } = checkRateLimit(`leads:${getClientIp(request)}`, {
    maxAttempts: 10,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много заявок. Попробуйте позже." },
      {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      },
    );
  }

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
