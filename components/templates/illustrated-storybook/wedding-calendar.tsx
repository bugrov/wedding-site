"use client";

import { cn } from "@/lib/utils";
import { CALENDAR_WEEKDAY_LABELS, CALENDAR_MONTH_NAMES, getMonthGrid } from "@/lib/calendar-grid";

// A soft, rounded "keepsake" calendar card — storybook-cute rather than
// Tuscany's tilted photo card or Old Money's engraved one.
export function StorybookCalendar({ date }: { date: Date }) {
  const grid = getMonthGrid(date);
  const day = date.getDate();

  return (
    <div className="mx-auto w-full max-w-xs rounded-3xl border border-(--color-accent)/30 bg-(--color-background) p-6 shadow-sm">
      <div className="text-center">
        <div className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {CALENDAR_MONTH_NAMES[date.getMonth()]}
        </div>
        <div className="text-xs text-(--color-text)/60">{date.getFullYear()}</div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-(--color-text)/50">
        {CALENDAR_WEEKDAY_LABELS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
        {grid.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              cell === day && "bg-(--color-accent) font-bold text-(--color-background)",
            )}
          >
            {cell ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}
