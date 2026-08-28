import { Cormorant_Garamond, Inter } from "next/font/google";
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

export const oldMoneyBodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-old-money-body",
});

export const OLD_MONEY_DEFAULT_COLORS: ColorTokens = {
  primary: "#6B1E2B",
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
    ["--font-accent" as string]: "var(--font-old-money-display)",
    ["--font-body" as string]: "var(--font-old-money-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div className={cn(oldMoneyDisplayFont.variable, oldMoneyBodyFont.variable)} style={style}>
      {children}
    </div>
  );
}
