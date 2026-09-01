import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

// Same venue data as every other template — left-aligned on desktop for a
// magazine-sidebar feel, but same Russian labeling as Tuscany/Old Money
// (see feedback: no English accent words in this direction).
export function EditorialBwVenue({ content, dividerDirection }: BlockProps<"venue">) {
  return (
    <>
      <TrimDivider direction={dividerDirection} />
      <Section bleed="contained" className="text-center md:text-left">
        <Eyebrow>Место проведения</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
          {content.address || "Адрес будет объявлен"}
        </DisplayHeading>
        {content.description && (
          <BodyText className="mt-4 max-w-lg md:max-w-xl" font="display">
            {content.description}
          </BodyText>
        )}
        {content.mapUrl && (
          <a
            href={content.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block border-b border-current text-sm font-medium"
          >
            Открыть на карте
          </a>
        )}
      </Section>
    </>
  );
}
