import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function OldMoneyWishes({ content }: BlockProps<"wishes">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Пожелания и подарки</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        От всего сердца
      </DisplayHeading>
      <div className="mx-auto mt-4 h-px w-10 bg-(--color-accent)" />
      <BodyText className="mx-auto mt-6 max-w-lg" font="display">
        {content.text}
      </BodyText>
      {content.items && content.items.length > 0 && (
        <ul className="mx-auto mt-6 max-w-md list-none space-y-2">
          {content.items.map((item, i) => (
            <li key={i}>
              <BodyText font="display">{item}</BodyText>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
