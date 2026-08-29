import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TornCard } from "./decor";

export function MoodyPaperGallery({ content }: BlockProps<"gallery">) {
  const photos = content.photos.filter(isRenderableUrl);

  return (
    <Section bleed="full">
      <TornCard>
        <div className="text-center">
          <Eyebrow>Галерея</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            Несколько моментов
          </DisplayHeading>
        </div>
        {photos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 288px"
                />
              </div>
            ))}
          </div>
        )}
      </TornCard>
    </Section>
  );
}
