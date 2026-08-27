import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";

export function TuscanyGallery({ content }: BlockProps<"gallery">) {
  return (
    <Section bleed="contained">
      <div className="text-center">
        <Eyebrow>Галерея</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Несколько моментов
        </DisplayHeading>
      </div>
      <div className="mt-10">
        <PhotoGrid variant="collage-4" photos={content.photos.map((src) => ({ src }))} />
      </div>
    </Section>
  );
}
