"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRsvpMutation, type ExistingRsvpSummary } from "./use-rsvp-mutation";

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

// Deliberately unstyled by template theme — this is a transient system
// prompt, not part of any template's visual identity, so it stays neutral
// rather than trying to inherit CSS vars a global toast portal may not
// actually inherit from the active template's ThemeWrapper.
function DuplicateNamePrompt({
  name,
  existing,
  onUpdate,
  onCreateNew,
}: {
  name: string;
  existing: ExistingRsvpSummary;
  onUpdate: () => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-4 text-sm text-black shadow-lg">
      <p className="font-medium">Уже есть отклик от «{name}»</p>
      <p className="mt-1 text-black/70">
        {existing.attending ? `Придёт, гостей: ${existing.headcount}` : "Не сможет прийти"}. Это
        ваш предыдущий ответ, или другой гость с тем же именем?
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onUpdate}
          className="min-h-11 flex-1 rounded-sm bg-black px-3 text-white cursor-pointer hover:opacity-90"
        >
          Это я, обновить ответ
        </button>
        <button
          type="button"
          onClick={onCreateNew}
          className="min-h-11 flex-1 rounded-sm border border-black/20 px-3 cursor-pointer hover:bg-black/5"
        >
          Другой гость
        </button>
      </div>
    </div>
  );
}

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

  const submit = async (
    data: RsvpFormValues,
    resolution?: "update" | "create",
    existingResponseId?: string,
  ) => {
    if (!projectId) return;

    let result;
    try {
      result = await rsvpMutation.mutateAsync({
        projectId,
        name: data.name,
        attending: data.attending === "yes",
        headcount: data.headcount || undefined,
        foodPref: data.food || undefined,
        drinkPref: data.drink || undefined,
        plusOneName: data.plusOne || undefined,
        comment: data.comment || undefined,
        resolution,
        existingResponseId,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось отправить ответ");
      return;
    }

    if ("duplicate" in result) {
      toast.custom(
        (t) => (
          <DuplicateNamePrompt
            name={data.name}
            existing={result.existing}
            onUpdate={() => {
              toast.dismiss(t);
              void submit(data, "update", result.existing.id);
            }}
            onCreateNew={() => {
              toast.dismiss(t);
              void submit(data, "create");
            }}
          />
        ),
        { duration: Infinity },
      );
      return;
    }

    toast.success("Спасибо! Ваш ответ получен.");
  };

  const onSubmit = handleSubmit(async (data) => {
    // projectId is only set on a real published site (see
    // lib/templates/types.ts) — previewMode being true everywhere else
    // already disables the submit button, so reaching here without it would
    // mean that guard broke, not a case worth a user-facing error message.
    await submit(data);
  });

  return { register, errors, isSubmitting, attending: watch("attending"), onSubmit };
}
