import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TornCard } from "./decor";

export function MoodyPaperChat({ content }: BlockProps<"chat">) {
  return (
    <Section bleed="full">
      <TornCard className="text-center">
        <Eyebrow>Чат для гостей</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Общий чат
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg text-(--color-text)">{content.text}</BodyText>
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block bg-(--color-primary) px-6 py-3 text-sm font-medium text-(--color-background) transition hover:opacity-90"
          >
            Перейти в чат
          </a>
        )}
      </TornCard>
    </Section>
  );
}
