import Image from "next/image";
import { Section, Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// See story.tsx for how alternateDark works.
export function TuscanyGallery({ content, alternateDark }: BlockProps<"gallery">) {
  // Fills in as links get added (up to 8, see schema) — no placeholder
  // boxes for photos nobody has added yet (see feedback, same bug as the
  // story block). A plain wrapping grid, not PhotoGrid's fixed-slot
  // collage-4: the photo count here varies 1-8, an asymmetric collage
  // layout doesn't generalize to that range. isRenderableUrl guards against
  // an in-progress URL (mid-keystroke in the live editor) crashing next/image.
  const photos = content.photos.filter(isRenderableUrl);

  return (
    <Section
      bleed={alternateDark ? "full" : "contained"}
      className={cn(alternateDark && "bg-(--color-primary) text-(--color-background)")}
    >
      <div className={cn(alternateDark && "mx-auto max-w-5xl px-6")}>
        <div className="text-center">
          <Eyebrow className={cn(alternateDark && "text-(--color-background)/70")}>Галерея</Eyebrow>
          <DisplayHeading
            as="h2"
            className={cn(
              "mt-3 text-3xl md:text-4xl",
              alternateDark && "text-(--color-background)",
            )}
          >
            Несколько моментов
          </DisplayHeading>
        </div>
        {photos.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-sm">
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
