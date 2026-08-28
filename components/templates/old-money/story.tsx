import { Section, Eyebrow, DisplayHeading, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

export function OldMoneyStory({ content }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <Section bleed="contained">
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-10 md:gap-16",
          photos.length > 0 && "md:grid-cols-2",
        )}
      >
        <div className="text-center md:text-left">
          <Eyebrow>О нас</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            Наша история
          </DisplayHeading>
          <div className="mx-auto mt-4 h-px w-10 bg-(--color-accent) md:mx-0" />
          <p
            className="mt-6 text-xl leading-relaxed whitespace-pre-line text-(--color-text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {content.text}
          </p>
        </div>
        {photos.length > 0 && (
          <PhotoGrid
            variant={photos.length === 1 ? "hero" : "collage-2"}
            photos={photos.map((src) => ({ src }))}
          />
        )}
      </div>
    </Section>
  );
}
