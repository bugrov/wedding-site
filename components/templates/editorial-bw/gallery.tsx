import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

// Two real scanned-film grain/scratch photos (Freepik/Magnific, free tier,
// attribution required — see CREDITS.md), alternated per tile rather than
// tiling one texture everywhere — a single repeated overlay would read as
// an obvious pattern once several tiles sit next to each other in a grid,
// alternating two keeps each tile's grain looking like its own scan. Both
// have a black backing rather than true alpha (that tier's PNG export is
// paywalled), which is fine under `mix-blend-mode: screen` — screen(black,
// x) = x, so the black contributes nothing and behaves like transparency.
const GRAIN_OVERLAYS = ["/images/film/grain-noise.webp", "/images/film/grain-scratches.webp"];

// `grayscale` on every photo — same reasoning as Cover/Story, keeps this
// direction's black-and-white identity regardless of the client's actual
// uploaded colors. Grain overlay on each tile is what makes it read as
// scanned film contact sheet rather than just a desaturated photo grid.
export function EditorialBwGallery({ content, dividerDirection }: BlockProps<"gallery">) {
  const photos = content.photos.filter(isRenderableUrl);

  return (
    <>
      <TrimDivider direction={dividerDirection} />
      <Section bleed="contained">
        <div className="text-center">
          <Eyebrow>Галерея</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
            Несколько моментов
          </DisplayHeading>
        </div>
        {photos.length > 0 && (
          <div className="mt-10 grid grayscale grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-screen"
                  style={{
                    backgroundImage: `url(${GRAIN_OVERLAYS[i % GRAIN_OVERLAYS.length]})`,
                  }}
                  aria-hidden
                />
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
