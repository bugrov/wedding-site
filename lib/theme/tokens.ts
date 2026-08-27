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

// `accent` is tuned for decorative/large use (dividers, buttons, large
// display text) and isn't guaranteed to hit 4.5:1 against `background` at
// small text sizes — found via the ui-ux-pro-max audit (Tuscany's default
// accent measured 4.13:1, below WCAG AA). Rather than force every template's
// locked accent hex to double as body-text-safe, primitives that render
// small accent-colored text (Eyebrow, AccentText, inline links) use this
// darkened derivative instead.
function darkenForText(hex: string, factor = 0.82): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const channel = (shift: number) => Math.round(((num >> shift) & 0xff) * factor);
  return `#${[channel(16), channel(8), channel(0)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

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
    "--color-accent-text": darkenForText(tokens.accent),
    "--color-background": tokens.background,
    "--color-text": tokens.text,
  } as CSSProperties;
}
