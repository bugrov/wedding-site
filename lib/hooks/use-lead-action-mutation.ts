import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchOrThrow } from "./fetch-or-throw";

type LeadAction = "convert" | "reject";
type LeadActionResult = { action: LeadAction; projectId?: string };

// The only two things an operator does to a NEW lead — convert it into a
// real project (see plan) or reject it (spam / didn't work out). Both are
// server-validated too (see PATCH /api/admin/leads/[id]) — this hook just
// drives the button, not the source of truth for "can this lead still be
// acted on".
export function useLeadActionMutation(leadId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (action: LeadAction): Promise<LeadActionResult> => {
      const res = await fetchOrThrow(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Не удалось выполнить действие");
      return { action, projectId: data?.projectId };
    },
    onSuccess: ({ action, projectId }) => {
      if (action === "convert" && projectId) {
        toast.success("Проект создан");
        router.push(`/admin/projects/${projectId}`);
        return;
      }
      toast.success("Заявка отклонена");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Не удалось выполнить действие");
    },
  });
}
