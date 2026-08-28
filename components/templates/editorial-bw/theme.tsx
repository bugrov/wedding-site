import { PT_Serif, Manrope } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// PT Serif (bold weight, see plan: "жирное начертание") + Manrope — both
// confirmed to ship a Cyrillic subset (PT Serif is a ParaType font, designed
// for Cyrillic from the start). Heavier and more graphic than either
// Tuscany's or Old Money's display serif — the "magazine headline" register
// this direction wants.
export const editorialBwDisplayFont = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  variable: "--font-editorial-bw-display",
});

export const editorialBwBodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-editorial-bw-body",
});

// Warmer, aged-paper ivory (updated from the previous flat greige #E5E0DA)
// per Pinterest refs — closer to the cream note-card/letter tone those
// designs use instead of a neutral grey.
export const EDITORIAL_BW_DEFAULT_COLORS: ColorTokens = {
  primary: "#1A1A1A",
  accent: "#B5533C",
  background: "#F3ECDC",
  text: "#1A1A1A",
};

// A faint fractal-noise grain, generated in CSS rather than a stock texture
// photo — keeps the "paper" feel from the refs without needing an
// asset-approval round for something this subtle.
const PAPER_GRAIN_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function EditorialBwThemeWrapper({
  colorTokens = EDITORIAL_BW_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-editorial-bw-display)",
    ["--font-accent" as string]: "var(--font-editorial-bw-display)",
    ["--font-body" as string]: "var(--font-editorial-bw-body)",
    backgroundColor: "var(--color-background)",
    backgroundImage: PAPER_GRAIN_BACKGROUND,
    color: "var(--color-text)",
  };

  return (
    <div
      className={cn(editorialBwDisplayFont.variable, editorialBwBodyFont.variable)}
      style={style}
    >
      {children}
    </div>
  );
}
