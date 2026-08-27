import { z } from "zod";
import type { CSSProperties } from "react";

// Shape stored in Theme.colorTokens (JSON). Theme.fontPair is a separate
// column — a key into the per-template font-pair registry defined alongside
// each template in step 3, not a raw font string here.
export const colorTokensSchema = z.object({
  primary: z.string().min(1),
  accent: z.string().min(1),
  background: z.string().min(1),
  text: z.string().min(1),
});

export type ColorTokens = z.infer<typeof colorTokensSchema>;

/**
 * Turns a theme's color tokens into CSS custom properties, to spread onto
 * the root element a template renders under. Primitives read these via
 * `var(--color-*)` — swapping a theme only ever changes these values, never
 * the component tree (see plan: "Механизм смены дизайна").
 */
export function colorTokensToCssVars(tokens: ColorTokens): CSSProperties {
  return {
    "--color-primary": tokens.primary,
    "--color-accent": tokens.accent,
    "--color-background": tokens.background,
    "--color-text": tokens.text,
  } as CSSProperties;
}
