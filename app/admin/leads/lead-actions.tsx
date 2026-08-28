"use client";

import { useLeadActionMutation } from "@/lib/hooks/use-lead-action-mutation";

// The only two things an operator does to a NEW lead — convert it into a
// real project (see plan) or reject it (spam / didn't work out). Both are
// server-validated too (see PATCH /api/admin/leads/[id]) — this is just the
// button, not the source of truth for "can this lead still be acted on".
export function LeadActions({ leadId }: { leadId: string }) {
  const actionMutation = useLeadActionMutation(leadId);
  const pending = actionMutation.isPending ? actionMutation.variables : null;

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => actionMutation.mutate("reject")}
        disabled={pending !== null}
        className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
      >
        {pending === "reject" ? "…" : "Отклонить"}
      </button>
      <button
        type="button"
        onClick={() => actionMutation.mutate("convert")}
        disabled={pending !== null}
        className="cursor-pointer rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending === "convert" ? "…" : "Создать проект"}
      </button>
    </div>
  );
}
