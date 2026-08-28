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

// A scalloped (doily-edged) oval outline — the Cover's signature vignette
// per the reference (an engraved-invitation oval with a fluted paper edge)
// instead of the plain rectangular bordered card. Drawn as a sampled path
// rather than a fixed asset so it scales cleanly to any card size.
export function ScallopedOval({
  className,
  scallops = 22,
  amplitude = 4,
}: {
  className?: string;
  scallops?: number;
  amplitude?: number;
}) {
  const w = 240;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - amplitude - 3;
  const ry = h / 2 - amplitude - 3;
  const steps = 240;
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const theta = t * 2 * Math.PI;
    const wobble = amplitude * Math.cos(scallops * theta);
    const x = cx + (rx + wobble) * Math.cos(theta);
    const y = cy + (ry + wobble) * Math.sin(theta);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("text-(--color-accent)", className)}
      aria-hidden
    >
      <polygon points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
