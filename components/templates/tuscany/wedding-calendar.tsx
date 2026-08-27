// A small decorative month calendar with the wedding day circled — the
// "pretty calendar" competitors have that we didn't (see feedback). Each
// template gets its own visual treatment of this (per plan: shared concept,
// per-template rendering) — this is Tuscany's.
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

export function WeddingCalendar({ date }: { date: Date }) {
  const cells = getMonthGrid(date);
  const weddingDay = date.getDate();

  return (
    <div className="mx-auto w-full max-w-[280px] rounded-2xl border border-white/25 bg-white/10 p-5 text-(--color-background) shadow-lg backdrop-blur-md">
      <p
        className="text-center text-lg tracking-wide"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="opacity-60">
            {label}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className="flex items-center justify-center">
            {day && (
              <span
                className={
                  day === weddingDay
                    ? "flex h-6 w-6 items-center justify-center rounded-full bg-(--color-accent) font-semibold text-(--color-primary)"
                    : "flex h-6 w-6 items-center justify-center opacity-80"
                }
              >
                {day}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
