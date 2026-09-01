import { Section, Eyebrow, DisplayHeading, BodyText, PhotoGrid } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { TrimDivider } from "./decor";

// A real burnt/aged filmstrip photo (Freepik/Magnific, free tier,
// attribution required — see CREDITS.md) as a faint background flourish —
// "история" ~ "reel of memories" is the one place in this template that
// earns a decorative image rather than just a texture, per feedback: "а
// текстуру и обожжённую катушку куда — предложи идею" → Наша история.
// Oversize + `overflow-hidden` + negative-translate to hide the ribbon's
// straight-cut edges off the section's edges — the same pattern used for
// Moody Paper's full-bleed decorative images (see project-state.md Design
// Decisions), not this template's own invention.
const STORY_BANNER = "/images/film/story-banner.webp";

// Grain overlay on the story photo(s) — same asset used on the gallery's
// second tile parity (see gallery.tsx GRAIN_OVERLAYS); only one photo group
// here so there's no alternation to do, just a fixed pick.
const STORY_GRAIN = "/images/film/grain-scratches.webp";

// Centered, photo stacked below the text — simpler than the earlier
// two-column text+photo split, per feedback (that split was the one block
// breaking from every other section's centered layout). `grayscale`
// wrapper keeps every client photo black-and-white, same reasoning as
// Cover.
export function EditorialBwStory({ content, dividerDirection }: BlockProps<"story">) {
  const photos = (content.photos ?? []).filter((src): src is string => Boolean(src));

  return (
    <>
      <TrimDivider direction={dividerDirection} />
      <Section bleed="contained" className="relative overflow-hidden text-center">
        <div
          className="pointer-events-none absolute inset-x-[-15%] top-1/2 h-[60%] w-[130%] max-w-none -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-[0.08]"
          style={{ backgroundImage: `url(${STORY_BANNER})` }}
          aria-hidden
        />
        <div className="relative">
          <Eyebrow>О нас</Eyebrow>
          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-5xl">
            Наша история
          </DisplayHeading>
          <BodyText className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" font="display">
            {content.text}
          </BodyText>
          {photos.length > 0 && (
            <div className="relative mx-auto mt-10 max-w-2xl grayscale">
              <PhotoGrid
                variant={photos.length === 1 ? "hero" : "collage-2"}
                photos={photos.map((src) => ({ src }))}
              />
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-screen"
                style={{ backgroundImage: `url(${STORY_GRAIN})` }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
