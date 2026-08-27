"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BLOCK_TYPES,
  DEFAULT_BLOCK_ORDER,
  createDefaultBlocksConfig,
  type BlockType,
} from "@/lib/blocks";
import { TEMPLATE_IDS } from "@/lib/templates/registry";
import { PageRenderer } from "@/components/page-renderer";
import { leadSchema } from "@/lib/schemas/lead";
import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import { BlockSettingsDrawer } from "./block-settings-drawer";

// A generic example couple for the live preview — not real data, just
// enough for the configurator to show the actual block components (not a
// separate mockup) reacting to the visitor's checkbox choices.
const PREVIEW_PROJECT = {
  groomName: "Александр",
  brideName: "Ольга",
  weddingDate: new Date(new Date().getFullYear() + 1, 5, 15),
};

// Not leadSchema.omit(...) directly: leadSchema.weddingDate is z.coerce.date()
// (input unknown -> output Date), which fights useForm<T>'s resolver typing
// the same way it did in rsvp.tsx. Plain string here, matching the native
// date input's actual value type — the server (leadSchema) does the real
// coercion when this hits /api/leads.
const contactFormSchema = leadSchema
  .omit({ templateId: true, blocksConfig: true, weddingDate: true })
  .extend({ weddingDate: z.string().min(1, "Укажите дату свадьбы") });
type ContactFormValues = z.infer<typeof contactFormSchema>;

const fieldClassName =
  "mt-1 min-h-11 w-full rounded-sm border border-black/35 bg-white px-3 py-2 text-sm text-black";

export function Configurator() {
  const [enabledBlocks, setEnabledBlocks] = useState<BlockType[]>([...BLOCK_TYPES]);
  const [templateId, setTemplateId] = useState(TEMPLATE_IDS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const blocksConfig = useMemo(
    () => createDefaultBlocksConfig(DEFAULT_BLOCK_ORDER.filter((b) => enabledBlocks.includes(b))),
    [enabledBlocks],
  );

  const toggleBlock = (type: BlockType) => {
    setEnabledBlocks((current) =>
      current.includes(type) ? current.filter((b) => b !== type) : [...current, type],
    );
  };

  const onSubmit = async (data: ContactFormValues) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, templateId, blocksConfig }),
    });

    if (!res.ok) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }

    toast.success("Заявка принята! Мы свяжемся с вами в Telegram или по телефону.");
    reset();
  };

  return (
    <>
      <Section id="configurator" bleed="contained" className="pb-0 text-center">
        <Eyebrow>Конструктор</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Соберите свой сайт
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg">
          Ниже — предпросмотр настоящего сайта. Нажмите «Настроить блоки», чтобы включать и
          выключать разделы.
        </BodyText>
      </Section>

      <BlockSettingsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        enabledBlocks={enabledBlocks}
        onToggleBlock={toggleBlock}
        templateId={templateId}
        onTemplateChange={setTemplateId}
      />

      {/* Full-page site preview — the real PageRenderer output at its
          natural width, not boxed/scaled down (see feedback: a bordered
          "window in window" preview was bad UX; this should look like the
          actual site). */}
      <div className="border-y border-black/10">
        <PageRenderer
          templateId={templateId}
          project={PREVIEW_PROJECT}
          blocksConfig={blocksConfig}
        />
      </div>

      <Section bleed="contained">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mx-auto max-w-lg space-y-4 text-left"
        >
          <h3 className="text-center text-sm font-semibold tracking-wide uppercase">
            Оставить заявку
          </h3>

          <div>
            <label className="block text-sm font-medium" htmlFor="contactName">
              Ваше имя
            </label>
            <input id="contactName" {...register("contactName")} className={fieldClassName} />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="groomName">
                Имя жениха
              </label>
              <input id="groomName" {...register("groomName")} className={fieldClassName} />
              {errors.groomName && (
                <p className="mt-1 text-sm text-red-600">{errors.groomName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="brideName">
                Имя невесты
              </label>
              <input id="brideName" {...register("brideName")} className={fieldClassName} />
              {errors.brideName && (
                <p className="mt-1 text-sm text-red-600">{errors.brideName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="weddingDate">
              Дата свадьбы
            </label>
            <input
              id="weddingDate"
              type="date"
              {...register("weddingDate")}
              className={fieldClassName}
            />
            {errors.weddingDate && (
              <p className="mt-1 text-sm text-red-600">{errors.weddingDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="phone">
                Телефон
              </label>
              <input id="phone" type="tel" {...register("phone")} className={fieldClassName} />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="telegram">
                Telegram (необязательно)
              </label>
              <input id="telegram" {...register("telegram")} className={fieldClassName} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="comment">
              Комментарий
            </label>
            <textarea id="comment" rows={3} {...register("comment")} className={fieldClassName} />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              {...register("consent")}
              className="mt-0.5 h-4 w-4 accent-(--color-primary)"
            />
            <span>
              Согласен(на) на обработку персональных данных согласно{" "}
              <a href="/privacy" className="underline underline-offset-4">
                политике конфиденциальности
              </a>
            </span>
          </label>
          {errors.consent && <p className="text-sm text-red-600">{errors.consent.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-background) transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Отправляем…" : "Отправить заявку"}
          </button>
        </form>
      </Section>
    </>
  );
}
