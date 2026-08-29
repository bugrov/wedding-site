import { SquigglyDivider, ScribbleRing } from "./decor";
import { CALENDAR_WEEKDAY_LABELS, CALENDAR_MONTH_NAMES, getMonthGrid } from "@/lib/calendar-grid";

// This direction's own take on the shared date-grid idea — a blush card
// with a scribbled ring around the wedding day instead of a filled dot
// (see decor.tsx's ScribbleRing).
export function PinkSketchCalendar({ date }: { date: Date }) {
  const cells = getMonthGrid(date);
  const weddingDay = date.getDate();

  return (
    <div className="relative mx-auto w-full max-w-[300px] rotate-1 rounded-sm bg-(--color-background) px-6 pt-7 pb-6 text-(--color-text) shadow-xl">
      <p className="text-center text-2xl" style={{ fontFamily: "var(--font-accent)" }}>
        {CALENDAR_MONTH_NAMES[date.getMonth()]}
      </p>
      <p className="mt-0.5 text-center text-[11px] tracking-[0.25em] text-(--color-text)/50 uppercase">
        {date.getFullYear()}
      </p>
      <SquigglyDivider className="mx-auto mt-3 mb-4 text-(--color-accent)" />
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
        {CALENDAR_WEEKDAY_LABELS.map((label) => (
          <span key={label} className="tracking-wide text-(--color-text)/40">
            {label}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className="flex items-center justify-center py-0.5">
            {day && (
              <span className="relative flex h-7 w-7 items-center justify-center">
                {day === weddingDay && (
                  <ScribbleRing className="absolute inset-0 text-(--color-accent)" />
                )}
                <span
                  className={
                    day === weddingDay
                      ? "relative font-semibold"
                      : "relative text-(--color-text)/70"
                  }
                >
                  {day}
                </span>
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
