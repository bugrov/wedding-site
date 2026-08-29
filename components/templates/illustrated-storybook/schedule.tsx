import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { StorybookBloom } from "./decor";

export function StorybookSchedule({ content }: BlockProps<"schedule">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Программа дня</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        Как пройдёт день
      </DisplayHeading>
      <StorybookBloom className="mx-auto mt-4 h-10 w-8" />
      <div className="mx-auto mt-10 max-w-md space-y-8">
        {content.items.map((item, i) => (
          <div key={i}>
            <div className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
              {item.time}
            </div>
            <div className="mt-1 font-medium" style={{ fontFamily: "var(--font-display)" }}>
              {item.title}
            </div>
            {item.description && (
              <BodyText className="mt-1 text-sm text-(--color-text)/70">
                {item.description}
              </BodyText>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
