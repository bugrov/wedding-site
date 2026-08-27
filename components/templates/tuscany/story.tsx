import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// The "asymmetric text+photo split" from the plan's Tuscany direction.
export function TuscanyStory({ content }: BlockProps<"story">) {
  // Both photos are optional (a couple may want none, one, or two) — render
  // exactly as many slots as are actually filled in, never an empty
  // placeholder box for a photo nobody added (see feedback: "пустые блоки
  // без фото остались на странице").
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="contained">
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-10 md:gap-16",
          photos.length > 0 && "md:grid-cols-2",
        )}
      >
        <div>
          <Eyebrow>О нас</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            Наша история
          </DisplayHeading>
          <div className="relative mt-8">
            {/* Decorative opening quote mark — plain body text read as "too
                simple" (feedback). */}
            <span
              className="absolute -top-8 -left-1 text-7xl text-(--color-accent)/25 select-none"
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
              className="relative text-xl leading-relaxed whitespace-pre-line text-(--color-text)"
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
    </Section>
  );
}
