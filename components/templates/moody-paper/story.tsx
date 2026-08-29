import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TornCard } from "./decor";

export function MoodyPaperStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="full">
      <TornCard className="text-center">
        <Eyebrow>О нас</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Наша история
        </DisplayHeading>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed whitespace-pre-line text-(--color-text)">
          {content.text}
        </p>
        {photos.length > 0 && (
          <div className="mx-auto mt-8 max-w-lg">
            <PhotoGrid
              variant={photos.length === 1 ? "hero" : "collage-2"}
              photos={photos.map((src) => ({ src }))}
            />
          </div>
        )}
      </TornCard>
    </Section>
  );
}
