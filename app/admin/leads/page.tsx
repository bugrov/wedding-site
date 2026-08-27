import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { TEMPLATES } from "@/lib/templates/registry";
import { LeadStatus } from "@/app/generated/prisma/client";
import { LeadActions } from "./lead-actions";

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  REJECTED: "Отклонена",
};

const STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
  NEW: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  REJECTED: "bg-neutral-200 text-neutral-600",
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminLeadsPage() {
  const adminUser = await getAdminSession();
  if (!adminUser) redirect("/admin/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true } } },
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <AdminHeader email={adminUser.email} />
      <div className="mx-auto max-w-5xl space-y-4 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Заявки</h1>

        {leads.length === 0 ? (
          <p className="text-neutral-600">Пока нет ни одной заявки.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs tracking-wide text-neutral-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Пара</th>
                  <th className="px-4 py-3 font-medium">Дата свадьбы</th>
                  <th className="px-4 py-3 font-medium">Контакт</th>
                  <th className="px-4 py-3 font-medium">Шаблон</th>
                  <th className="px-4 py-3 font-medium">Заявка от</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {lead.groomName} и {lead.brideName}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {dateFormatter.format(lead.weddingDate)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      <div>{lead.contactName}</div>
                      <div className="text-neutral-500">
                        {lead.phone}
                        {lead.telegram ? ` · ${lead.telegram}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {TEMPLATES[lead.templateId]?.label ?? lead.templateId}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {dateTimeFormatter.format(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[lead.status]}`}
                      >
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.status === "NEW" && <LeadActions leadId={lead.id} />}
                      {lead.project && (
                        <Link
                          href={`/admin/projects/${lead.project.id}`}
                          className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                        >
                          Открыть проект
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
