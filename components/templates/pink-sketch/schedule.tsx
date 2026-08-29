import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { SquigglyDivider } from "./decor";

export function PinkSketchSchedule({ content }: BlockProps<"schedule">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Программа дня</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
        Как пройдёт день
      </DisplayHeading>
      <div className="mx-auto mt-12 max-w-md">
        {content.items.map((item, i) => (
          <div key={i}>
            <div
              className="text-xl font-semibold text-(--color-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.time}
            </div>
            <div className="mt-1 font-medium">{item.title}</div>
            {item.description && (
              <BodyText className="mt-1 text-sm" font="display">
                {item.description}
              </BodyText>
            )}
            {i < content.items.length - 1 && (
              <SquigglyDivider className="mx-auto mt-6 mb-2 text-(--color-accent)" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
