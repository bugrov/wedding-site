import Link from "next/link";
import { LogoutButton } from "./logout-button";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Дашборд" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/projects", label: "Проекты" },
];

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-700 hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
