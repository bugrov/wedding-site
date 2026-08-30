"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLeadMutation } from "@/lib/hooks/use-lead-mutation";
import {
  BLOCK_TYPES,
  DEFAULT_BLOCK_ORDER,
  DEFAULT_BLOCK_CONTENT,
  DEFAULT_BLOCK_FEATURES,
  type BlockType,
  type BlockContent,
  type CoverContent,
  type BlockFeatures,
  type BlocksConfig,
} from "@/lib/blocks";
import { TEMPLATE_IDS } from "@/lib/templates/registry";
import { PageRenderer } from "@/components/page-renderer";
import { leadSchema } from "@/lib/schemas/lead";
import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import { BlockSettingsDrawer } from "./block-settings-drawer";

// Fallback demo names/date for the live preview when the visitor hasn't
// typed their own yet — as soon as they do (moved into the settings drawer,
// not the bottom contact form, per feedback: "приходится листать вниз" and
// the template previously showed hardcoded names disconnected from any
// field), the preview (and the Timer block, via project.weddingDate) picks
// them up immediately.
const FALLBACK_GROOM_NAME = "Александр";
const FALLBACK_BRIDE_NAME = "Мария";
const FALLBACK_WEDDING_DATE = new Date(new Date().getFullYear() + 1, 5, 15);

// groomName/brideName/weddingDate are handled as their own state (see above)
// rather than react-hook-form fields here — omitted from this schema too.
// weddingDate elsewhere would be leadSchema's z.coerce.date() (input unknown
// -> output Date), which fights useForm<T>'s resolver typing the same way
// it did in rsvp.tsx.
const contactFormSchema = leadSchema.omit({
  templateId: true,
  blocksConfig: true,
  groomName: true,
  brideName: true,
  weddingDate: true,
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

type MainFieldErrors = { groomName?: string; brideName?: string; weddingDate?: string };

const fieldClassName =
  "mt-1 min-h-11 w-full rounded-sm border border-black/35 bg-white px-3 py-2 text-sm text-black";

export function Configurator() {
  const [enabledBlocks, setEnabledBlocks] = useState<BlockType[]>([...BLOCK_TYPES]);
  const [templateId, setTemplateId] = useState(TEMPLATE_IDS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [coverContent, setCoverContent] = useState<CoverContent>({});
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [mainFieldErrors, setMainFieldErrors] = useState<MainFieldErrors>({});
  // Content for every block type is always kept in state (not just enabled
  // ones) so toggling a block off and back on doesn't discard what the
  // visitor already typed in it.
  const [content, setContent] =
    useState<{ [K in BlockType]: BlockContent<K> }>(DEFAULT_BLOCK_CONTENT);
  const [features, setFeatures] = useState<BlockFeatures>(DEFAULT_BLOCK_FEATURES);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const blocksConfig: BlocksConfig = useMemo(() => {
    const order = DEFAULT_BLOCK_ORDER.filter((b) => enabledBlocks.includes(b));
    const filteredContent = Object.fromEntries(
      order.map((type) => [type, content[type]]),
    ) as BlocksConfig["content"];
    return { enabledBlocks, order, cover: coverContent, content: filteredContent, features };
  }, [enabledBlocks, coverContent, content, features]);

  const parsedWeddingDate = new Date(weddingDate);
  const previewProject = useMemo(
    () => ({
      groomName: groomName.trim() || FALLBACK_GROOM_NAME,
      brideName: brideName.trim() || FALLBACK_BRIDE_NAME,
      weddingDate: Number.isNaN(parsedWeddingDate.getTime())
        ? FALLBACK_WEDDING_DATE
        : parsedWeddingDate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groomName, brideName, weddingDate],
  );

  const toggleBlock = (type: BlockType) => {
    setEnabledBlocks((current) =>
      current.includes(type) ? current.filter((b) => b !== type) : [...current, type],
    );
  };

  const updateContent = <K extends BlockType>(type: K, next: BlockContent<K>) => {
    setContent((current) => ({ ...current, [type]: next }));
  };

  const validateMainFields = (): MainFieldErrors => {
    const nextErrors: MainFieldErrors = {};
    if (!groomName.trim()) nextErrors.groomName = "Введите имя жениха";
    if (!brideName.trim()) nextErrors.brideName = "Введите имя невесты";
    if (!weddingDate || Number.isNaN(new Date(weddingDate).getTime())) {
      nextErrors.weddingDate = "Укажите дату свадьбы";
    }
    return nextErrors;
  };

  const leadMutation = useLeadMutation();

  const onSubmit = async (data: ContactFormValues) => {
    const nextMainErrors = validateMainFields();
    if (Object.keys(nextMainErrors).length > 0) {
      setMainFieldErrors(nextMainErrors);
      setDrawerOpen(true);
      toast.error("Заполните имена и дату свадьбы в настройках сайта");
      return;
    }
    setMainFieldErrors({});

    try {
      await leadMutation.mutateAsync({
        ...data,
        groomName,
        brideName,
        weddingDate,
        templateId,
        blocksConfig,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось отправить заявку");
      return;
    }

    toast.success("Заявка принята! Мы свяжемся с вами в Telegram или по телефону.");
    reset();
    setGroomName("");
    setBrideName("");
    setWeddingDate("");
  };

  return (
    <>
      <Section id="configurator" bleed="contained" className="pb-0 text-center">
        <Eyebrow>Конструктор</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Соберите свой сайт
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg">
          Ниже — предпросмотр настоящего сайта. Нажмите «Настроить блоки», чтобы указать имена, дату
          и выбрать разделы.
        </BodyText>
      </Section>

      {/* Shared containing block for the sticky "Настроить блоки" button and
          the preview it controls — sticky releases at its own parent's
          bottom edge, so without this shared wrapper the button's real
          containing block was the whole page (Fragment siblings don't
          count), and it stayed stuck well past the preview, overlapping the
          lead form below on mobile (see feedback). */}
      <div>
        <BlockSettingsDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          enabledBlocks={enabledBlocks}
          onToggleBlock={toggleBlock}
          templateId={templateId}
          onTemplateChange={setTemplateId}
          coverContent={coverContent}
          onCoverChange={setCoverContent}
          content={content}
          onContentChange={updateContent}
          features={features}
          onFeaturesChange={setFeatures}
          groomName={groomName}
          onGroomNameChange={setGroomName}
          brideName={brideName}
          onBrideNameChange={setBrideName}
          weddingDate={weddingDate}
          onWeddingDateChange={setWeddingDate}
          mainFieldErrors={mainFieldErrors}
        />

        {/* Full-page site preview — the real PageRenderer output at its
            natural width, not boxed/scaled down (see feedback: a bordered
            "window in window" preview was bad UX; this should look like the
            actual site). */}
        <div className="border-y border-black/10">
          <PageRenderer
            templateId={templateId}
            project={previewProject}
            blocksConfig={blocksConfig}
            previewMode
          />
        </div>
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

          {/* grid-cols-1 on mobile — "Telegram (необязательно)" wraps to 2
              lines at a 2-column mobile width while "Телефон" stays 1 line,
              pushing that input down out of line with the phone input (see
              feedback: "не на одной линии"). sm: has enough room for both
              on one line. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
