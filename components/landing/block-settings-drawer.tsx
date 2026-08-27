"use client";

import { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { BLOCK_TYPES, BLOCK_LABELS, type BlockType } from "@/lib/blocks";
import { TEMPLATES, TEMPLATE_IDS } from "@/lib/templates/registry";

// The "настройщик блоков" — a slide-out panel over the full-page site
// preview, not a static sidebar squeezed next to a boxed preview (see
// feedback: "окно в окне" was bad UX — the preview should look like the
// real site, and settings should float over it instead).
export function BlockSettingsDrawer({
  open,
  onOpenChange,
  enabledBlocks,
  onToggleBlock,
  templateId,
  onTemplateChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabledBlocks: BlockType[];
  onToggleBlock: (type: BlockType) => void;
  templateId: string;
  onTemplateChange: (id: string) => void;
}) {
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
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
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
            <h3 className="text-sm font-semibold tracking-wide uppercase">Блоки</h3>
            <div className="mt-3 space-y-2">
              {BLOCK_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-black/20 px-4 py-2 text-sm has-checked:border-(--color-primary) has-checked:bg-(--color-primary)/5"
                >
                  <input
                    type="checkbox"
                    checked={enabledBlocks.includes(type)}
                    onChange={() => onToggleBlock(type)}
                    className="h-4 w-4 accent-(--color-primary)"
                  />
                  {BLOCK_LABELS[type]}
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
