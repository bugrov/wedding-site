import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function PinkSketchVenue({ content }: BlockProps<"venue">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Место проведения</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
        {content.address || "Адрес будет объявлен"}
      </DisplayHeading>
      {content.description && (
        <BodyText className="mx-auto mt-4 max-w-lg" font="display">
          {content.description}
        </BodyText>
      )}
      {content.mapUrl && (
        <a
          href={content.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block text-sm underline underline-offset-4 text-(--color-accent-text)"
        >
          Открыть на карте
        </a>
      )}
    </Section>
  );
}
