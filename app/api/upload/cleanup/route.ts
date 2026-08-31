import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { deleteFile, keyFromPublicUrl } from "@/lib/storage/s3";

// Called when a photo/track upload replaces a previous one in the same
// field (see lib/hooks/use-file-upload-mutation.ts) — the old file would
// otherwise linger in the bucket forever, unreferenced. Public and
// unauthenticated like /api/upload itself (the lead's own configurator has
// no account yet), which means the URL passed in isn't a secret either way
// — it's already sitting in plain sight in any published site's HTML. So
// this only ever deletes a key that doesn't appear in ANY saved Lead or
// Project's blocksConfig, no matter who calls it or with what URL: a real,
// in-use photo can never be reached through here.
export async function POST(request: Request) {
  const { allowed } = checkRateLimit(`upload-cleanup:${getClientIp(request)}`, {
    maxAttempts: 60,
    windowMs: 15 * 60 * 1000,
  });
  // Silent no-op on rate-limit, not an error — this is a best-effort
  // background tidy-up, never something the caller's UI waits on.
  if (!allowed) return NextResponse.json({ ok: true });

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : null;

  if (!url || !keyFromPublicUrl(url)) {
    return NextResponse.json({ ok: true });
  }

  const [projectMatch, leadMatch] = await Promise.all([
    prisma.$queryRaw<
      { exists: boolean }[]
    >`SELECT EXISTS (SELECT 1 FROM projects WHERE strpos(blocks_config::text, ${url}) > 0) AS exists`,
    prisma.$queryRaw<
      { exists: boolean }[]
    >`SELECT EXISTS (SELECT 1 FROM leads WHERE strpos(blocks_config::text, ${url}) > 0) AS exists`,
  ]);

  if (!projectMatch[0]?.exists && !leadMatch[0]?.exists) {
    await deleteFile(url);
  }

  return NextResponse.json({ ok: true });
}
