"use client";

import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { PearlString } from "./decor";

// Deliberately no background photo here (see plan: "минимум декора" for
// this direction) — a plain typographic countdown on the greige background,
// restrained rather than a dramatic hero like Tuscany/Old Money's.
export function EditorialBwTimer({ project }: BlockProps<"timer">) {
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
      <PearlString count={13} className="mx-auto mt-6 max-w-xs" />
      <div className="mt-8 flex justify-center gap-8 md:gap-16">
        {units.map(([label, value]) => (
          <div key={label}>
            <div
              className="text-5xl font-bold md:text-7xl"
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
    </Section>
  );
}
