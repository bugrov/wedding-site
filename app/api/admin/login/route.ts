import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/schemas/auth";

export async function POST(request: Request) {
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
