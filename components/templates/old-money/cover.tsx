import { Section, DisplayHeading, AccentText, Eyebrow, PhotoGrid } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { CornerFlourish } from "./decor";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A symmetric, formal "engraved invitation card" layout — deliberately
// centered and framed, unlike Tuscany's asymmetric split (see plan: Old
// Money reads as a printed card, not an editorial spread).
export function OldMoneyCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="contained" className="pb-8 text-center md:pb-12">
      <div className="relative mx-auto max-w-2xl border border-(--color-accent)/40 px-6 py-12 md:px-16 md:py-16">
        <CornerFlourish className="absolute top-2 left-2" />
        <CornerFlourish className="absolute top-2 right-2 rotate-90" />
        <CornerFlourish className="absolute bottom-2 left-2 -rotate-90" />
        <CornerFlourish className="absolute right-2 bottom-2 rotate-180" />

        <Eyebrow>Приглашение на свадьбу</Eyebrow>
        <DisplayHeading className="mt-3">
          {project.groomName}
          <span className="mx-3 text-(--color-accent-text)">&amp;</span>
          {project.brideName}
        </DisplayHeading>
        <AccentText className="mt-3 block">{dateFormatter.format(project.weddingDate)}</AccentText>
        {content.tagline && <p className="mt-4 text-(--color-text)/80">{content.tagline}</p>}
      </div>
      <div className="mt-10">
        <PhotoGrid variant="hero" photos={content.photoUrl ? [{ src: content.photoUrl }] : []} />
      </div>
    </Section>
  );
}
