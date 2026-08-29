import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rsvpSchema } from "@/lib/schemas/rsvp";
import { ProjectStatus } from "@/app/generated/prisma/client";
import { sendTelegramMessage } from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  // Public, unauthenticated endpoint, and projectId isn't a secret (it's
  // right there in the published page's markup) — without this, anyone who
  // views source can flood a real couple's guest list and Telegram chat
  // with fake responses. Looser than login: a shared venue/family wifi can
  // legitimately have several guests RSVPing from the same IP.
  const { allowed, retryAfterSeconds } = checkRateLimit(`rsvp:${getClientIp(request)}`, {
    maxAttempts: 20,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = rsvpSchema.safeParse(body);

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

  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { status: true, publishedAt: true, telegramChatId: true },
  });

  // Not just "does this project exist" — an unpublished project shouldn't
  // silently accept RSVPs guests can't even see the form for, and a
  // published-but-unpaid one is a watermarked preview (see
  // components/site-payment-watermark.tsx): the client re-check on the form
  // itself (previewMode) already stops a guest from submitting there, but
  // this is the actual enforcement — never trust the disabled-button alone.
  const isPaid =
    !!project?.publishedAt &&
    (project.status === ProjectStatus.PAID || project.status === ProjectStatus.PUBLISHED);

  if (!isPaid) {
    return NextResponse.json({ error: "Форма пока недоступна" }, { status: 403 });
  }

  // Soft dedup, no personalized links yet (see plan): a case/whitespace
  // -insensitive name match against this project's existing responses is
  // treated as "changed their mind" (update) rather than a new guest.
  const normalizedName = data.name.trim().replace(/\s+/g, " ");
  const existing = await prisma.rsvpResponse.findFirst({
    where: { projectId: data.projectId, name: { equals: normalizedName, mode: "insensitive" } },
  });

  // A named pair always counts as at least 2, regardless of what the guest
  // typed into headcount — that field and plusOneName are two separate
  // inputs on the form, easy to fill one and forget the other (see feedback:
  // client couldn't tell which number to give the venue for exactly this
  // mismatch). max(), not an override, so families larger than a pair can
  // still report their real headcount.
  const headcount = data.plusOneName ? Math.max(data.headcount ?? 1, 2) : (data.headcount ?? 1);

  const responseData = {
    projectId: data.projectId,
    name: normalizedName,
    attending: data.attending,
    headcount,
    foodPref: data.foodPref || null,
    drinkPref: data.drinkPref || null,
    plusOneName: data.plusOneName || null,
    comment: data.comment || null,
  };

  if (existing) {
    await prisma.rsvpResponse.update({ where: { id: existing.id }, data: responseData });
  } else {
    await prisma.rsvpResponse.create({ data: responseData });
  }

  if (project.telegramChatId) {
    const lines = [
      `${existing ? "Отклик обновлён" : "Новый отклик"}: ${normalizedName}`,
      data.attending ? `Придёт, кол-во: ${headcount}` : "Не сможет прийти",
      data.plusOneName ? `Пара: ${data.plusOneName}` : null,
      data.foodPref ? `Питание: ${data.foodPref}` : null,
      data.drinkPref ? `Напитки: ${data.drinkPref}` : null,
      data.comment ? `Комментарий: ${data.comment}` : null,
    ].filter((line): line is string => line !== null);

    await sendTelegramMessage(project.telegramChatId, lines.join("\n"));
  }

  return NextResponse.json({ ok: true });
}
