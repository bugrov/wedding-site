import { cn } from "@/lib/utils";

type SectionProps = {
  /** "full" bleeds edge-to-edge; "contained" caps width with side padding. */
  bleed?: "full" | "contained";
  as?: "section" | "div" | "header" | "footer";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

// The building block behind the editorial vertical rhythm from the plan:
// alternating full-bleed and contained sections down the page, instead of a
// uniform column of cards.
export function Section({
  bleed = "contained",
  as: Tag = "section",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "py-16 md:py-24",
        bleed === "contained" ? "mx-auto w-full max-w-5xl px-6" : "w-full",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
