"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Section, Eyebrow, DisplayHeading } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

const rsvpFormSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  attending: z.enum(["yes", "no"]),
  // Plain string, not z.coerce.number() — avoids fighting react-hook-form's
  // resolver typing over input-vs-output types for a field this form only
  // stubs for now (see TODO below); server-side validation in step 7 will
  // parse/bound-check the real number.
  headcount: z.string().optional(),
  food: z.string().optional(),
  plusOne: z.string().optional(),
  comment: z.string().optional(),
});

type RsvpFormValues = z.infer<typeof rsvpFormSchema>;

const inputClassName = "mt-1 w-full rounded-sm border border-black/20 bg-white px-3 py-2 text-sm";

export function TuscanyRsvp({ content }: BlockProps<"rsvp">) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: { attending: "yes" },
  });

  const attending = watch("attending");

  const onSubmit = async (data: RsvpFormValues) => {
    // TODO(step 7): wire to POST /api/rsvp once that endpoint exists —
    // this block is validated/functional UI, not yet connected to storage.
    console.log("RSVP submit (stub, not yet wired to /api/rsvp)", data);
    toast.success("Спасибо! Ваш ответ получен.");
  };

  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Подтверждение участия</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        Будете с нами?
      </DisplayHeading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-sm space-y-4 text-left"
        noValidate
      >
        <div>
          <label className="block text-sm font-medium" htmlFor="rsvp-name">
            Ваше имя
          </label>
          <input id="rsvp-name" {...register("name")} className={inputClassName} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium">Вы придёте?</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["yes", "Да, буду"],
                ["no", "Не смогу"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center justify-center rounded-sm border border-black/20 px-4 py-2 text-sm font-medium transition has-checked:border-(--color-primary) has-checked:bg-(--color-primary) has-checked:text-(--color-background) has-focus-visible:ring-2 has-focus-visible:ring-(--color-accent)"
              >
                <input type="radio" value={value} {...register("attending")} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {attending === "yes" && (
          <>
            <div>
              <label className="block text-sm font-medium" htmlFor="rsvp-headcount">
                Сколько человек (с вами)
              </label>
              <input
                id="rsvp-headcount"
                type="number"
                min={1}
                max={10}
                {...register("headcount")}
                className={inputClassName}
              />
              {errors.headcount && (
                <p className="mt-1 text-sm text-red-600">{errors.headcount.message}</p>
              )}
            </div>

            {content.askFood && (
              <div>
                <label className="block text-sm font-medium" htmlFor="rsvp-food">
                  Пожелания по питанию
                </label>
                <input id="rsvp-food" {...register("food")} className={inputClassName} />
              </div>
            )}

            {content.askPlusOne && (
              <div>
                <label className="block text-sm font-medium" htmlFor="rsvp-plusone">
                  Имя пары (+1), если будет
                </label>
                <input id="rsvp-plusone" {...register("plusOne")} className={inputClassName} />
              </div>
            )}
          </>
        )}

        {content.askComment && (
          <div>
            <label className="block text-sm font-medium" htmlFor="rsvp-comment">
              Комментарий
            </label>
            <textarea
              id="rsvp-comment"
              rows={3}
              {...register("comment")}
              className={inputClassName}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-background) transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Отправляем…" : "Отправить"}
        </button>
      </form>
    </Section>
  );
}
