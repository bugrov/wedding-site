import { cn } from "@/lib/utils";

// This direction's signature motif (see plan/reference board): every photo
// casts a soft pink shadow down-right, like a sticker peeled slightly off
// the page. An earlier hand-drawn wobbly-stroke frame (stretched
// non-uniformly to fit each photo's box via preserveAspectRatio="none")
// looked authentic on a 4:5 photo but let some photo corners visibly poke
// past the wobble on other aspect ratios (see feedback: "некоторые фото
// вылезают за эту рамку") — a plain even border fixed that, then per further
// feedback the border was swapped for an offset shadow, then that hard
// 0-blur shadow got a blur radius per "давай чуть размоем тень". box-shadow
// paints outside an element's own overflow-hidden clip (only descendants
// get clipped), so it's safe to combine both on the same box. The thin
// border stays alongside the shadow: the RSVP card's background is the same
// token as the page background, so its top/left edges had no shadow to read
// against and vanished into the page (see feedback: "у формы не видны её
// границы сверху и слева") — a border reads on every side regardless of
// which corner the shadow falls toward.
export const PHOTO_FRAME_CLASSNAME =
  "rounded-sm border border-(--color-accent) shadow-[6px_6px_10px_var(--color-accent)]";

// A wavy hand-drawn rule, standing in for the plain straight DividerLine
// primitive in blocks that want this template's own sketchy register.
// viewBox pads 2-3 units beyond the path's 0-100/0-10 bounds on every side —
// the round linecap's stroke otherwise gets clipped right at the wave peaks
// and at the right end (see feedback: dividers looked cut off on the right).
export function SquigglyDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-2 -3 104 16"
      preserveAspectRatio="none"
      className={cn("h-2.5 w-16", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M1 5c6-6 12 6 18 0s12-6 18 0 12 6 18 0 12-6 18 0 12 6 18 0 12-6 8-1" />
    </svg>
  );
}

// A rotated, small-caps side label sitting along a photo frame — the
// vertical "STORYTELLING"-style tag from the reference board, kept in
// Russian per the project's no-English-words rule.
export function VerticalLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute origin-center -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.3em] whitespace-nowrap text-(--color-accent-text)/70 uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

// An irregular, hand-marked ring standing in for a pen circling the wedding
// date on the calendar — this direction's own take on Tuscany's InkCircle,
// redrawn with a rougher, more scribbled outline to match the frame's
// looser hand.
export function ScribbleRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" className={className} fill="none" aria-hidden>
      <path
        d="M18 1C10 0 1 6 2 15c1 10 6 18 15 18 10 0 17-7 16-17-1-8-6-14-14-14Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M6 8c-1 3 0 5 1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
