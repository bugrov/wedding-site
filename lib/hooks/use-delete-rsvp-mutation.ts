import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchOrThrow } from "./fetch-or-throw";

// token identifies which client dashboard this delete is scoped to (see
// app/api/client/[token]/rsvp/[id]/route.ts) — passed in once per table
// instance rather than per call, since one RsvpTable only ever deletes rows
// belonging to its own project. Responses aren't in a query cache (the
// table's initial data comes from the server component), so a successful
// delete falls back to router.refresh() to re-pull the server-rendered list.
export function useDeleteRsvpMutation(token: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (responseId: string) => {
      const res = await fetchOrThrow(`/api/client/${token}/rsvp/${responseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
    },
    onSuccess: () => {
      toast.success("Запись удалена");
      router.refresh();
    },
    onError: () => {
      toast.error("Не удалось удалить запись");
    },
  });
}
