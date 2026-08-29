import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// See venue.tsx — same full-bleed dark alternation as Tuscany's Chat, CTA
// button inverted (cream fill) for contrast against the now-dark section.
export function OldMoneyChat({ content }: BlockProps<"chat">) {
  return (
    <Section bleed="full" className="bg-(--color-primary) text-(--color-background)">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Eyebrow className="text-(--color-background)/70">Чат для гостей</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl text-(--color-background) md:text-4xl">
          Общий чат
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg text-(--color-background)/85" font="display">
          {content.text}
        </BodyText>
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block border border-(--color-background) bg-(--color-background) px-6 py-3 text-sm font-medium text-(--color-primary) transition hover:opacity-90"
          >
            Перейти в чат
          </a>
        )}
      </div>
    </Section>
  );
}
