const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Returns whether it worked instead of throwing — a client hasn't connected
// Telegram, or the bot token is misconfigured, or api.telegram.org is briefly
// down are all reasons the RSVP write itself must still succeed (see
// callers: never let this block or fail the actual data write).
export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!BOT_TOKEN) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
