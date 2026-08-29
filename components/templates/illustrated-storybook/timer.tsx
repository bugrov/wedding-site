"use client";

import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { StorybookBloom } from "./decor";
import { StorybookCalendar } from "./wedding-calendar";

export function StorybookTimer({ project }: BlockProps<"timer">) {
  const remaining = useCountdown(project.weddingDate);

  const units: [string, number][] = [
    ["дней", remaining?.days ?? 0],
    ["часов", remaining?.hours ?? 0],
    ["минут", remaining?.minutes ?? 0],
    ["секунд", remaining?.seconds ?? 0],
  ];

  return (
    <Section bleed="contained" className="text-center">
      <Eyebrow>До свадьбы осталось</Eyebrow>
      <StorybookBloom className="mx-auto mt-4 h-9 w-7" />
      <div className="mt-6 flex justify-center gap-6 md:gap-12">
        {units.map(([label, value]) => (
          <div key={label}>
            <div
              className="text-4xl font-bold md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="mt-2 text-xs tracking-[0.2em] text-(--color-text)/60 uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <StorybookCalendar date={project.weddingDate} />
      </div>
    </Section>
  );
}
