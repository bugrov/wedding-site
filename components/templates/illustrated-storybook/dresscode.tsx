import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function StorybookDressCode({ content }: BlockProps<"dresscode">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Дресс-код</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        Стиль вечера
      </DisplayHeading>
      <BodyText className="mx-auto mt-4 max-w-lg" font="display">
        {content.text}
      </BodyText>
      {content.palette && content.palette.length > 0 && (
        <div className="mt-6 flex justify-center gap-3">
          {content.palette.map((color, i) => (
            <span
              key={i}
              className="h-8 w-8 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
