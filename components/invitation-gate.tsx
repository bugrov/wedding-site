"use client";

import { useState } from "react";
import { Aperture } from "lucide-react";

// A tap-to-enter gate, styled like a camera aperture closing down to a
// point — the one deliberate "signature" moment shared by every template
// (see plan discussion: wanted one universal move, not a per-template
// reskin, something more premium than a bare "click to continue" prompt).
// Its real job is functional, not just decorative: browsers only allow
// audio-with-sound to start in direct response to a genuine tap/click/key
// press, never a scroll — this guarantees that gesture happens before the
// guest sees anything, instead of leaving background music silently stuck
// behind an easy-to-miss toggle icon (see feedback on MusicToggle).
// Prototype/pilot: currently wired in wherever MusicToggle is, same
// features.music gate — not yet a template-agnostic "always on" flourish.
export function InvitationGate() {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-(--color-background) transition-[clip-path] duration-700 ease-in-out"
      style={{ clipPath: closing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }}
      onTransitionEnd={() => {
        if (closing) setHidden(true);
      }}
    >
      <button
        type="button"
        onClick={() => setClosing(true)}
        aria-label="Открыть приглашение"
        className="flex flex-col items-center gap-4 text-(--color-text)"
      >
        <span className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full border border-(--color-accent) text-(--color-accent)">
          <Aperture className="h-9 w-9" aria-hidden />
        </span>
        <span className="text-xs tracking-[0.3em] uppercase">Открыть приглашение</span>
      </button>
    </div>
  );
}
