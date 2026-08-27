import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TUSCANY_DECOR } from "./decor-assets";

// Mirrored split from Story (photo left / text right here) for editorial
// rhythm variety down the page, per the plan's design-system notes.
export function TuscanyDressCode({ content }: BlockProps<"dresscode">) {
  return (
    <Section bleed="contained">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <PhotoGrid variant="hero" photos={[{ src: TUSCANY_DECOR.dressCodeAccent, alt: "" }]} />
        <div className="text-center md:text-left">
          <Eyebrow>Дресс-код</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            Стиль вечера
          </DisplayHeading>
          <BodyText className="mt-4 md:max-w-md">{content.text}</BodyText>
          {content.palette && content.palette.length > 0 && (
            <div className="mt-6 flex justify-center gap-3 md:justify-start">
              {content.palette.map((color, i) => (
                <span
                  key={i}
                  className="h-8 w-8 rounded-full border border-black/10"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
