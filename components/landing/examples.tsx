import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";

// Illustrative palette swatches only — not the committed design tokens for
// these 4 not-yet-built directions (that happens when each is actually
// designed at step 10). Real demo sites with real photos/content are step 11
// (after all 5 templates exist) — deliberately not faking a "live example"
// link before that's true; this section instead shows the range of styles
// coming and which one is real today.
const STYLES = [
  {
    name: "Тоскана",
    palette: ["#4B5320", "#9C6B30", "#F6F2EA"],
    available: true,
  },
  { name: "Old Money", palette: ["#6B1E2B", "#A9813E", "#F6EFE2"], available: true },
  { name: "Editorial Ч-Б", palette: ["#1A1A1A", "#B5533C", "#E5E0DA"], available: true },
  { name: "Направление 4", palette: ["#D9A9A0", "#F3E9DD"], available: false },
  { name: "Направление 5", palette: ["#14201A", "#EDE6D8"], available: false },
];

export function Examples() {
  return (
    <Section bleed="contained" className="border-t border-black/10">
      <div className="text-center">
        <Eyebrow>Примеры</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Направления дизайна
        </DisplayHeading>
        <BodyText className="mx-auto mt-4 max-w-lg">
          «Тоскана», «Old Money» и «Editorial Ч-Б» уже доступны — соберите свой сайт в конструкторе
          ниже. Остальные направления появятся здесь по мере готовности.
        </BodyText>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STYLES.map((style) => (
          <a
            key={style.name}
            href={style.available ? "#configurator" : undefined}
            aria-disabled={!style.available}
            className={`flex flex-col items-center gap-3 rounded-lg border border-black/10 px-4 py-8 text-center transition ${
              style.available ? "hover:border-(--color-primary)" : "cursor-default opacity-50"
            }`}
          >
            <div className="flex gap-1.5">
              {style.palette.map((color) => (
                <span
                  key={color}
                  className="h-6 w-6 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{style.name}</span>
            <span className="text-xs text-(--color-text)/50">
              {style.available ? "Доступно" : "Скоро"}
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
