import { cn } from "@/lib/utils";

// Minimal, hand-drawn-in-code decorative accents — deliberately restrained
// (thin lines, small marks) rather than clipart, per the editorial-style
// decision in the plan. Color follows currentColor so each template/theme
// tints them via the accent color token.

export function DividerLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      className={cn("h-px w-16 text-(--color-accent)", className)}
      aria-hidden
    >
      <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function DotDivider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 8" className={cn("h-2 w-10 text-(--color-accent)", className)} aria-hidden>
      <circle cx="4" cy="4" r="1.5" fill="currentColor" />
      <circle cx="20" cy="4" r="1.5" fill="currentColor" />
      <circle cx="36" cy="4" r="1.5" fill="currentColor" />
    </svg>
  );
}

// A simple generic sprig — a stand-in botanical mark, deliberately plain
// (see plan: "простые одиночные цветочные/линейные SVG-акценты", not a
// full illustrated scene).
export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={cn("h-10 w-6 text-(--color-accent)", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 38V6" />
      <path d="M12 20c-3-1-6-4-6-9" />
      <path d="M12 14c3-1 6-4 6-9" />
      <path d="M12 28c-3-1-6-4-6-9" />
    </svg>
  );
}
