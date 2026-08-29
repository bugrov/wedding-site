"use client";

import Image from "next/image";
import { Eyebrow, isRenderableUrl, Section } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { OLD_MONEY_DECOR } from "./decor-assets";

// The hero element of this direction (see plan: "таймер как хиро-элемент")
// — taller and more dramatic than Tuscany's version, with the
// envelope-and-wax-seal flatlay as the full-bleed background. The
// project's own main photo (moved here from Cover, see old-money/cover.tsx)
// now sits below the countdown. The wedding-day calendar (see
// wedding-calendar.tsx) briefly lived in its own section right after this
// one but was hidden again per feedback ("календарь скрыть, пока лишний") —
// the component stays for whenever it's wanted back.
export function OldMoneyTimer({ project, coverPhotoUrl }: BlockProps<"timer">) {
  const remaining = useCountdown(project.weddingDate);

  const units: [string, number][] = [
    ["дней", remaining?.days ?? 0],
    ["часов", remaining?.hours ?? 0],
    ["минут", remaining?.minutes ?? 0],
    ["секунд", remaining?.seconds ?? 0],
  ];

  return (
    <>
      <Section
        bleed="full"
        className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-16 text-center text-(--color-background)"
      >
        <Image
          src={OLD_MONEY_DECOR.timerBackground}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-(--color-primary)/90" aria-hidden />
        <div className="relative">
          <Eyebrow className="text-(--color-background)/70">До свадьбы осталось</Eyebrow>
          <div className="mt-6 flex justify-center gap-8 md:gap-16">
            {units.map(([label, value]) => (
              <div key={label}>
                <div
                  className="text-5xl font-medium md:text-7xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-2 text-xs tracking-[0.2em] uppercase opacity-70">{label}</div>
              </div>
            ))}
          </div>
          {coverPhotoUrl && isRenderableUrl(coverPhotoUrl) && (
            <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-sm overflow-hidden">
              <Image src={coverPhotoUrl} alt="" fill className="object-cover" sizes="384px" />
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
