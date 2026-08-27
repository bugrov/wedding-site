import { cn } from "@/lib/utils";

// Font families come from CSS variables set by the active theme (see
// lib/theme/tokens.ts) — these components never hardcode a font, so the same
// markup renders correctly under any of the 5 template directions.

type HeadingTag = "h1" | "h2" | "h3";

export function DisplayHeading({
  as: Tag = "h1",
  className,
  children,
}: {
  as?: HeadingTag;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "text-4xl leading-tight font-normal text-(--color-text) md:text-6xl",
        className,
      )}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </Tag>
  );
}

export function AccentText({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn("text-xl text-(--color-accent-text) italic md:text-2xl", className)}
      style={{ fontFamily: "var(--font-accent, var(--font-display))" }}
    >
      {children}
    </span>
  );
}

export function BodyText({
  as: Tag = "p",
  className,
  // "display" is for a block's supporting/editorial copy (dress code notes,
  // schedule descriptions, wishes text, etc.) that reads too plain in the
  // plain sans body font per feedback; "body" (default) stays for anything
  // that's closer to UI chrome than narrative content.
  font = "body",
  children,
}: {
  as?: "p" | "span" | "div";
  className?: string;
  font?: "body" | "display";
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn("text-base leading-relaxed text-(--color-text) whitespace-pre-line", className)}
      style={{ fontFamily: font === "display" ? "var(--font-display)" : "var(--font-body)" }}
    >
      {children}
    </Tag>
  );
}

// The small uppercase label often sitting above a heading in editorial
// layouts ("WEDDING DAY", "OUR STORY" on the Pinterest references).
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn("text-xs tracking-[0.2em] text-(--color-accent-text) uppercase", className)}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </span>
  );
}
