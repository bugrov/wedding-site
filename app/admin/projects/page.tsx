import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AdminHeader } from "@/components/admin/admin-header";
import { TEMPLATES } from "@/lib/templates/registry";
import { ProjectStatus } from "@/app/generated/prisma/client";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  IN_PROGRESS: "В работе",
  IN_REVIEW: "На согласовании",
  PAID: "Оплачено",
  PUBLISHED: "Опубликован",
  CANCELLED: "Отменено",
};

const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  PAID: "bg-purple-100 text-purple-800",
  PUBLISHED: "bg-green-100 text-green-800",
  CANCELLED: "bg-neutral-200 text-neutral-600",
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

export default async function AdminProjectsPage() {
  const adminUser = await getAdminSession();
  if (!adminUser) redirect("/admin/login");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-neutral-50">
      <AdminHeader email={adminUser.email} />
      <div className="mx-auto max-w-5xl space-y-4 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Проекты</h1>

        {projects.length === 0 ? (
          <p className="text-neutral-600">
            Пока нет ни одного проекта — создайте его из заявки в разделе «Заявки».
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs tracking-wide text-neutral-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Пара</th>
                  <th className="px-4 py-3 font-medium">Дата свадьбы</th>
                  <th className="px-4 py-3 font-medium">Поддомен</th>
                  <th className="px-4 py-3 font-medium">Шаблон</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium">Опубликован</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {project.groomName} и {project.brideName}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {dateFormatter.format(project.weddingDate)}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-700">{project.slug}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {TEMPLATES[project.templateId]?.label ?? project.templateId}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[project.status]}`}
                      >
                        {STATUS_LABELS[project.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {project.publishedAt ? "Да" : "Нет"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm font-medium text-neutral-900 underline underline-offset-4"
                      >
                        Редактировать
                      </Link>
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
