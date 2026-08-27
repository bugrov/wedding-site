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
          <div className="relative mt-8">
            {/* Decorative opening quote mark — plain BodyText read as "too
                simple" (feedback); this and the larger size give the letter
                some editorial weight without touching the template's fonts. */}
            <span
              className="absolute -top-8 -left-1 text-7xl text-(--color-accent)/25 select-none"
              style={{ fontFamily: "var(--font-display)" }}
              aria-hidden
            >
              “
            </span>
            <BodyText className="relative text-lg">{content.text}</BodyText>
          </div>
        </div>
        <PhotoGrid variant="collage-2" photos={(content.photos ?? []).map((src) => ({ src }))} />
      </div>
    </Section>
  );
}
