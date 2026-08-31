import type { BlockType, BlockContent, BlockFeatures, CoverContent } from "@/lib/blocks";

// Persists the public configurator's in-progress state across an accidental
// tab close / navigation (see feedback: filled in block settings, closed
// the tab, had to redo everything from scratch). This is a pre-submission
// draft only — there's no account yet at this stage, so localStorage on
// this browser is the only place it can live; a real Lead in the DB
// replaces it the moment the contact form is actually submitted, at which
// point the draft is cleared (see clearConfiguratorDraft).
export type ConfiguratorDraft = {
  templateId: string;
  enabledBlocks: BlockType[];
  coverContent: CoverContent;
  groomName: string;
  brideName: string;
  weddingDate: string;
  content: { [K in BlockType]: BlockContent<K> };
  features: BlockFeatures;
};

const STORAGE_KEY = "wp:configurator-draft";

// Swallows storage errors throughout (quota exceeded, privacy mode, SSR) —
// losing the draft silently is far better than crashing the configurator
// over what's ultimately a convenience feature.
export function readConfiguratorDraft(): Partial<ConfiguratorDraft> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveConfiguratorDraft(draft: ConfiguratorDraft): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // ignore — draft just won't persist this time
  }
}

export function clearConfiguratorDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
