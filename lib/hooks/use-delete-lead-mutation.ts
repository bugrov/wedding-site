import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchOrThrow } from "./fetch-or-throw";

// Deletes a lead and, if it was converted, the project it became — see
// DELETE /api/admin/leads/[id] for the actual cascade (project + guests +
// RSVPs + orphaned photo/music files). Leads aren't in a query cache (the
// admin list is server-rendered), so router.refresh() re-pulls it.
export function useDeleteLeadMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (leadId: string) => {
      const res = await fetchOrThrow(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Не удалось удалить заявку");
    },
    onSuccess: () => {
      toast.success("Заявка удалена");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Не удалось удалить заявку");
    },
  });
}
