import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";

// Telegram Bot API webhook. Configured once via:
//   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domain>/api/telegram/webhook"
// Telegram retries on a non-2xx response, so every path here returns 200 —
// an update we don't act on isn't a server error, it's just not for us.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = body?.message;
  const text: string | undefined = message?.text;
  const chatId: number | undefined = message?.chat?.id;

  if (typeof text !== "string" || typeof chatId !== "number") {
    return NextResponse.json({ ok: true });
  }

  // The client dashboard's "Подключить" button deep-links to
  // t.me/<bot>?start=<clientAccessToken>, which Telegram delivers here as
  // "/start <token>". No separate secret needed for this endpoint — the
  // token is the same one that already gates the client dashboard itself
  // (see plan: "ссылка и есть пароль"), so only someone who already has a
  // project's client link can link a chat to it.
  const match = /^\/start\s+(\S+)$/.exec(text);
  if (!match) {
    return NextResponse.json({ ok: true });
  }

  const project = await prisma.project.findUnique({ where: { clientAccessToken: match[1] } });
  if (!project) {
    await sendTelegramMessage(String(chatId), "Ссылка недействительна.");
    return NextResponse.json({ ok: true });
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { telegramChatId: String(chatId) },
  });

  await sendTelegramMessage(
    String(chatId),
    `Готово! Сюда будут приходить уведомления об откликах гостей на сайт «${project.groomName} и ${project.brideName}».`,
  );

  return NextResponse.json({ ok: true });
}
