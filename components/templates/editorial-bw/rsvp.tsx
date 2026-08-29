"use client";

import { Section, Eyebrow, DisplayHeading } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useRsvpForm } from "@/lib/hooks/use-rsvp-form";
import { Monogram, Paperclip, TrimDivider } from "./decor";

// Underline-only inputs, no boxes/borders — the "magazine subscription
// form" register, matching this direction's overall restraint (see plan:
// "минимум декора").
const inputClassName =
  "mt-1 min-h-11 w-full border-0 border-b border-(--color-text)/30 bg-transparent px-0 py-2 text-sm focus:border-(--color-text) focus:outline-none";

const deadlineFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

export function EditorialBwRsvp({ project, content, previewMode }: BlockProps<"rsvp">) {
  const { register, errors, isSubmitting, attending, onSubmit } = useRsvpForm(project.id);

  return (
    <>
      <TrimDivider />
      <Section bleed="contained" className="text-center">
        {/* A pinned note — the paperclip reads as a letter against the
          grained page background (see plan feedback: the envelope photo
          looked off, dropped in favor of just the paperclip + plain
          card). */}
        <div className="relative mx-auto max-w-lg border border-(--color-text)/10 bg-(--color-background) px-6 py-10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] md:px-10 md:py-12">
          <Paperclip className="absolute -top-7 left-8 h-14 w-9 -rotate-12 md:left-10" />
          <Monogram
            groomName={project.groomName}
            brideName={project.brideName}
            className="mx-auto"
          />
          <Eyebrow className="mt-6 block">Подтверждение участия</Eyebrow>
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
                    className="flex min-h-11 items-center justify-center border border-(--color-text)/30 px-4 py-2 text-sm font-medium transition has-checked:border-(--color-text) has-checked:bg-(--color-text) has-checked:text-(--color-background) has-focus-visible:ring-2 has-focus-visible:ring-(--color-accent)"
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
                  className={inputClassName}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || previewMode}
              title={previewMode ? "Это предпросмотр — форма здесь не отправляется" : undefined}
              className="min-h-11 w-full bg-(--color-text) px-4 py-2 text-sm font-medium text-(--color-background) transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Отправляем…" : previewMode ? "Предпросмотр" : "Отправить"}
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}
