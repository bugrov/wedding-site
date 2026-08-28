"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRsvpMutation } from "./use-rsvp-mutation";

const rsvpFormSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  attending: z.enum(["yes", "no"]),
  // Plain string, not z.coerce.number() — avoids fighting react-hook-form's
  // resolver typing over input-vs-output types; server-side rsvpSchema does
  // the real parsing/bound-checking.
  headcount: z.string().optional(),
  food: z.string().optional(),
  drink: z.string().optional(),
  plusOne: z.string().optional(),
  comment: z.string().optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

// Shared by every template's RSVP block — the schema, validation, and submit
// wiring are identical everywhere; only the surrounding markup differs per
// template (see plan: templates are renderers, not owners of business
// logic). Each template's own rsvp.tsx just lays out these fields.
export function useRsvpForm(projectId: string | undefined) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: { attending: "yes" },
  });

  const rsvpMutation = useRsvpMutation();

  const onSubmit = handleSubmit(async (data) => {
    // projectId is only set on a real published site (see
    // lib/templates/types.ts) — previewMode being true everywhere else
    // already disables the submit button, so reaching here without it would
    // mean that guard broke, not a case worth a user-facing error message.
    if (!projectId) return;

    try {
      await rsvpMutation.mutateAsync({
        projectId,
        name: data.name,
        attending: data.attending === "yes",
        headcount: data.headcount || undefined,
        foodPref: data.food || undefined,
        drinkPref: data.drink || undefined,
        plusOneName: data.plusOne || undefined,
        comment: data.comment || undefined,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось отправить ответ");
      return;
    }

    toast.success("Спасибо! Ваш ответ получен.");
  });

  return { register, errors, isSubmitting, attending: watch("attending"), onSubmit };
}
