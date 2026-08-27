import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { LogoutButton } from "./logout-button";

export default async function AdminDashboardPage() {
  const adminUser = await getAdminSession();
  if (!adminUser) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900">Дашборд</h1>
          <LogoutButton />
        </div>
        <p className="text-neutral-600">
          Вы вошли как <span className="font-medium">{adminUser.email}</span>. Это заглушка — дальше
          здесь появятся сводка заявок, активных проектов и ближайших свадеб.
        </p>
      </div>
    </main>
  );
}
