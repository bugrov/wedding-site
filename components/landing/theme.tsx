import type { CSSProperties, ReactNode } from "react";
import { colorTokensToCssVars, type ColorTokens } from "@/lib/theme/tokens";

// The landing/marketing shell's own neutral palette — not one of the 5
// client-site template directions (see plan: "нейтральная брендовая
// палитра... лёгкое воздушное применение той же дизайн-системы"). Reuses
// the same ColorTokens shape and CSS-var mechanism as templates so the
// shared primitives (Section/Typography) work identically here.
export const LANDING_COLORS: ColorTokens = {
  primary: "#171512",
  accent: "#8A6D3B",
  background: "#FAF8F5",
  text: "#171512",
};

export function LandingThemeWrapper({ children }: { children: ReactNode }) {
  const style: CSSProperties = {
    ...colorTokensToCssVars(LANDING_COLORS),
    // No separate display serif for the marketing shell — the site-wide
    // Inter loaded in app/layout.tsx covers it, unlike client-site templates
    // which each load their own font pair.
    ["--font-display" as string]: "var(--font-inter)",
    ["--font-accent" as string]: "var(--font-inter)",
    ["--font-body" as string]: "var(--font-inter)",
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };

  return (
    <div style={style} className="flex min-h-full flex-1 flex-col">
      {children}
    </div>
  );
}
