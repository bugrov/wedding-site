"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { Section, Eyebrow } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TUSCANY_DECOR } from "./decor-assets";

// Timer content is empty per the schema — it just counts down to the
// project's wedding date, which isn't part of blocksConfig (it lives on the
// project itself). For step 3 (template rendering only, no real project
// wiring yet) we count down to a fixed placeholder date.
const PLACEHOLDER_TARGET = new Date("2026-09-12T15:00:00");

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(target: Date): Remaining {
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function sameRemaining(a: Remaining, b: Remaining) {
  return (
    a.days === b.days && a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
  );
}

// The wall clock is genuinely external state, so this reads via
// useSyncExternalStore rather than setState-in-an-effect — it's what React
// recommends for exactly this "ticking clock" case, and it sidesteps the
// hydration mismatch a plain useState+useEffect clock would hit (server and
// client would otherwise compute Date.now() at two different instants).
function useCountdown(target: Date): Remaining | null {
  const cacheRef = useRef<Remaining | null>(null);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const id = setInterval(onStoreChange, 1000);
    return () => clearInterval(id);
  }, []);

  const getSnapshot = useCallback(() => {
    const next = getRemaining(target);
    if (cacheRef.current && sameRemaining(cacheRef.current, next)) {
      return cacheRef.current;
    }
    cacheRef.current = next;
    return next;
  }, [target]);

  // Server (and the client's very first render, pre-hydration) has no
  // meaningful "now" to compute against — null renders a stable placeholder.
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function TuscanyTimer(_props: BlockProps<"timer">) {
  void _props;
  const remaining = useCountdown(PLACEHOLDER_TARGET);

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
      </div>
    </Section>
  );
}
