"use client";

import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { TornCard } from "./decor";

// The hero moment for this direction (see plan: "huge centered timer") —
// oversized digits on the torn-paper card, nothing else competing for
// attention (see plan: "минимум декора").
export function MoodyPaperTimer({ project }: BlockProps<"timer">) {
  const remaining = useCountdown(project.weddingDate);

  const units: [string, number][] = [
    ["дней", remaining?.days ?? 0],
    ["часов", remaining?.hours ?? 0],
    ["минут", remaining?.minutes ?? 0],
    ["секунд", remaining?.seconds ?? 0],
  ];

  return (
    <Section bleed="full">
      <TornCard className="text-center">
        <Eyebrow>До свадьбы осталось</Eyebrow>
        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12">
          {units.map(([label, value]) => (
            <div key={label}>
              <div
                className="text-6xl font-bold text-(--color-text) md:text-8xl"
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
      </TornCard>
    </Section>
  );
}
