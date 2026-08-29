import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

// Centered, photo stacked below the text — simpler than the earlier
// two-column text+photo split, per feedback (that split was the one block
// breaking from every other section's centered layout). `grayscale`
// wrapper keeps every client photo black-and-white, same reasoning as
// Cover.
export function EditorialBwStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <>
      <TrimDivider />
      <Section bleed="contained" className="text-center">
        <Eyebrow>О нас</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
          Наша история
        </DisplayHeading>
        <BodyText className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" font="display">
          {content.text}
        </BodyText>
        {photos.length > 0 && (
          <div className="mx-auto mt-10 max-w-2xl grayscale">
            <PhotoGrid
              variant={photos.length === 1 ? "hero" : "collage-2"}
              photos={photos.map((src) => ({ src }))}
            />
          </div>
        )}
      </Section>
    </>
  );
}
