import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// Full-bleed dark burgundy, alternating with the plain cream blocks around
// it — same "чередование" treatment as Tuscany's Venue/Gallery/Chat, now
// that this direction's primary token is dark enough to carry it (see
// theme.tsx and feedback: "делаем чередование бордовых блоков").
export function OldMoneyVenue({ content }: BlockProps<"venue">) {
  return (
    <Section bleed="full" className="bg-(--color-primary) text-(--color-background)">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Eyebrow className="text-(--color-background)/70">Место проведения</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl text-(--color-background) md:text-4xl">
          {content.address || "Адрес будет объявлен"}
        </DisplayHeading>
        {content.description && (
          <BodyText className="mx-auto mt-4 max-w-lg text-(--color-background)/85" font="display">
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
