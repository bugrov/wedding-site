import type { ComponentType, ReactNode } from "react";
import type { BlockType, BlockContent, CoverContent } from "@/lib/blocks";
import type { ColorTokens } from "@/lib/theme/tokens";

// The subset of a Project/Lead the Cover renderer needs. Deliberately not
// the full Prisma Project type — templates shouldn't know about DB/lead vs
// project at all, just this shape.
export type ProjectSummary = {
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
