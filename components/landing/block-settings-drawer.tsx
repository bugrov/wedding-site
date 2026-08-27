"use client";

import { useEffect, useState } from "react";
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
  CoverForm,
  StoryForm,
  ScheduleForm,
  VenueForm,
  DressCodeForm,
  GalleryForm,
  WishesForm,
  RsvpForm,
  FeaturesForm,
} from "@/components/editor/block-content-forms";

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
}) {
  const [expandedBlock, setExpandedBlock] = useState<BlockType | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label="Настроить блоки"
        className="fixed top-24 right-5 z-40 flex items-center gap-2 rounded-full bg-(--color-primary) px-4 py-3 text-sm font-medium text-(--color-background) shadow-lg transition hover:opacity-90"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden />
        Настроить блоки
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30"
          onClick={() => onOpenChange(false)}
          aria-hidden
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Настройки сайта"
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!open}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Настройки сайта</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Закрыть"
            className="rounded-full p-2 hover:bg-black/5"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Шаблон</h3>
            <div className="mt-3 space-y-2">
              {TEMPLATE_IDS.map((id) => (
                <label
                  key={id}
                  className="flex min-h-11 cursor-pointer items-center rounded-sm border border-black/20 px-4 py-2 text-sm has-checked:border-(--color-primary) has-checked:bg-(--color-primary)/5"
                >
                  <input
                    type="radio"
                    name="templateId"
                    value={id}
                    checked={templateId === id}
                    onChange={() => onTemplateChange(id)}
                    className="sr-only"
                  />
                  {TEMPLATES[id].label}
                </label>
              ))}
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
                      <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={enabledBlocks.includes(type)}
                          onChange={() => onToggleBlock(type)}
                          className="h-4 w-4 accent-(--color-primary)"
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
      </aside>
    </>
  );
}
