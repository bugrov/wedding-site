import { cn } from "@/lib/utils";
import { EDITORIAL_BW_DECOR } from "./decor-assets";

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

// A tiled white lace-trim strip, spanning the full width of whatever
// contains it — the recurring divider between every block, replacing the
// pearl motif per feedback ("не нравятся неестественные жемчуги"). A plain
// CSS background tile rather than an SVG-embedded image, so there's no
// "SVG used as image can't load external resources" restriction to work
// around, and no per-container viewBox-scaling distortion to worry about
// (see the old PearlString's issues) — a photo-based background just
// crops/tiles normally at any width.
export function TrimDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-6 w-full md:h-8", className)}
      style={{
        backgroundImage: `url("${EDITORIAL_BW_DECOR.trim}")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
        backgroundPosition: "center",
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
