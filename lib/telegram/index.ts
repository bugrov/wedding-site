const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// api.telegram.org's core IP range is unreachable from this VPS (still
// blocked at the RU network level despite Telegram itself being unblocked —
// confirmed by a direct connect timeout, not a code bug). A Cloudflare
// Worker (not blocked) reverse-proxies the exact same path straight to
// Telegram's API, so this only changes the host, never the request shape.
const TELEGRAM_API_BASE = process.env.TELEGRAM_API_BASE_URL ?? "https://api.telegram.org";

// Returns whether it worked instead of throwing — a client hasn't connected
// Telegram, or the bot token is misconfigured, or the API is briefly down
// are all reasons the RSVP write itself must still succeed (see callers:
// never let this block or fail the actual data write).
export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  if (!BOT_TOKEN) return false;

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
