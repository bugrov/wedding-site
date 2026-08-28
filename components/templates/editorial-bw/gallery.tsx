import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

// `grayscale` on every photo — same reasoning as Cover/Story, keeps this
// direction's black-and-white identity regardless of the client's actual
// uploaded colors.
export function EditorialBwGallery({ content }: BlockProps<"gallery">) {
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
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
