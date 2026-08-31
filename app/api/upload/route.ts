import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { extensionForContentType, isUploadConfigured, uploadPhoto } from "@/lib/storage/s3";

// Caddy caps request bodies at 10MB in prod (see Caddyfile) — stay under
// that with margin so a rejected-for-size upload gets our JSON error instead
// of a bare Caddy 413.
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

// Public, unauthenticated endpoint — the lead's own public configurator
// builds blocksConfig (including photos) before any admin/client account
// exists, so this can't be gated behind a session.
export async function POST(request: Request) {
  if (!isUploadConfigured()) {
    return NextResponse.json({ error: "Загрузка фото временно недоступна." }, { status: 503 });
  }

  const { allowed, retryAfterSeconds } = checkRateLimit(`upload:${getClientIp(request)}`, {
    maxAttempts: 30,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много загрузок. Попробуйте позже." },
      {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден в запросе." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Файл слишком большой (максимум 8 МБ)." }, { status: 413 });
  }

  if (!extensionForContentType(file.type)) {
    return NextResponse.json(
      { error: "Поддерживаются только JPEG, PNG, WEBP и GIF." },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadPhoto(buffer, file.type);

  return NextResponse.json({ url }, { status: 201 });
}
