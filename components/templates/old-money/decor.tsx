import { cn } from "@/lib/utils";

// This direction's own decorative marks — an engraved-corner frame and a
// small stamp-like seal, standing in for the formal card-printing motifs on
// the reference boards (double rules, corner flourishes, a monogram seal)
// rather than Tuscany's botanical sprig. Color follows currentColor so it
// tints via the accent token like the shared primitives do.

// One quarter-corner flourish, rotated per corner by the caller — used to
// frame the Cover and the RSVP "card" (see plan: "RSVP оформлен как
// открытка").
export function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-10 w-10 text-(--color-accent)", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M2 2h44M2 2v44" strokeWidth="1.25" />
      <path d="M2 14c8 0 12 4 12 12" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A plain engraved-look circular mark, standing in for a monogram wax seal
// (see plan: RSVP as a "card") without depending on another stock photo —
// the real wax seal photograph is reserved for the Timer hero.
export function SealMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-12 w-12 text-(--color-accent)", className)}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <circle cx="32" cy="32" r="26" strokeWidth="1" />
      <circle cx="32" cy="32" r="20" strokeWidth="1" />
      <path d="M32 18v28M22 32h20" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
