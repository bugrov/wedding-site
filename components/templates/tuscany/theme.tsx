import { Playfair_Display, Inter } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// Playfair Display + Inter — both confirmed to ship a Cyrillic subset in
// Google Fonts (a hard requirement here, see plan: many editorial serifs
// don't). next/font/google would fail at build time if a requested subset
// weren't available, so this pairing is self-verifying.
export const tuscanyDisplayFont = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-tuscany-display",
});

export const tuscanyBodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-tuscany-body",
});

export const TUSCANY_DEFAULT_COLORS: ColorTokens = {
  primary: "#4B5320",
  accent: "#9C6B30",
  background: "#F6F2EA",
  text: "#2B2620",
};

export function TuscanyThemeWrapper({
  colorTokens = TUSCANY_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-tuscany-display)",
    // No separate script font in this direction — the accent text just
    // italicizes the same display serif (see plan's font-pair table).
    ["--font-accent" as string]: "var(--font-tuscany-display)",
    ["--font-body" as string]: "var(--font-tuscany-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div className={cn(tuscanyDisplayFont.variable, tuscanyBodyFont.variable)} style={style}>
      {children}
    </div>
  );
}
