"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { RsvpResponse } from "@/app/generated/prisma/client";

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

// Two-click confirm instead of window.confirm() — a native dialog blocks
// the whole page (and this is the one destructive action a client can take
// on their own, see plan: "клиент может сам удалить дубль"), so a plain,
// dismissable in-place state reads just as clearly without that.
function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="cursor-pointer rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
        >
          Точно удалить
        </button>
      </div>
    );
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="cursor-pointer text-xs text-neutral-500 underline underline-offset-4 hover:text-red-600"
      >
        Удалить
      </button>
    </div>
  );
}

export function RsvpTable({ token, responses }: { token: string; responses: RsvpResponse[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/client/${token}/rsvp/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Не удалось удалить запись");
        return;
      }
      toast.success("Запись удалена");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-xs tracking-wide text-neutral-500 uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Имя</th>
            <th className="px-4 py-3 font-medium">Придёт?</th>
            <th className="px-4 py-3 font-medium">Кол-во</th>
            <th className="px-4 py-3 font-medium">Питание</th>
            <th className="px-4 py-3 font-medium">Напитки</th>
            <th className="px-4 py-3 font-medium">Пара</th>
            <th className="px-4 py-3 font-medium">Комментарий</th>
            <th className="px-4 py-3 font-medium">Когда</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {responses.map((r) => (
            <tr key={r.id} className={deletingId === r.id ? "opacity-50" : undefined}>
              <td className="px-4 py-3 font-medium text-neutral-900">{r.name}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    r.attending
                      ? "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                      : "rounded-full bg-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600"
                  }
                >
                  {r.attending ? "Да" : "Нет"}
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-700">{r.attending ? r.headcount : "—"}</td>
              <td className="px-4 py-3 text-neutral-700">{r.foodPref || "—"}</td>
              <td className="px-4 py-3 text-neutral-700">{r.drinkPref || "—"}</td>
              <td className="px-4 py-3 text-neutral-700">{r.plusOneName || "—"}</td>
              <td className="px-4 py-3 text-neutral-700">{r.comment || "—"}</td>
              <td className="px-4 py-3 text-neutral-500">
                {dateTimeFormatter.format(r.createdAt)}
              </td>
              <td className="px-4 py-3">
                <DeleteButton onConfirm={() => handleDelete(r.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
