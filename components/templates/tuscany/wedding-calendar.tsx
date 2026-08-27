import { BotanicalSprig, DividerLine } from "@/components/primitives";

// A small decorative month calendar with the wedding day circled — the
// "pretty calendar" competitors have that we didn't (see feedback). Styled
// as a parchment card pinned onto the timer's photo background (slight tilt,
// paper shadow) rather than a plain glass-on-dark grid — the flat first
// version read as "too simple"; this borrows the recurring Pinterest
// reference pattern (hand-drawn ink circle around the date, a botanical
// corner sprig, a script-leaning month label) instead of a solid filled dot.
// Each template gets its own visual take on the same date-grid logic below.
const WEEKDAY_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function getMonthGrid(date: Date): (number | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// A single fixed "hand-drawn" ellipse path (not a perfect circle) standing
// in for a pen mark circling the date — irregular on purpose, echoing the
// reference designs' hand-marked "save the date" calendars.
function InkCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" className={className} fill="none" aria-hidden>
      <path
        d="M17 2C9 1 2 8 3 16c1 9 7 16 15 15 9-1 15-8 14-17-1-9-7-13-15-12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function WeddingCalendar({ date }: { date: Date }) {
  const cells = getMonthGrid(date);
  const weddingDay = date.getDate();

  return (
    <div className="relative mx-auto w-full max-w-[300px] -rotate-1 rounded-sm bg-(--color-background) px-6 pt-7 pb-6 text-(--color-text) shadow-xl">
      <BotanicalSprig className="absolute -top-3 -right-2 h-8 w-5 rotate-[20deg] text-(--color-accent)/60" />
      <p className="text-center text-2xl italic" style={{ fontFamily: "var(--font-display)" }}>
        {MONTH_NAMES[date.getMonth()]}
      </p>
      <p className="mt-0.5 text-center text-[11px] tracking-[0.25em] text-(--color-text)/50 uppercase">
        {date.getFullYear()}
      </p>
      <DividerLine className="mx-auto mt-3 mb-4 w-10" />
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="tracking-wide text-(--color-text)/40">
            {label}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className="flex items-center justify-center py-0.5">
            {day && (
              <span className="relative flex h-7 w-7 items-center justify-center">
                {day === weddingDay && (
                  <InkCircle className="absolute inset-0 text-(--color-accent)" />
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
