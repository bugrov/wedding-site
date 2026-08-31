"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import {
  BLOCK_TYPES,
  BLOCK_LABELS,
  type BlockType,
  type BlockContent,
  type CoverContent,
  type BlockFeatures,
} from "@/lib/blocks";
import { TEMPLATES, TEMPLATE_IDS } from "@/lib/templates/registry";
import {
  fieldClassName,
  CoverForm,
  StoryForm,
  ScheduleForm,
  VenueForm,
  DressCodeForm,
  GalleryForm,
  WishesForm,
  ChatForm,
  RsvpForm,
  FeaturesForm,
} from "@/components/editor/block-content-forms";

type MainFieldErrors = { groomName?: string; brideName?: string; weddingDate?: string };

function BlockForm({
  type,
  content,
  onChange,
}: {
  type: BlockType;
  content: BlockContent<BlockType>;
  onChange: (next: BlockContent<BlockType>) => void;
}) {
  switch (type) {
    case "story":
      return <StoryForm value={content as BlockContent<"story">} onChange={onChange} />;
    case "schedule":
      return <ScheduleForm value={content as BlockContent<"schedule">} onChange={onChange} />;
    case "venue":
      return <VenueForm value={content as BlockContent<"venue">} onChange={onChange} />;
    case "dresscode":
      return <DressCodeForm value={content as BlockContent<"dresscode">} onChange={onChange} />;
    case "gallery":
      return <GalleryForm value={content as BlockContent<"gallery">} onChange={onChange} />;
    case "wishes":
      return <WishesForm value={content as BlockContent<"wishes">} onChange={onChange} />;
    case "chat":
      return <ChatForm value={content as BlockContent<"chat">} onChange={onChange} />;
    case "rsvp":
      return <RsvpForm value={content as BlockContent<"rsvp">} onChange={onChange} />;
    case "timer":
      return <p className="text-sm text-black/50">У таймера нет настроек текста.</p>;
  }
}

