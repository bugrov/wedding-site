import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function EditorialBwChat({ content }: BlockProps<"chat">) {
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
          className="mt-6 inline-block border-b border-current text-sm font-medium"
        >
          Перейти в чат
        </a>
      )}
    </Section>
  );
}
