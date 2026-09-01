"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Paperclip is hand-drawn-in-code — the RSVP note still gets pinned by it,
// independent of whatever texture motif the rest of the template uses.
export function Paperclip({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={cn("h-8 w-5 text-(--color-text)/70", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M17 8v18a5 5 0 01-10 0V10a3 3 0 016 0v14a1 1 0 01-2 0V12" />
    </svg>
  );
}

// A real 35mm filmstrip rail — one frame-cell period cropped from a free
// Freepik/Magnific vector ("Роль плёнки", attribution required — see
// CREDITS.md) and tiled with `repeat-x`, replacing both the original
// lace-trim divider (read as a wedding-invite doily, nothing to do with
// film) and an earlier pure-CSS filmstrip pass — see feedback: "мне нужны
// настоящие текстуры, фото со стока". The tile's sprocket holes and frame
// windows are punched fully transparent (not white). Repeat period picked
// by RMSE-comparing horizontal offsets of the rasterized vector against
// itself (same autocorrelation technique as the old lace-trim crop) — the
// hole rhythm isn't perfectly phase-locked to the frame-cell rhythm in the
// source art, but at this tile width the seam is not visible in practice.
// `EDITORIAL_BW_DECOR.trim` (the old lace asset) is left in decor-assets.ts
// unreferenced rather than deleted, in case something else still imports it.
const FILM_TILE = "/images/film/divider-tile.webp";

// What shows through the transparent holes/windows — a dark orange-to-black
// wash rather than the flat page background, since real exposed color
// negative film has that orange-brown base tint, not whatever paper color
// sits behind it. Feedback: "можно чтоб пленка была внутри оранжево-черная?
// чтоб более реальная была" — layered as a second, non-tiled background-image
// underneath the repeating tile (background-image layers paint first-listed
// on top), so it varies gently across the strip's width instead of being one
// flat swatch.
const FILM_BASE_TINT = "linear-gradient(90deg, #140a06 0%, #B8541F 50%, #140a06 100%)";

// Each divider on the page scrolls its own filmstrip horizontally as the
// visitor scrolls the page — like a reel actually feeding past — alternating
// direction per instance (see feedback: "эффект скролла ленты? с
// чередованием - первая слева направо, 2я - справа налево и т.д."). Callers
// pass `direction` explicitly (see timer.tsx/story.tsx/etc. — each hardcodes
// its own alternating value matching the template's default block order)
// rather than this component counting its own instances itself, since a
// module-level instance counter wouldn't survive Fast Refresh/Strict Mode
// double-invocation cleanly and wouldn't know the project's actual enabled/
// reordered block list anyway.
//
// Direct DOM mutation via ref + rAF-throttled scroll listener, not React
// state — same reasoning as `FooterSpotlight`'s cursor-follow elsewhere in
// this project: a scroll handler firing every frame would be a lot of
// re-renders for a purely visual effect. `background-position-x` (not
// `transform`) is what moves — it's a paint-only property for a
// `repeat-x` tile, so arbitrarily large offsets never need wrapping/resetting
// the way a translated, duplicated-track marquee would.
export function TrimDivider({
  className,
  direction = "ltr",
}: {
  className?: string;
  direction?: "ltr" | "rtl";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Respect reduced-motion: leave the divider static at its default
    // position rather than continuously scrolling it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sign = direction === "rtl" ? -1 : 1;
    const speed = 0.4; // px of tile shift per px scrolled — tuned by eye
    let rafId = 0;

    const apply = () => {
      rafId = 0;
      // Second value (the base-tint layer) stays put at 0 — only the first
      // background-image (the tile) shifts.
      node.style.backgroundPositionX = `${sign * window.scrollY * speed}px, 0px`;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [direction]);

  return (
    <div
      ref={ref}
      className={cn("h-8 w-full md:h-10", className)}
      style={{
        backgroundImage: `url(${FILM_TILE}), ${FILM_BASE_TINT}`,
        backgroundRepeat: "repeat-x, no-repeat",
        backgroundSize: "auto 100%, 100% 100%",
      }}
      aria-hidden
    />
  );
}

// This direction's one recurring mark (see plan: "минимум декора,
// монограмма инициалов") — restyled from a plain thin-line circle into a
// film-frame-counter chip: monospace, dashed frame edge, amber ink like the
// date stamp on Cover. Used on Cover and RSVP instead of an illustrated
// accent.
export function Monogram({
  groomName,
  brideName,
  className,
}: {
  groomName: string;
  brideName: string;
  className?: string;
}) {
  const groomInitial = groomName.trim().charAt(0).toUpperCase();
  const brideInitial = brideName.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-current text-sm tracking-[0.15em] text-(--color-accent)",
        className,
      )}
      style={{ fontFamily: "var(--font-mono)" }}
      aria-hidden
    >
      {groomInitial}&{brideInitial}
    </div>
  );
}
