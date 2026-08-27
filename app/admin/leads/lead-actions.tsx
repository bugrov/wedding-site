"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// The only two things an operator does to a NEW lead — convert it into a
// real project (see plan) or reject it (spam / didn't work out). Both are
// server-validated too (see PATCH /api/admin/leads/[id]) — this is just the
// button, not the source of truth for "can this lead still be acted on".
export function LeadActions({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"convert" | "reject" | null>(null);

  const act = async (action: "convert" | "reject") => {
    setPending(action);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error ?? "Не удалось выполнить действие");
        return;
      }

      if (action === "convert" && data?.projectId) {
        toast.success("Проект создан");
        router.push(`/admin/projects/${data.projectId}`);
        return;
      }

      toast.success("Заявка отклонена");
      router.refresh();
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => act("reject")}
        disabled={pending !== null}
        className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
      >
        {pending === "reject" ? "…" : "Отклонить"}
      </button>
      <button
        type="button"
        onClick={() => act("convert")}
        disabled={pending !== null}
        className="cursor-pointer rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending === "convert" ? "…" : "Создать проект"}
      </button>
    </div>
  );
}
