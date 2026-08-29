import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// The "asymmetric text+photo split" from the plan's Tuscany direction.
// alternateDark comes from page-renderer.tsx (see TemplateDefinition's
// alternatingBlocks) — computed from this block's position among just the
// enabled alternating blocks, not hardcoded to this type, so disabling a
// neighbor never leaves two same-color blocks adjacent (see plan feedback:
// "то блок зелёный, то бежевый").
export function TuscanyStory({ content, alternateDark }: BlockProps<"story">) {
  // Both photos are optional (a couple may want none, one, or two) — render
  // exactly as many slots as are actually filled in, never an empty
  // placeholder box for a photo nobody added (see feedback: "пустые блоки
  // без фото остались на странице").
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
          <div>
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
            <div className="relative mt-8">
              {/* Decorative opening quote mark — plain body text read as "too
                  simple" (feedback). */}
              <span
                className={cn(
                  "absolute -top-8 -left-1 text-7xl select-none",
                  alternateDark ? "text-(--color-background)/25" : "text-(--color-accent)/25",
                )}
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden
              >
                “
              </span>
              {/* The display serif instead of the plain sans body font —
                  feedback was about the typeface reading too plain, not the
                  copy itself. Upright, not italic, and held to ~20px (text-xl)
                  at every breakpoint per feedback. */}
              <p
                className={cn(
                  "relative text-xl leading-relaxed whitespace-pre-line",
                  alternateDark ? "text-(--color-background)" : "text-(--color-text)",
                )}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {content.text}
              </p>
            </div>
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
