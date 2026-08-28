import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function TuscanyChat({ content }: BlockProps<"chat">) {
  return (
    <Section bleed="full" className="bg-(--color-primary) text-center text-(--color-background)">
      <div className="mx-auto max-w-5xl px-6">
        <Eyebrow className="text-(--color-background)/70">Чат для гостей</Eyebrow>
        <DisplayHeading className="mt-3 text-3xl text-(--color-background) md:text-4xl" as="h2">
          Общий чат
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg text-(--color-background)/90" font="display">
          {content.text}
        </BodyText>
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-full bg-(--color-background) px-6 py-3 text-sm font-medium text-(--color-primary) transition hover:opacity-90"
          >
            Перейти в чат
          </a>
        )}
      </div>
    </Section>
  );
}
