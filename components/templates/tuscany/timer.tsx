"use client";

import Image from "next/image";
import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { TUSCANY_DECOR } from "./decor-assets";
import { WeddingCalendar } from "./wedding-calendar";

// Timer content is empty per the schema — it just counts down to the
// project's wedding date, which lives on the project itself, not
// blocksConfig (see BlockProps<T> — every block gets `project`, not just Cover).
export function TuscanyTimer({ project }: BlockProps<"timer">) {
  const remaining = useCountdown(project.weddingDate);

  const units: [string, number][] = [
    ["дней", remaining?.days ?? 0],
    ["часов", remaining?.hours ?? 0],
    ["минут", remaining?.minutes ?? 0],
    ["секунд", remaining?.seconds ?? 0],
  ];

  return (
    <Section
      bleed="full"
      className="relative overflow-hidden py-12 text-center text-(--color-background)"
    >
      {/* Template-level decorative background (see decor-assets.ts) — not
          client content, shared by every project on this template. */}
      <Image
        src={TUSCANY_DECOR.timerBackground}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-(--color-primary)/80" aria-hidden />
      <div className="relative">
        <Eyebrow className="text-(--color-background)/70">До свадьбы осталось</Eyebrow>
        <div className="mt-4 flex justify-center gap-6 md:gap-12">
          {units.map(([label, value]) => (
            <div key={label}>
              <div
                className="text-4xl font-semibold md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs tracking-wide uppercase opacity-70">{label}</div>
            </div>
          ))}
        </div>
        {/* Pretty per-template date calendar — competitors have this, we
            previously only showed the plain countdown (see feedback). */}
        <div className="mt-8">
          <WeddingCalendar date={project.weddingDate} />
        </div>
      </div>
    </Section>
  );
}
