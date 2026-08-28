import { useMutation } from "@tanstack/react-query";
import { fetchOrThrow } from "./fetch-or-throw";

// headcount travels as the raw number-input string — the RSVP form's own
// zod schema keeps it a string client-side (see
// components/templates/tuscany/rsvp.tsx), rsvpSchema.headcount's
// z.coerce.number() re-parses it server-side.
export type RsvpSubmission = {
  projectId: string;
  name: string;
  attending: boolean;
  headcount?: string;
  foodPref?: string;
  drinkPref?: string;
  plusOneName?: string;
  comment?: string;
};

export function useRsvpMutation() {
  return useMutation({
    mutationFn: async (payload: RsvpSubmission) => {
      const res = await fetchOrThrow("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Не удалось отправить ответ. Попробуйте ещё раз.");
    },
  });
}
