"use client";

import { useState } from "react";

// "Curtain" / split-screen variant of InvitationGate — see that file for why
// this gate exists at all. Unambiguous symbolism was the whole point here
// (see feedback: the aperture read as "abstract graphic", not obviously a
// camera) — two halves parting is legible as "opening" regardless of
// template or viewer. Not wired into page-renderer.tsx; for comparison only.
export function InvitationGateCurtain() {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-hidden"
      onTransitionEnd={(e) => {
        if (closing && e.propertyName === "transform") setHidden(true);
      }}
    >
      <div
        className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-end bg-(--color-background) transition-transform duration-700 ease-in-out"
        style={{ transform: closing ? "translateX(-100%)" : "translateX(0)" }}
      />
      <div
        className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-start bg-(--color-background) transition-transform duration-700 ease-in-out"
        style={{ transform: closing ? "translateX(100%)" : "translateX(0)" }}
      />
      <button
        type="button"
        onClick={() => setClosing(true)}
        aria-label="Открыть приглашение"
        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-200"
        style={{ opacity: closing ? 0 : 1, pointerEvents: closing ? "none" : "auto" }}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-(--color-accent)">
          <span
            className="text-xl text-(--color-accent)"
            style={{ fontFamily: "var(--font-accent, var(--font-display))" }}
          >
            &amp;
          </span>
        </span>
        <span className="text-xs tracking-[0.3em] text-(--color-text) uppercase">
          Открыть приглашение
        </span>
      </button>
    </div>
  );
}
