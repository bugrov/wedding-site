import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// Solid olive block — one of the alternating-background beats down the page
// (see plan feedback: "то блок зелёный, то бежевый"), sitting between the
// cream Story and DressCode sections.
export function TuscanyVenue({ content }: BlockProps<"venue">) {
  return (
    <Section bleed="full" className="bg-(--color-primary) text-center text-(--color-background)">
      <div className="mx-auto max-w-5xl px-6">
        <Eyebrow className="text-(--color-background)/70">Место проведения</Eyebrow>
        <DisplayHeading className="mt-3 text-3xl text-(--color-background) md:text-4xl" as="h2">
          {content.address || "Адрес будет объявлен"}
        </DisplayHeading>
        {content.description && (
          <BodyText className="mx-auto mt-4 max-w-lg text-(--color-background)/90" font="display">
            {content.description}
          </BodyText>
        )}
        {content.mapUrl && (
          <a
            href={content.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-(--color-background) underline underline-offset-4"
          >
            Открыть на карте
          </a>
        )}
      </div>
    </Section>
  );
}
