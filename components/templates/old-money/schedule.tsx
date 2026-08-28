import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { OLD_MONEY_DECOR } from "./decor-assets";

// Full-bleed aged-paper texture behind the section (see plan: template-level
// atmospheric texture, approved via the asset process). opacity-80 on the
// image + a lighter /40 wash (not /75) — the first pass was nearly invisible
// (see feedback) because a heavy overlay was hiding a faint image; the
// texture itself was picked specifically for having no dark vignette, so it
// can run strong without hurting text legibility.
export function OldMoneySchedule({ content }: BlockProps<"schedule">) {
  return (
    <Section bleed="full" className="relative overflow-hidden text-center">
      <Image
        src={OLD_MONEY_DECOR.scheduleBackground}
        alt=""
        fill
        className="object-cover opacity-80"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-(--color-background)/40" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-6">
        <Eyebrow>Программа дня</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Как пройдёт день
        </DisplayHeading>
        <div className="mx-auto mt-10 max-w-md space-y-8">
          {content.items.map((item, i) => (
            <div key={i}>
              <div
                className="text-xl font-semibold text-(--color-accent-text)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.time}
              </div>
              <div className="mt-1 font-medium" style={{ fontFamily: "var(--font-display)" }}>
                {item.title}
              </div>
              {item.description && (
                <BodyText className="mt-1 text-sm" font="display">
                  {item.description}
                </BodyText>
              )}
              {i < content.items.length - 1 && (
                <div className="mx-auto mt-6 h-px w-10 bg-(--color-accent)/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
