"use client";

import { useState } from "react";
import { isRenderableUrl } from "@/components/primitives";

// Wax-seal variant of InvitationGate (see that file for why this gate exists
// at all — guaranteeing a real tap for the browser's audio-gesture
// requirement, not just decoration). Kept as a separate component rather
// than a variant prop on InvitationGate so both can be compared side by
// side before picking one; not wired into page-renderer.tsx.
//
// Backed by the couple's own cover photo, not a flat theme color — see
// feedback with a competitor reference (wedwed.by): their gate cards sit on
// a real photo with a dark scrim, which reads far more premium than a plain
// color card with a line-icon. Falls back to the flat background (no scrim,
// dark text) when there's no photo yet, same as any other client-image slot.
export function InvitationGateSeal({ photoUrl }: { photoUrl?: string }) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hasPhoto = photoUrl && isRenderableUrl(photoUrl);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-(--color-background) transition-opacity duration-500 ease-in"
      style={{ opacity: closing ? 0 : 1, transitionDelay: closing ? "250ms" : "0ms" }}
      onTransitionEnd={() => {
        if (closing) setHidden(true);
      }}
    >
      {hasPhoto && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" aria-hidden />
        </>
      )}
      <button
        type="button"
        onClick={() => setClosing(true)}
        aria-label="Открыть приглашение"
        className="relative flex flex-col items-center gap-4"
      >
        <span className="relative flex h-24 w-24 items-center justify-center">
          {/* Left half of the seal, clipped down the middle */}
          <span
            className="absolute inset-0 rounded-full bg-(--color-accent) shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-in"
            style={{
              clipPath: "inset(0 50% 0 0)",
              transform: closing ? "translate(-14px, -6px) rotate(-14deg)" : "none",
            }}
          />
          {/* Right half */}
          <span
            className="absolute inset-0 rounded-full bg-(--color-accent) shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-in"
            style={{
              clipPath: "inset(0 0 0 50%)",
              transform: closing ? "translate(14px, -6px) rotate(14deg)" : "none",
            }}
          />
          <span
            className="relative text-2xl text-(--color-background) transition-opacity duration-200"
            style={{ fontFamily: "var(--font-accent, var(--font-display))", opacity: closing ? 0 : 1 }}
          >
            &amp;
          </span>
        </span>
        <span
          className={`text-xs tracking-[0.3em] uppercase transition-opacity duration-200 ${hasPhoto ? "text-white" : "text-(--color-text)"}`}
          style={{ opacity: closing ? 0 : 1 }}
        >
          Открыть приглашение
        </span>
      </button>
    </div>
  );
}
