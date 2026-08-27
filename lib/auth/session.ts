import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import type { AdminUser } from "@/app/generated/prisma/client";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createAdminSession(adminUserId: string): Promise<void> {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.adminSession.create({
    data: { id, adminUserId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // "/" — not "/admin": the login/logout API routes live under /api/admin/*,
    // a different path prefix, so a cookie scoped to "/admin" would never be
    // sent on those requests (this bit us: logout silently failed to see the
    // cookie at all, leaving the session alive in the DB).
    path: "/",
    expires: expiresAt,
  });
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
    include: { adminUser: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.adminSession.delete({ where: { id: sessionId } }).catch(() => {});
    return null;
  }

  return session.adminUser;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.adminSession.delete({ where: { id: sessionId } }).catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE);
}
