import { Section, DisplayHeading, AccentText, Eyebrow, PhotoGrid } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { StorybookBloom } from "./decor";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A plain centered card — no stock photo dependency for the frame itself
// (see plan: this direction stays cheap via small SVG accents, not a full
// illustrated scene). The couple's own photo still gets pride of place
// below, same as every other template.
export function StorybookCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="contained" className="pb-8 text-center md:pb-12">
      <Eyebrow>Приглашение на свадьбу</Eyebrow>
      <DisplayHeading className="mt-3">
        {project.groomName}
        <span className="mx-3 text-(--color-accent-text)">&amp;</span>
        {project.brideName}
      </DisplayHeading>
      <AccentText className="mt-3 block text-2xl not-italic md:text-3xl">
        {dateFormatter.format(project.weddingDate)}
      </AccentText>
      <StorybookBloom className="mx-auto mt-4" />
      {content.tagline && <p className="mt-4 text-(--color-text)/80">{content.tagline}</p>}
      <div className="mt-10">
        <PhotoGrid variant="hero" photos={content.photoUrl ? [{ src: content.photoUrl }] : []} />
      </div>
    </Section>
  );
}
