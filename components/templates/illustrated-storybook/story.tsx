import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { StorybookBloom } from "./decor";

// Centered, photo stacked below the text — simpler than the earlier
// two-column text+photo split, per feedback (that split was the one block
// breaking from every other section's centered layout).
export function StorybookStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>О нас</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        Наша история
      </DisplayHeading>
      <StorybookBloom className="mx-auto mt-4 h-10 w-8" />
      <BodyText className="mx-auto mt-6 max-w-md" font="display">
        {content.text}
      </BodyText>
      {photos.length > 0 && (
        <div className="mx-auto mt-10 max-w-2xl">
          <PhotoGrid
            variant={photos.length === 1 ? "hero" : "collage-2"}
            photos={photos.map((src) => ({ src }))}
          />
        </div>
      )}
    </Section>
  );
}
