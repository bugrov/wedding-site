"use client";

import { useState } from "react";

// Envelope-opening variant of InvitationGate — see that file for why this
// gate exists at all. Backed by one real photographed envelope+wax-seal
// image (see feedback: flat CSS shapes read as "плоская, унылая анимация"
// next to competitors' photoreal envelopes) split into two independently
// animated layers via the classic CSS-sprite trick — background-size:
// 100% 200% + background-position top/bottom — rather than two separate
// cut assets, since the source is a single flattened photo with no
// separate flap layer. The fold line in the source photo sits almost
// exactly at 50% of its height (verified directly against the downloaded
// asset), which is why the split is a plain half/half share.
//
// Lives under /images/, not a new top-level folder — that path is already
// excluded from proxy.ts's subdomain rewrite (see the /audio and /images
// fixes elsewhere in this project); a new folder would 404 on every real
// client site the same way those did.
//
// LICENSING: sourced from Vecteezy's free preview tier — shipped ahead of
// sorting out proper attribution/licensing (see project-state.md Known
// Issues), a known open item, not an oversight.
const ENVELOPE_IMAGE = "/images/gate/envelope-seal.png";
const ENVELOPE_ASPECT = "1514 / 1121";

export function InvitationGateEnvelope() {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-(--color-background) transition-opacity duration-500 ease-in"
      style={{ opacity: closing ? 0 : 1, transitionDelay: closing ? "900ms" : "0ms" }}
      onTransitionEnd={() => {
        if (closing) setHidden(true);
      }}
    >
      <button
        type="button"
        onClick={() => setClosing(true)}
        aria-label="Открыть приглашение"
        className="flex flex-col items-center gap-5"
      >
        <span
          className="relative block w-[280px]"
          style={{ aspectRatio: ENVELOPE_ASPECT, perspective: "900px" }}
        >
          {/* Card, tucked mostly inside the body until it slides out from
              behind the flap */}
          <span
            className="absolute inset-x-[12%] top-[6%] h-[46%] rounded-[2px] bg-(--color-background) shadow-[0_2px_14px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out"
            style={{
              transform: closing ? "translateY(-135%) scale(1.05)" : "translateY(10%) scale(1)",
              transitionDelay: closing ? "350ms" : "0ms",
              transitionTimingFunction: closing ? "cubic-bezier(0.2, 0.8, 0.3, 1)" : undefined,
              zIndex: 1,
            }}
          />
          {/* Envelope body — bottom half of the source photo, static.
              Height must match the flap's own h-1/2 exactly — this was
              inset-0 (full container) before, which stretched the bottom-
              half crop across the whole height instead of just its own
              half, warping the body and misaligning the seam through the
              seal (see feedback: "стык... со съеденной печатью"). */}
          <span
            className="absolute inset-x-0 bottom-0 h-1/2 bg-no-repeat"
            style={{
              backgroundImage: `url(${ENVELOPE_IMAGE})`,
              backgroundSize: "100% 200%",
              backgroundPosition: "bottom",
              zIndex: 2,
            }}
          />
          {/* Flap — top half of the same photo, hinged at the envelope's
              top edge */}
          <span
            className="absolute inset-x-0 top-0 h-1/2 origin-top bg-no-repeat transition-transform duration-500 ease-in"
            style={{
              backgroundImage: `url(${ENVELOPE_IMAGE})`,
              backgroundSize: "100% 200%",
              backgroundPosition: "top",
              transform: closing ? "rotateX(150deg)" : "rotateX(0deg)",
              zIndex: 3,
            }}
          />
        </span>
        <span
          className="text-xs tracking-[0.3em] text-(--color-text) uppercase transition-opacity duration-200"
          style={{ opacity: closing ? 0 : 1 }}
        >
          Открыть приглашение
        </span>
      </button>
    </div>
  );
}
