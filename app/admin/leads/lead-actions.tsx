"use client";

import { useState } from "react";
import { useLeadActionMutation } from "@/lib/hooks/use-lead-action-mutation";
import { useDeleteLeadMutation } from "@/lib/hooks/use-delete-lead-mutation";

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

// Available regardless of status (NEW/IN_PROGRESS/REJECTED) — mainly for
// clearing out the operator's own test submissions, which can just as
// easily have already been converted or rejected by the time they notice
// (see feedback: "мало ли я демо заявок для теста создал"). Two-click
// confirm rather than window.confirm(), matching RsvpTable's DeleteButton —
// this one is more consequential (takes the converted project, its guests
// and RSVPs, and any now-unreferenced photos/music with it), so the confirm
// button spells that out instead of a bare "Точно удалить".
export function DeleteLeadButton({ leadId, hasProject }: { leadId: string; hasProject: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const deleteMutation = useDeleteLeadMutation();

  if (confirming) {
    return (
      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleteMutation.isPending}
          className="cursor-pointer rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={() => deleteMutation.mutate(leadId)}
          disabled={deleteMutation.isPending}
          className="cursor-pointer rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleteMutation.isPending
            ? "…"
            : hasProject
              ? "Удалить с проектом"
              : "Точно удалить"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-1 text-right">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="cursor-pointer text-xs text-neutral-500 underline underline-offset-4 hover:text-red-600"
      >
        Удалить заявку
      </button>
    </div>
  );
}
