import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// The "asymmetric text+photo split" from the plan's Tuscany direction.
export function TuscanyStory({ content }: BlockProps<"story">) {
  return (
    <Section bleed="contained">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <Eyebrow>О нас</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            Наша история
          </DisplayHeading>
          <BodyText className="mt-6">{content.text}</BodyText>
        </div>
        <PhotoGrid
          variant="collage-2"
          photos={content.photoUrl ? [{ src: content.photoUrl }] : []}
        />
      </div>
    </Section>
  );
}
