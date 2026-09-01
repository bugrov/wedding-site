"use client";

import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { TrimDivider } from "./decor";

// Digits render as film-counter chips — dark cell, amber monospace numerals
// — instead of a plain typographic countdown, per the "vintage film
// texture" redirect (a frame counter is one of the most recognizable film
// UI elements in the refs, alongside grain and the light leak on Cover).
export function EditorialBwTimer({ project, dividerDirection }: BlockProps<"timer">) {
  const remaining = useCountdown(project.weddingDate);

  const units: [string, number][] = [
    ["дней", remaining?.days ?? 0],
    ["часов", remaining?.hours ?? 0],
    ["минут", remaining?.minutes ?? 0],
    ["секунд", remaining?.seconds ?? 0],
  ];

  return (
    <>
      <TrimDivider direction={dividerDirection} />
      <Section bleed="contained" className="text-center">
        <Eyebrow>До свадьбы осталось</Eyebrow>
        <div className="mt-8 flex justify-center gap-4 md:gap-8">
          {units.map(([label, value]) => (
            <div key={label}>
              <div
                className="rounded-sm bg-(--color-text) px-3 py-2 text-3xl text-[#FF8A3D] tabular-nums md:px-5 md:py-3 md:text-5xl"
                style={{ fontFamily: "var(--font-mono)" }}
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
    </>
  );
}
