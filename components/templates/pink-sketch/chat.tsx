import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function PinkSketchChat({ content }: BlockProps<"chat">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Чат для гостей</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
        Общий чат
      </DisplayHeading>
      <BodyText className="mx-auto mt-4 max-w-lg" font="display">
        {content.text}
      </BodyText>
      {content.link && (
        <a
          href={content.link}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-(--color-primary) px-6 py-3 text-sm font-medium text-(--color-background) transition hover:opacity-90"
        >
          Перейти в чат
        </a>
      )}
    </Section>
  );
}
