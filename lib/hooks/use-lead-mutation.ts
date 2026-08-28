import { useMutation } from "@tanstack/react-query";
import type { LeadInput } from "@/lib/schemas/lead";
import { fetchOrThrow } from "./fetch-or-throw";

// weddingDate travels as the raw <input type="date"> string, not a Date —
// the public configurator keeps it in its own useState outside react-hook-
// form (see components/landing/configurator.tsx), and the server re-parses
// it with the same leadSchema (z.coerce.date accepts the string as-is).
export type LeadSubmission = Omit<LeadInput, "weddingDate"> & { weddingDate: string };

export function useLeadMutation() {
  return useMutation({
    mutationFn: async (payload: LeadSubmission) => {
      const res = await fetchOrThrow("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
    },
  });
}
