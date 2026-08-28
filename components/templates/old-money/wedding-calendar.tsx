import { CALENDAR_WEEKDAY_LABELS, CALENDAR_MONTH_NAMES, getMonthGrid } from "@/lib/calendar-grid";

// This direction's own visual take on the shared date-grid idea (see
// components/templates/tuscany/wedding-calendar.tsx for the "hand-drawn ink
// circle" version, lib/calendar-grid.ts for the shared math) — an engraved
// card instead of a pinned parchment note, no tilt/shadow, thin gold rules
// instead of a botanical sprig.

export function OldMoneyCalendar({ date }: { date: Date }) {
  const cells = getMonthGrid(date);
  const weddingDay = date.getDate();

  return (
    <div className="relative mx-auto w-full max-w-[300px] border border-(--color-accent)/50 bg-(--color-background) px-6 pt-7 pb-6 text-(--color-text) shadow-xl">
      <p className="text-center text-2xl italic" style={{ fontFamily: "var(--font-display)" }}>
        {CALENDAR_MONTH_NAMES[date.getMonth()]}
      </p>
      <p className="mt-0.5 text-center text-[11px] tracking-[0.25em] text-(--color-text)/50 uppercase">
        {date.getFullYear()}
      </p>
      <div className="mx-auto mt-3 mb-4 h-px w-10 bg-(--color-accent)" />
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
                  <span className="absolute inset-0 rounded-full border border-(--color-accent)" />
                )}
                <span
                  className={
                    day === weddingDay
                      ? "relative font-semibold text-(--color-primary)"
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
