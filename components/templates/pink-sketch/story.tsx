import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { PHOTO_FRAME_CLASSNAME, VerticalLabel } from "./decor";

export function PinkSketchStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>О нас</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
        Наша история
      </DisplayHeading>
      <BodyText className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" font="display">
        {content.text}
      </BodyText>
      {photos.length > 0 && (
        <div className="relative mx-auto mt-10 max-w-2xl pl-4">
          <VerticalLabel className="top-1/2 -left-2">История любви</VerticalLabel>
          <PhotoGrid
            variant={photos.length === 1 ? "hero" : "collage-2"}
            photos={photos.map((src) => ({ src }))}
            className={PHOTO_FRAME_CLASSNAME}
          />
        </div>
      )}
    </Section>
  );
}
