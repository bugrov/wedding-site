import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TornCard } from "./decor";

export function MoodyPaperWishes({ content }: BlockProps<"wishes">) {
  return (
    <Section bleed="full">
      <TornCard className="text-center">
        <Eyebrow>Пожелания и подарки</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          От всего сердца
        </DisplayHeading>
        <BodyText className="mx-auto mt-6 max-w-lg text-(--color-text)">{content.text}</BodyText>
        {content.items && content.items.length > 0 && (
          <ul className="mx-auto mt-6 max-w-md list-none space-y-2">
            {content.items.map((item, i) => (
              <li key={i}>
                <BodyText className="text-(--color-text)">{item}</BodyText>
              </li>
            ))}
          </ul>
        )}
      </TornCard>
    </Section>
  );
}
