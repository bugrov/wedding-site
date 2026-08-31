import {
  Section,
  DisplayHeading,
  AccentText,
  Eyebrow,
  BotanicalSprig,
  PhotoGrid,
} from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function TuscanyCover({ project, content }: CoverProps) {
  return (
    <Section
      as="header"
      bleed="contained"
      className="flex min-h-dvh flex-col items-stretch justify-center pb-8 text-center md:pb-12"
    >
      <Eyebrow>Приглашение на свадьбу</Eyebrow>
      <DisplayHeading className="mt-3">
        {project.groomName} &amp; {project.brideName}
      </DisplayHeading>
      <AccentText className="mt-3 block">{dateFormatter.format(project.weddingDate)}</AccentText>
      {content.tagline && (
        <p
          className="mx-auto mt-4 max-w-sm break-words text-(--color-text)/80"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {content.tagline}
        </p>
      )}
      <div className="mt-6 flex justify-center">
        <BotanicalSprig />
      </div>
      <div className="mt-10">
        <PhotoGrid variant="hero" photos={content.photoUrl ? [{ src: content.photoUrl }] : []} />
      </div>
    </Section>
  );
}
