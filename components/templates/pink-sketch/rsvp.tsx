"use client";

import { Section, Eyebrow, DisplayHeading } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useRsvpForm } from "@/lib/hooks/use-rsvp-form";
import { cn } from "@/lib/utils";
import { PHOTO_FRAME_CLASSNAME } from "./decor";

const inputClassName =
  "mt-1 min-h-11 w-full rounded-full border border-black/20 bg-(--color-background) px-4 py-2 text-sm";

const deadlineFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

// The card gets the same even pink frame as every photo in this direction
// (see decor.tsx's PHOTO_FRAME_CLASSNAME) — the "открытка" register other
// templates reach for with borders/wax seals, this one reaches for with its
// own signature frame instead.
export function PinkSketchRsvp({ project, content, previewMode }: BlockProps<"rsvp">) {
  const { register, errors, isSubmitting, attending, onSubmit } = useRsvpForm(project.id);

  return (
    <Section bleed="contained" className="text-center">
      <div className="mx-auto max-w-lg">
        <div
          className={cn(
            "bg-(--color-background) px-6 py-10 md:px-10 md:py-12",
            PHOTO_FRAME_CLASSNAME,
          )}
        >
          <Eyebrow>Подтверждение участия</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
            Будете с нами?
          </DisplayHeading>
          {content.deadline && !Number.isNaN(new Date(content.deadline).getTime()) && (
            <p className="mt-2 text-sm text-(--color-text)/70">
              Просим ответить до {deadlineFormatter.format(new Date(content.deadline))}
            </p>
          )}
          <form
            onSubmit={onSubmit}
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
                    className="flex min-h-11 items-center justify-center rounded-full border border-black/20 px-4 py-2 text-sm font-medium transition has-checked:border-(--color-primary) has-checked:bg-(--color-primary) has-checked:text-(--color-background) has-focus-visible:ring-2 has-focus-visible:ring-(--color-accent)"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("attending")}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {attending === "yes" && (
              <>
                {content.askPlusOne && (
                  <div>
                    <label className="block text-sm font-medium" htmlFor="rsvp-plusone">
                      Имя пары, если будет
                    </label>
                    <input id="rsvp-plusone" {...register("plusOne")} className={inputClassName} />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium" htmlFor="rsvp-headcount">
                    Сколько человек, включая вас
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

                {content.askDrink && (
                  <div>
                    <label className="block text-sm font-medium" htmlFor="rsvp-drink">
                      Пожелания по напиткам
                    </label>
                    <input id="rsvp-drink" {...register("drink")} className={inputClassName} />
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
                  className="mt-1 w-full rounded-2xl border border-black/20 bg-(--color-background) px-4 py-2 text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || previewMode}
              title={previewMode ? "Это предпросмотр — форма здесь не отправляется" : undefined}
              className="min-h-11 w-full rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-background) transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Отправляем…" : previewMode ? "Предпросмотр" : "Отправить"}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
