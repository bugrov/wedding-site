import { EB_Garamond, Golos_Text } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// EB Garamond (classic editorial serif, tracked caps read close to the
// reference board's "WEDDING DAY" headline) + Golos Text for body — both
// confirmed to ship a Cyrillic subset. Unbounded (this direction's original
// plan pick) was tried first but read as a generic bold display sans, not
// the elegant editorial register the actual reference board wants (see
// feedback: "не похож шрифт").
export const moodyPaperDisplayFont = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-moody-paper-display",
});

export const moodyPaperBodyFont = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-moody-paper-body",
});

// background matches the actual paper photo's own tone (sampled from the
// approved torn-paper asset, see decor-assets.ts) so the flat middle
// section of every card seams invisibly into the photographed edges.
// accent is a muted olive-grey — the same family as `primary` — rather
// than a warm terracotta: a saturated warm accent visibly clashed against
// the paper's own neutral, slightly cool white (see feedback: "цвет не
// подходит под бумагу, выделяется").
export const MOODY_PAPER_DEFAULT_COLORS: ColorTokens = {
  primary: "#1E2118",
  accent: "#6B6650",
  background: "#F1F0EC",
  text: "#2B2620",
};

// The page's own base color is `primary` (dark) rather than `background`
// (paper) — paper only appears inside a TornCard. Content inside a card
// still reads correctly because the shared primitives (Eyebrow,
// DisplayHeading, BodyText) already resolve to `--color-text`/
// `--color-accent-text`, both dark, matching the card.
export function MoodyPaperThemeWrapper({
  colorTokens = MOODY_PAPER_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-moody-paper-display)",
    ["--font-accent" as string]: "var(--font-moody-paper-display)",
    ["--font-body" as string]: "var(--font-moody-paper-body)",
    backgroundColor: "var(--color-primary)",
    color: "var(--color-background)",
  };

  return (
    <div className={cn(moodyPaperDisplayFont.variable, moodyPaperBodyFont.variable)} style={style}>
      {children}
    </div>
  );
}
