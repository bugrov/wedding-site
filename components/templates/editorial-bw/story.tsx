import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// Text-led (3fr) with a smaller photo column (2fr) — reversed weighting
// from Tuscany/Old Money's even split, reads more like a magazine column
// than a photo spread. `grayscale` wrapper keeps every client photo
// black-and-white, same reasoning as Cover.
export function EditorialBwStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="contained">
      <div className="text-center md:text-left">
        <Eyebrow>О нас</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
          Наша история
        </DisplayHeading>
      </div>
      <div
        className={cn(
          "mt-10 grid grid-cols-1 gap-10 md:gap-16",
          photos.length > 0 && "md:grid-cols-[3fr_2fr] md:items-start",
        )}
      >
        <BodyText className="text-lg leading-relaxed" font="display">
          {content.text}
        </BodyText>
        {photos.length > 0 && (
          <div className="grayscale">
            <PhotoGrid
              variant={photos.length === 1 ? "hero" : "collage-2"}
              photos={photos.map((src) => ({ src }))}
            />
          </div>
        )}
      </div>
    </Section>
  );
}
