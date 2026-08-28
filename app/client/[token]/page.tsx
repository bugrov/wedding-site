import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { RsvpTable } from "@/components/client/rsvp-table";

// Client's private dashboard, no login — the long random token in the URL
// *is* the credential (see plan: one service/one DB, so a JWT would add
// risk without a real benefit over checking a token against this table).
// The operator copies this link out of /admin/projects/[id] and sends it to
// the couple once. Read-only except for deleting a duplicate response —
// content editing stays the operator's job, this is guest data, not site
// content (see plan).
async function getProjectByToken(token: string) {
  return prisma.project.findUnique({
    where: { clientAccessToken: token },
    include: { rsvpResponses: { orderBy: { createdAt: "desc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) return { title: "Не найдено" };
  return { title: `Гости — ${project.groomName} и ${project.brideName}` };
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const project = await getProjectByToken(token);
  if (!project) notFound();

  const responses = project.rsvpResponses;
  const attending = responses.filter((r) => r.attending);
  const notAttending = responses.filter((r) => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.headcount, 0);

  // Absent in local dev until a real bot is registered with @BotFather (see
  // .env.example) — the whole section just doesn't render rather than
  // showing a broken/dead link.
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl space-y-8 p-8">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {project.groomName} и {project.brideName}
          </h1>
          <p className="text-sm text-neutral-500">
            Свадьба {dateFormatter.format(project.weddingDate)} · список откликов гостей
          </p>
        </div>

        {botUsername && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4">
            {project.telegramChatId ? (
              <p className="text-sm text-neutral-700">
                Telegram-уведомления о новых откликах подключены
              </p>
            ) : (
              <>
                <p className="text-sm text-neutral-700">
                  Получайте уведомление в Telegram о каждом новом отклике гостя
                </p>
                <a
                  href={`https://t.me/${botUsername}?start=${token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Подключить
                </a>
              </>
            )}
          </div>
        )}

        {/* The one number this whole page exists to answer clearly (see
            feedback: "не пойму, какой мне итог считать чтоб отдать в
            ресторан") — same totalGuests as the breakdown card below, just
            given its own unambiguous, headline presentation instead of
            being one of three same-sized cards the client has to parse. */}
        <div className="rounded-lg border-2 border-neutral-900 bg-white p-6 text-center">
          <p className="text-4xl font-semibold text-neutral-900">{totalGuests}</p>
          <p className="mt-1 text-sm text-neutral-600">
            Итого человек — эту цифру можно передавать на площадку/в ресторан
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-2xl font-semibold text-neutral-900">
              {attending.length} из {responses.length}
            </p>
            <p className="text-sm text-neutral-500">подтвердили участие</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-2xl font-semibold text-neutral-900">{totalGuests}</p>
            <p className="text-sm text-neutral-500">гостей придёт (с учётом пары)</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <p className="text-2xl font-semibold text-neutral-900">{notAttending.length}</p>
            <p className="text-sm text-neutral-500">не смогут прийти</p>
          </div>
        </div>

        {responses.length === 0 ? (
          <p className="text-neutral-600">Пока никто не ответил.</p>
        ) : (
          <RsvpTable token={token} responses={responses} />
        )}
      </div>
    </main>
  );
}
