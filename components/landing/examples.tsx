import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import { getSiteUrl } from "@/lib/site-url";

// Step 11: each swatch now links to a real, published demo Project (see
// prisma/seed-demos.ts) instead of "#configurator" — a live example per
// template, not a faked preview. The thumbnail is our own screenshot of that
// demo site (public/images/demo-previews/, see CREDITS.md), not the shared
// stock photo — the photo itself is identical across all 5 demos, so it
// wouldn't tell templates apart, but the actual rendered page does.
const STYLES = [
  {
    name: "Тоскана",
    palette: ["#4B5320", "#9C6B30", "#F6F2EA"],
    demoSlug: "demo-tuscany",
    preview: "/images/demo-previews/tuscany.jpg",
  },
  {
    name: "Old Money",
    palette: ["#6B1E2B", "#A9813E", "#F6EFE2"],
    demoSlug: "demo-old-money",
    preview: "/images/demo-previews/old-money.jpg",
  },
  {
    name: "Editorial Ч-Б",
    palette: ["#1C1912", "#D9631E", "#D7D4CC"],
    demoSlug: "demo-editorial-bw",
    preview: "/images/demo-previews/editorial-bw.jpg",
  },
  {
    name: "Pink Sketch",
    palette: ["#8B3226", "#C1503D", "#F2D9D3"],
    demoSlug: "demo-pink-sketch",
    preview: "/images/demo-previews/pink-sketch.jpg",
  },
  {
    name: "Moody Paper",
    palette: ["#1E2118", "#6B6650", "#F1F0EC"],
    demoSlug: "demo-moody-paper",
    preview: "/images/demo-previews/moody-paper.jpg",
  },
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
          «Тоскана», «Old Money», «Editorial Ч-Б», «Pink Sketch» и «Moody Paper» уже доступны —
          посмотрите живой пример каждого направления и соберите свой сайт в конструкторе ниже.
        </BodyText>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STYLES.map((style) => (
          <a
            key={style.name}
            href={getSiteUrl(style.demoSlug)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-black/10 text-center transition hover:border-(--color-primary)"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={style.preview}
                alt={`Превью сайта в стиле «${style.name}»`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              />
            </div>
            <div className="flex flex-col items-center gap-1.5 px-4 pb-4">
              <div className="flex gap-1">
                {style.palette.map((color) => (
                  <span
                    key={color}
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{style.name}</span>
              <span className="text-xs text-(--color-text)/50">Живой пример</span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
