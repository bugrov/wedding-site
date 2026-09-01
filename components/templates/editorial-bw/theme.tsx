import { PT_Serif, Manrope, JetBrains_Mono } from "next/font/google";
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

// Used only for the film date-stamp digits (see cover.tsx) — a monospace
// face reads as the LCD/typewriter counter these stamps imitate; Latin-only
// is fine, the stamp is always digits/punctuation, never Cyrillic text.
export const editorialBwMonoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-editorial-bw-mono",
});

// Redone around the "vintage film texture" refs (grain, light leaks, the
// orange LCD date-stamp of an old point-and-shoot) rather than a plain
// magazine-editorial cream page — see feedback: the previous concept
// ("Editorial Ч-Б" as clean cream paper + terracotta) didn't read as film at
// all. Background is a neutral film-stock grey rather than a warm cream —
// see feedback: "главный фон надо сделать более по цвету схожим к плёнке,
// не кремовый" (cream read as stationery paper, not film) — and the accent
// stays the burnt orange of a film-stamp/light-leak.
export const EDITORIAL_BW_DEFAULT_COLORS: ColorTokens = {
  primary: "#1C1912",
  accent: "#D9631E",
  background: "#D7D4CC",
  text: "#1C1912",
};

// The same real scanned-film grain photo used over the gallery/story photos
// (Freepik/Magnific, free tier, attribution required — see CREDITS.md),
// reused here as the page-wide ambient grain instead of the earlier
// CSS-simulated turbulence noise — see feedback: "мне нужны настоящие
// текстуры, фото со стока" ("Старая текстура плёнки с зерновым шумом").
// Composited via `background-blend-mode: screen` against the solid
// background color — its black backing contributes nothing under screen,
// only the grain/dust specks and soft glow show through — fixed + cover
// sized (not tiled) so it reads as one wash behind the whole page rather
// than an obviously repeating tile.
const AMBIENT_GRAIN = "url(/images/film/grain-noise.webp)";

// A soft dark vignette toward the page edges — every frame of scanned film
// falls off in exposure at the corners; a flat page never would on its own.
const VIGNETTE_BACKGROUND =
  "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,15,8,0.16) 100%)";

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
    ["--font-mono" as string]: "var(--font-editorial-bw-mono)",
    backgroundColor: "var(--color-background)",
    backgroundImage: `${VIGNETTE_BACKGROUND}, ${AMBIENT_GRAIN}`,
    backgroundBlendMode: "normal, screen",
    backgroundSize: "auto, cover",
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundAttachment: "fixed, fixed",
    color: "var(--color-text)",
  };

  return (
    <div
      className={cn(
        editorialBwDisplayFont.variable,
        editorialBwBodyFont.variable,
        editorialBwMonoFont.variable,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
