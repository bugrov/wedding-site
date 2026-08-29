import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TornCard } from "./decor";

export function MoodyPaperSchedule({ content }: BlockProps<"schedule">) {
  return (
    <Section bleed="full">
      <TornCard className="text-center">
        <Eyebrow>Программа дня</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Как пройдёт день
        </DisplayHeading>
        <div className="mx-auto mt-10 max-w-md divide-y divide-(--color-text)/10">
          {content.items.map((item, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <div
                className="text-xl font-bold text-(--color-accent-text)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.time}
              </div>
              <div className="mt-1 font-medium text-(--color-text)">{item.title}</div>
              {item.description && (
                <BodyText className="mt-1 text-sm text-(--color-text)/70">
                  {item.description}
                </BodyText>
              )}
            </div>
          ))}
        </div>
      </TornCard>
    </Section>
  );
}
