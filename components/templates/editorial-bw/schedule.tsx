import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

export function EditorialBwSchedule({ content, dividerDirection }: BlockProps<"schedule">) {
  return (
    <>
      <TrimDivider direction={dividerDirection} />
      <Section bleed="contained">
        <div className="text-center md:text-left">
          <Eyebrow>Программа дня</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
            Как пройдёт день
          </DisplayHeading>
        </div>
        <div className="mx-auto mt-12 max-w-2xl divide-y divide-(--color-text)/10">
          {content.items.map((item, i) => (
            <div key={i} className="flex items-baseline gap-6 py-5">
              <span
                className="text-xs text-(--color-text)/40 tabular-nums"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-lg font-bold tabular-nums"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.time}
              </span>
              <div className="flex-1 text-left">
                <div className="font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </div>
                {item.description && (
                  <BodyText className="mt-0.5 text-sm text-(--color-text)/70">
                    {item.description}
                  </BodyText>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
