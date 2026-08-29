import { Yeseva_One, Marck_Script, Mulish } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// Yeseva One (bold, slightly condensed display serif — a TypeType font built
// for the Cyrillic market, exactly the "girly editorial" register from the
// reference board) + Marck Script for the italic accent word (see plan's
// per-template font-pair table; a script font is this direction's own
// signature rather than just italicizing the display face like Tuscany/Old
// Money do) + Mulish for body copy. All three ship a Cyrillic subset.
export const pinkSketchDisplayFont = Yeseva_One({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-pink-sketch-display",
});

export const pinkSketchAccentFont = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-pink-sketch-accent",
});

export const pinkSketchBodyFont = Mulish({
  subsets: ["latin", "cyrillic"],
  variable: "--font-pink-sketch-body",
});

export const PINK_SKETCH_DEFAULT_COLORS: ColorTokens = {
  primary: "#8B3226",
  accent: "#C1503D",
  background: "#F2D9D3",
  text: "#2B211D",
};

export function PinkSketchThemeWrapper({
  colorTokens = PINK_SKETCH_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-pink-sketch-display)",
    ["--font-accent" as string]: "var(--font-pink-sketch-accent)",
    ["--font-body" as string]: "var(--font-pink-sketch-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div
      className={cn(
        pinkSketchDisplayFont.variable,
        pinkSketchAccentFont.variable,
        pinkSketchBodyFont.variable,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
