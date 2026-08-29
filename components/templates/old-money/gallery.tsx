import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// See venue.tsx — same full-bleed dark alternation as Tuscany's Gallery.
export function OldMoneyGallery({ content }: BlockProps<"gallery">) {
  const photos = content.photos.filter(isRenderableUrl);

  return (
    <Section bleed="full" className="bg-(--color-primary) text-(--color-background)">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <Eyebrow className="text-(--color-background)/70">Галерея</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl text-(--color-background) md:text-4xl">
            Несколько моментов
          </DisplayHeading>
        </div>
        {photos.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden border border-(--color-accent)/40"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
