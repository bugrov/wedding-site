import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminDashboardPage() {
  const adminUser = await getAdminSession();
  if (!adminUser) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-neutral-50">
      <AdminHeader email={adminUser.email} />
      <div className="mx-auto max-w-5xl space-y-4 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">Дашборд</h1>
        <p className="text-neutral-600">
          Сводка новых заявок, активных проектов и ближайших свадеб появится здесь позже — пока
          загляните в «Заявки» или «Проекты».
        </p>
      </div>
    </main>
  );
}
