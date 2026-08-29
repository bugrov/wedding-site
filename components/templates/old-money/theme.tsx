import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// Cormorant Garamond + Inter — both confirmed to ship a Cyrillic subset in
// Google Fonts (see plan). Cormorant is a high-contrast, thin-stroke serif —
// the "engraved invitation card" register this direction is going for,
// deliberately more delicate than Tuscany's heavier Playfair Display.
export const oldMoneyDisplayFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-old-money-display",
});

// Great Vibes — a thin, formal copperplate-style calligraphy script with a
// Cyrillic subset, used as the flourish-heavy accent script (couple names
// on the doily, dates, "&") per the reference board's "Clara & Elliot"
// lettering. Cormorant-as-accent read too plain/generic for this direction
// (see feedback: "не в стиле олд мани... должны быть максимальные
// завитки"); Fondamento was tried first but doesn't ship a Cyrillic subset
// at all; Comforter does, but its thick uneven brush strokes read as "too
// childish/cartoonish" for this register (see feedback) — Great Vibes' thin
// uniform stroke is the more classic wedding-invitation register.
export const oldMoneyAccentFont = Great_Vibes({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-old-money-accent",
});

export const oldMoneyBodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-old-money-body",
});

// primary darkened from #6B1E2B to a near-black maroon per the reference
// board's much deeper burgundy hero blocks (see feedback: "реально еще
// более темно бордовым").
export const OLD_MONEY_DEFAULT_COLORS: ColorTokens = {
  primary: "#2E0E14",
  accent: "#A9813E",
  background: "#F6EFE2",
  text: "#2A1B16",
};

export function OldMoneyThemeWrapper({
  colorTokens = OLD_MONEY_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-old-money-display)",
    ["--font-accent" as string]: "var(--font-old-money-accent)",
    ["--font-body" as string]: "var(--font-old-money-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div
      className={cn(
        oldMoneyDisplayFont.variable,
        oldMoneyAccentFont.variable,
        oldMoneyBodyFont.variable,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
