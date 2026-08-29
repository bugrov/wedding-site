import { cn } from "@/lib/utils";
import { MOODY_PAPER_DECOR } from "./decor-assets";

// This direction's signature (see plan/reference board): every block is a
// strip of real torn paper spanning the block's full width, not a smaller
// centered card (see feedback: "по всей ширине блока, а не квадратами
// разной ширины"). The tear itself is a photograph (see decor-assets.ts),
// not a drawn shape — each edge image renders at its own natural aspect
// ratio (never squashed) so the fiber detail stays crisp at any width; a
// flat-color strip (sampled from the same photo) fills the space between
// the two torn photos and holds the actual content.
export function TornCard({
  className,
  contentClassName,
  children,
}: {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      {/* Each edge photo is rendered wider than its own container and
          recentered, then clipped by overflow-hidden — the source photo's
          own physical left/right corners (where the real sheet of paper
          ends) would otherwise land exactly at the viewport edges and read
          as a visible corner/notch (see feedback: "видны углы блока").
          Overflowing hides those corners off-screen; only the torn top/
          bottom edge (which spans the whole photo) stays visible. */}
      <div className="w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed
            decorative texture, not a content photo next/image would need
            to optimize. */}
        <img
          src={MOODY_PAPER_DECOR.tornTop}
          alt=""
          className="block h-auto w-[130%] max-w-none -translate-x-[11.5%]"
          aria-hidden
        />
      </div>
      <div className="bg-(--color-background)">
        <div className={cn("mx-auto max-w-2xl px-6 py-10 md:px-12 md:py-14", contentClassName)}>
          {children}
        </div>
      </div>
      <div className="-mt-px w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MOODY_PAPER_DECOR.tornBottom}
          alt=""
          className="block h-auto w-[130%] max-w-none -translate-x-[11.5%]"
          aria-hidden
        />
      </div>
    </div>
  );
}
