import type { ComponentType, ReactNode } from "react";
import type { BlockType, BlockContent, CoverContent } from "@/lib/blocks";
import type { ColorTokens } from "@/lib/theme/tokens";

// The subset of a Project/Lead the Cover renderer needs. Deliberately not
// the full Prisma Project type — templates shouldn't know about DB/lead vs
// project at all, just this shape.
export type ProjectSummary = {
  /** The real Project row's id — only set for an actual published guest
   * site (app/sites/[slug]/page.tsx), never the lead/admin-preview demo
   * data. The RSVP block needs it to know which project to record a
   * response against; previewMode being true wherever id is absent means
   * it's never actually submitted regardless. */
  id?: string;
  groomName: string;
  brideName: string;
  weddingDate: Date;
};

export type CoverProps = {
  project: ProjectSummary;
  content: CoverContent;
};

export type BlockProps<T extends BlockType> = {
  project: ProjectSummary;
  content: BlockContent<T>;
  /** True in the public configurator's live preview — never a real guest
   * visiting a published site. Blocks with a real side-effecting action
   * (RSVP submit) should disable it here instead of letting a lead visitor
   * think they actually submitted something. */
  previewMode?: boolean;
  /** The cover photo the operator set in "Обложка" (blocksConfig.cover.photoUrl)
   * — still owned and edited there, not a separate per-block field. Threaded
   * through so a template can reuse it as the hero image of a later block
   * instead of (or in addition to) the Cover itself, e.g. Old Money's Timer
   * per the reference board. Most block renderers ignore this. */
  coverPhotoUrl?: string;
};

/**
 * A template is a set of renderers, one per block type, plus a Cover and a
 * ThemeWrapper — NOT one big page component. See plan: "шаблон это НЕ один
 * компонент на всю страницу, а набор рендереров под каждый тип блока".
 * Content schemas are identical across all templates; only these renderers
 * differ.
 */
export type TemplateDefinition = {
  id: string;
  label: string;
  Cover: ComponentType<CoverProps>;
  blocks: { [K in BlockType]: ComponentType<BlockProps<K>> };
  /** Applies this template's fonts + the given color tokens as CSS vars. */
  ThemeWrapper: ComponentType<{ colorTokens?: ColorTokens; children: ReactNode }>;
  /** This template's default palette — used for the swatch preview in the
   * template picker (see components/landing/examples.tsx for the same
   * swatch idea applied to not-yet-built directions). Real per-project theme
   * selection (step 6) will let the operator override this from a saved
   * Theme row instead. */
  defaultColorTokens: ColorTokens;
};
