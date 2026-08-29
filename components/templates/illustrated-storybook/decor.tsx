import { cn } from "@/lib/utils";

// This direction's one recurring mark (see plan: "простые одиночные
// цветочные/линейные SVG-акценты по тексту" — deliberately not a full
// illustrated scene). A single line-drawn bloom on a short stem, used
// sparingly as an accent near a heading rather than a repeating pattern.
export function StorybookBloom({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 56"
      className={cn("h-14 w-10 text-(--color-accent)", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 54V22" />
      <path d="M20 34c-4 2-9 1-11-4" />
      <path d="M20 40c4 2 9 1 11-4" />
      <circle cx="20" cy="12" r="5" />
      <circle cx="12" cy="16" r="4.5" />
      <circle cx="28" cy="16" r="4.5" />
      <circle cx="14" cy="24" r="4.5" />
      <circle cx="26" cy="24" r="4.5" />
      <circle cx="20" cy="18" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
