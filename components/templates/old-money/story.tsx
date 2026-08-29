import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// alternateDark comes from page-renderer.tsx (see TemplateDefinition's
// alternatingBlocks) — computed from this block's position among just the
// enabled alternating blocks, not hardcoded to this type, so disabling a
// neighbor never leaves two same-color blocks adjacent (see feedback:
// "делаем чередование бордовых блоков").
export function OldMoneyStory({ content, alternateDark }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section
      bleed={alternateDark ? "full" : "contained"}
      className={cn(alternateDark && "bg-(--color-primary) text-(--color-background)")}
    >
      <div className={cn(alternateDark && "mx-auto max-w-5xl px-6")}>
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 md:gap-16",
            photos.length > 0 && "md:grid-cols-2",
          )}
        >
          <div className="text-center md:text-left">
            <Eyebrow className={cn(alternateDark && "text-(--color-background)/70")}>О нас</Eyebrow>
            <DisplayHeading
              as="h2"
              className={cn(
                "mt-3 text-3xl md:text-4xl",
                alternateDark && "text-(--color-background)",
              )}
            >
              Наша история
            </DisplayHeading>
            <div
              className={cn(
                "mx-auto mt-4 h-px w-10 md:mx-0",
                alternateDark ? "bg-(--color-background)/40" : "bg-(--color-accent)",
              )}
            />
            <p
              className={cn(
                "mt-6 text-xl leading-relaxed whitespace-pre-line",
                alternateDark ? "text-(--color-background)" : "text-(--color-text)",
              )}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {content.text}
            </p>
          </div>
          {photos.length > 0 && (
            <PhotoGrid
              variant={photos.length === 1 ? "hero" : "collage-2"}
              photos={photos.map((src) => ({ src }))}
            />
          )}
        </div>
      </div>
    </Section>
  );
}