// The "настройщик блоков" — a slide-out panel over the full-page site
// preview (see feedback: "окно в окне" was bad UX — the preview should look
// like the real site, and settings should float over it instead). Doubles
// as a real content editor: the visitor fills in actual text/photos here,
// the same per-block forms the future admin editor (step 6) will reuse —
// the operator can still adjust everything later, this just means less
// back-and-forth after the lead comes in.
export function BlockSettingsDrawer({
  open,
  onOpenChange,
  enabledBlocks,
  onToggleBlock,
  templateId,
  onTemplateChange,
  coverContent,
  onCoverChange,
  content,
  onContentChange,
  features,
  onFeaturesChange,
  groomName,
  onGroomNameChange,
  brideName,
  onBrideNameChange,
  weddingDate,
  onWeddingDateChange,
  mainFieldErrors,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabledBlocks: BlockType[];
  onToggleBlock: (type: BlockType) => void;
  templateId: string;
  onTemplateChange: (id: string) => void;
  coverContent: CoverContent;
  onCoverChange: (next: CoverContent) => void;
  content: { [K in BlockType]: BlockContent<K> };
  onContentChange: <K extends BlockType>(type: K, next: BlockContent<K>) => void;
  features: BlockFeatures;
  onFeaturesChange: (next: BlockFeatures) => void;
  groomName: string;
  onGroomNameChange: (next: string) => void;
  brideName: string;
  onBrideNameChange: (next: string) => void;
  weddingDate: string;
  onWeddingDateChange: (next: string) => void;
  mainFieldErrors: MainFieldErrors;
}) {
  const [expandedBlock, setExpandedBlock] = useState<BlockType | null>(null);
  const pushedHistoryRef = useRef(false);

  // Mobile back-button support: opening the drawer pushes a throwaway
  // history entry so a hardware/gesture "back" closes the drawer instead of
  // leaving the whole configurator page (see feedback: "если в телефоне
  // нажать кнопку назад, то попап не закроется, а закроется вкладка").
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ configuratorDrawer: true }, "");
    pushedHistoryRef.current = true;
    const onPopState = () => {
      pushedHistoryRef.current = false;
      onOpenChange(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Closing any other way (X, overlay click, Escape) has to consume that
  // same pushed entry itself, via history.back() — otherwise it's left
  // dangling, and the next real "back" press would silently just remove it
  // instead of leaving the page, requiring a second press.
  const close = useCallback(() => {
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    }
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <>
      {/* Sticky, not fixed to the viewport — a fixed button stayed glued to
          the top-right corner the whole time, clashing with the header's own
          "Оставить заявку" button up there (see feedback). Sticky only
          engages once this point in the page scrolls into that position, and
          releases once its container (the full-page preview below it)
          scrolls past — never competing with the header. */}
      <div className="sticky top-20 z-40 mx-auto mb-6 flex w-full max-w-5xl justify-end px-6">
        {/* mb-6: before the first scroll, this sits in normal flow right
            above the preview with nothing separating them (cramped/glued —
            see feedback); the margin holds regardless of stuck state. */}
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label="Настроить блоки"
          className="flex items-center gap-2 rounded-full bg-(--color-primary) px-4 py-3 text-sm font-medium text-(--color-background) shadow-lg transition hover:opacity-90"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Настроить блоки
        </button>
      </div>

      {open && <div className="fixed inset-0 z-[60] bg-black/30" onClick={close} aria-hidden />}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Настройки сайта"
        // z-[60], not z-50: the live preview's own MusicToggle (fixed, z-50)
        // sat behind the overlay but above the drawer's content — same
        // z-index falls back to DOM order, which happened to favor the
        // toggle. Higher than every in-page fixed element settles it outright.
        className="fixed top-0 right-0 z-[60] flex h-full w-full max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-300 md:max-w-lg"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Настройки сайта</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="rounded-full bg-black p-2 text-white hover:opacity-90"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Основное</h3>
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium">Имя жениха</label>
                  <input
                    value={groomName}
                    onChange={(e) => onGroomNameChange(e.target.value)}
                    className={fieldClassName}
                  />
                  {mainFieldErrors.groomName && (
                    <p className="mt-1 text-xs text-red-600">{mainFieldErrors.groomName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Имя невесты</label>
                  <input
                    value={brideName}
                    onChange={(e) => onBrideNameChange(e.target.value)}
                    className={fieldClassName}
                  />
                  {mainFieldErrors.brideName && (
                    <p className="mt-1 text-xs text-red-600">{mainFieldErrors.brideName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Дата свадьбы</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => onWeddingDateChange(e.target.value)}
                  // A click anywhere in this wide input can land on any
                  // segment (day/month/year), not just the leftmost one — if
                  // it lands past day, typing digits skips day entirely and
                  // the native value stays "" (looks filled, validates as
                  // empty). select() on focus always highlights the first
                  // segment, so typing always starts from day regardless of
                  // where the field was clicked.
                  onFocus={(e) => e.currentTarget.select()}
                  className={fieldClassName}
                />
                {mainFieldErrors.weddingDate && (
                  <p className="mt-1 text-xs text-red-600">{mainFieldErrors.weddingDate}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Шаблон</h3>
            <div className="mt-3 space-y-2">
              {TEMPLATE_IDS.map((id) => {
                const { primary, accent, background } = TEMPLATES[id].defaultColorTokens;
                return (
                  <label
                    key={id}
                    className="flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border border-black/20 px-4 py-2 text-sm has-checked:border-(--color-primary) has-checked:bg-(--color-primary)/5"
                  >
                    <input
                      type="radio"
                      name="templateId"
                      value={id}
                      checked={templateId === id}
                      onChange={() => onTemplateChange(id)}
                      className="sr-only"
                    />
                    {/* Same swatch idea as the landing page's "Направления
                        дизайна" section — a quick visual fingerprint of the
                        template's palette, not just its name. items-start +
                        this top margin (not items-center) so the dots line
                        up with the first line if a longer template name ever
                        wraps to 2 lines. */}
                    <span className="mt-0.5 flex shrink-0 gap-1">
                      {[primary, accent, background].map((color, i) => (
                        <span
                          key={i}
                          className="h-4 w-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span className="py-0.5">{TEMPLATES[id].label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Обложка</h3>
            <div className="mt-3">
              <CoverForm value={coverContent} onChange={onCoverChange} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Блоки</h3>
            <div className="mt-3 space-y-2">
              {BLOCK_TYPES.map((type) => {
                const isExpanded = expandedBlock === type;
                return (
                  <div key={type} className="rounded-sm border border-black/20">
                    <div className="flex min-h-11 items-center gap-2 px-4 py-2">
                      {/* items-start + a nudge on the checkbox, not
                          items-center — a long label ("Пожелания и подарки")
                          wraps to 2 lines on narrow screens, and items-center
                          then floats the checkbox between the lines instead
                          of next to the first one (see feedback). */}
                      <label className="flex flex-1 cursor-pointer items-start gap-3 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={enabledBlocks.includes(type)}
                          onChange={() => onToggleBlock(type)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-primary)"
                        />
                        {BLOCK_LABELS[type]}
                      </label>
                      <button
                        type="button"
                        onClick={() => setExpandedBlock(isExpanded ? null : type)}
                        aria-label={isExpanded ? "Свернуть настройки блока" : "Настроить блок"}
                        aria-expanded={isExpanded}
                        className="rounded-full p-1.5 hover:bg-black/5"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-black/10 px-4 py-4">
                        <BlockForm
                          type={type}
                          content={content[type]}
                          onChange={(next) => onContentChange(type, next)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Дополнительные функции
            </h3>
            <div className="mt-3">
              <FeaturesForm value={features} onChange={onFeaturesChange} />
            </div>
          </div>
        </div>

        {/* Pinned to the bottom of the drawer, always visible regardless of
            scroll position — doesn't actually save anything on its own
            (everything above already saves itself as it's typed: state +
            the localStorage draft), this is purely a second, obvious way
            out of the drawer next to the small X up top (see feedback: the
            X alone read as too easy to miss). */}
        <div className="border-t border-black/10 px-6 py-4">
          <button
            type="button"
            onClick={close}
            className="min-h-11 w-full rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Сохранить
          </button>
        </div>
      </aside>
    </>
  );
}
