import { cn } from "@/lib/utils";
import { EDITORIAL_BW_DECOR } from "./decor-assets";

// Paperclip is hand-drawn-in-code like Monogram below; the pearls are a
// real licensed photo bead (see decor-assets.ts) repeated along a thin
// wire — per feedback, the pearls need to read as an actual texture, not
// flat SVG circles.
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

// Pearls grow toward the middle of the strand and taper at the ends, like
// a real draped necklace instead of uniform dots.
function bellSize(t: number, min: number, max: number) {
  return min + Math.sin(t * Math.PI) * (max - min);
}

// Packs beads edge-to-edge (minus a small gap) along a fixed span instead
// of spacing them evenly by index — per feedback, pearls need to sit at
// "minimal distance" from each other like a real strung necklace, and the
// strand should fill its block edge to edge.
function packBeads(
  count: number,
  minSize: number,
  maxSize: number,
  gap: number,
  span: number,
  margin = 4,
) {
  const sizes = Array.from({ length: count }, (_, i) =>
    bellSize(i / (count - 1), minSize, maxSize),
  );
  const rawTotal = sizes.reduce((a, b) => a + b, 0) + gap * (count - 1);
  const scale = (span - margin * 2) / rawTotal;
  let cursor = margin;
  return sizes.map((size) => {
    const s = size * scale;
    const center = cursor + s / 2;
    cursor += s + gap * scale;
    return { size: s, center };
  });
}

// Samples a sine-wave centerline into a polyline (rather than a single
// quadratic bow) so a strand can undulate through more than one hump — see
// the user's own reference sketch for the cover (2-3 waves along the
// bottom edge, not a simple arc).
function sampleWave(length: number, fn: (t: number) => number, steps = 40) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return { t, pos: t * length, offset: fn(t) };
  });
}

const PEARL_VIEW_W = 400;

// A single draped strand, sized to fill 100% of its parent's width (see
// feedback: pearls should stretch long, fill the block left to right, and
// can wave more than once across the width).
export function PearlString({
  className,
  toneClassName,
  count = 12,
  amplitude = 20,
  waves = 1,
  minSize = 16,
  maxSize = 32,
  gap = 2,
}: {
  className?: string;
  toneClassName?: string;
  count?: number;
  amplitude?: number;
  waves?: number;
  minSize?: number;
  maxSize?: number;
  gap?: number;
}) {
  const viewH = maxSize + amplitude * 2 + 8;
  const p0y = viewH / 2;
  const yAt = (t: number) => p0y - amplitude * Math.sin(waves * Math.PI * t);
  const beads = packBeads(count, minSize, maxSize, gap, PEARL_VIEW_W);
  const points = sampleWave(PEARL_VIEW_W, yAt)
    .map(({ pos, offset }) => `${pos.toFixed(1)},${offset.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${PEARL_VIEW_W} ${viewH}`}
      className={cn("block w-full text-(--color-accent)/50", toneClassName, className)}
      aria-hidden
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1" />
      {beads.map(({ size, center }, i) => {
        const cy = yAt(center / PEARL_VIEW_W);
        return (
          <image
            key={i}
            href={EDITORIAL_BW_DECOR.pearl}
            x={center - size / 2}
            y={cy - size / 2}
            width={size}
            height={size}
          />
        );
      })}
    </svg>
  );
}

// One continuous winding strand that passes through an entire block (see
// feedback: the Program-of-the-day pearls should thread through the whole
// section as one unbroken curving necklace, not small per-item connectors).
// Implemented as a repeating background tile rather than a single scaled
// SVG, so it fills any actual rendered height — including a height only
// known after the schedule list lays out — without distorting the beads.
function buildPearlThreadTile(pearlUrl: string) {
  const w = 56;
  const h = 76;
  const amplitude = 16;
  const beadSize = 26;
  const cx = w / 2;
  // Kept away from the tile's top/bottom edges (an SVG clips content past
  // its own bounds) — placing a bead center exactly at 0 or h, as before,
  // cut every other pearl in half where the background tile repeats.
  const beadFractions = [0.25, 0.75];
  const path = `M ${cx} 0 C ${cx + amplitude} ${h * 0.17}, ${cx + amplitude} ${h * 0.33}, ${cx} ${h * 0.5} S ${cx - amplitude} ${h * 0.83}, ${cx} ${h}`;
  const beads = beadFractions
    .map((t) => {
      const y = t * h;
      const x = cx + amplitude * Math.sin(t * 2 * Math.PI);
      return `<image href="${pearlUrl}" x="${x - beadSize / 2}" y="${y - beadSize / 2}" width="${beadSize}" height="${beadSize}" />`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${path}" fill="none" stroke="rgba(181,83,60,0.5)" stroke-width="1.5"/>${beads}</svg>`;
  return { uri: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, w, h };
}

export function PearlThread({ className }: { className?: string }) {
  const { uri, w, h } = buildPearlThreadTile(EDITORIAL_BW_DECOR.pearl);
  return (
    <div
      className={cn("bg-repeat-y", className)}
      style={{
        backgroundImage: uri,
        backgroundSize: `${w}px ${h}px`,
        backgroundPosition: "top center",
      }}
      aria-hidden
    />
  );
}

// This direction's one recurring mark (see plan: "минимум декора,
// монограмма инициалов") — no botanical/seal graphics, just the couple's
// initials in a thin circle. Used on Cover and RSVP instead of an
// illustrated accent.
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
        "flex h-16 w-16 items-center justify-center rounded-full border border-current text-sm tracking-[0.15em]",
        className,
      )}
      style={{ fontFamily: "var(--font-display)" }}
      aria-hidden
    >
      {groomInitial}&{brideInitial}
    </div>
  );
}
