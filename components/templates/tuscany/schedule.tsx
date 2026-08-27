import { Section, Eyebrow, DisplayHeading, BodyText, DividerLine } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function TuscanySchedule({ content }: BlockProps<"schedule">) {
  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>Программа дня</Eyebrow>
      <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
        Как пройдёт день
      </DisplayHeading>
      <div className="mx-auto mt-10 max-w-md space-y-8">
        {content.items.map((item, i) => (
          <div key={i}>
            <div
              className="text-xl font-semibold text-(--color-accent)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.time}
            </div>
            <div className="mt-1 font-medium">{item.title}</div>
            {item.description && <BodyText className="mt-1 text-sm">{item.description}</BodyText>}
            {i < content.items.length - 1 && <DividerLine className="mx-auto mt-6" />}
          </div>
        ))}
      </div>
    </Section>
  );
}
