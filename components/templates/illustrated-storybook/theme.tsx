import { Merriweather, Marck_Script, Inter } from "next/font/google";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// Merriweather (display) + Marck Script (accent, Cyrillic-native — made by
// ParaType specifically for Russian branding) + Inter (body). All three
// confirmed to ship a Cyrillic subset in Google Fonts (see plan).
export const storybookDisplayFont = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-storybook-display",
});

export const storybookAccentFont = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-storybook-accent",
});

export const storybookBodyFont = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-storybook-body",
});

// Same swatch already previewed on the landing page's direction cards.
export const STORYBOOK_DEFAULT_COLORS: ColorTokens = {
  primary: "#6B4A34",
  accent: "#D9A9A0",
  background: "#F3E9DD",
  text: "#3A2A1F",
};

export function StorybookThemeWrapper({
  colorTokens = STORYBOOK_DEFAULT_COLORS,
  children,
}: {
  colorTokens?: ColorTokens;
  children: React.ReactNode;
}) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(colorTokens),
    ["--font-display" as string]: "var(--font-storybook-display)",
    ["--font-accent" as string]: "var(--font-storybook-accent)",
    ["--font-body" as string]: "var(--font-storybook-body)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div
      className={cn(
        storybookDisplayFont.variable,
        storybookAccentFont.variable,
        storybookBodyFont.variable,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
