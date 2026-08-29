import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { PHOTO_FRAME_CLASSNAME } from "./decor";

// The signature even pink frame from Cover/Story repeats around every
// gallery photo here (see plan/reference board) — the defining trait of
// this direction, so it isn't reserved for just the hero shot.
export function PinkSketchGallery({ content }: BlockProps<"gallery">) {
  const photos = content.photos.filter(isRenderableUrl);

  return (
    <Section bleed="contained">
      <div className="text-center">
        <Eyebrow>Галерея</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
          Несколько моментов
        </DisplayHeading>
      </div>
      {photos.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {photos.map((src, i) => (
            <div
              key={i}
              className={cn("relative aspect-square overflow-hidden", PHOTO_FRAME_CLASSNAME)}
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
    </Section>
  );
}
