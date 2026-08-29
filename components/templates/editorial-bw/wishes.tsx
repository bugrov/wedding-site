import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

export function EditorialBwWishes({ content }: BlockProps<"wishes">) {
  return (
    <>
      <TrimDivider />
      <Section bleed="contained" className="text-center">
        <Eyebrow>Пожелания и подарки</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
          От всего сердца
        </DisplayHeading>
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
    </>
  );
}
