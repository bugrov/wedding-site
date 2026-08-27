import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/schemas/auth";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  // Not behind proxy.ts (matcher excludes /api), so x-forwarded-for comes
  // straight from whatever's in front in prod (nginx, per plan) — falls back
  // to a shared bucket in local dev where nothing sets it.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много попыток входа. Попробуйте позже." },
      {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Проверьте правильность заполнения полей",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  const adminUser = await prisma.adminUser.findUnique({ where: { email } });
  // Same generic message whether the email doesn't exist or the password is
  // wrong — don't tell an attacker which one it was.
  const invalidCredentials = () =>
    NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });

  if (!adminUser) return invalidCredentials();

  const isValid = await verifyPassword(password, adminUser.passwordHash);
  if (!isValid) return invalidCredentials();

  await createAdminSession(adminUser.id);

  return NextResponse.json({ ok: true });
}
