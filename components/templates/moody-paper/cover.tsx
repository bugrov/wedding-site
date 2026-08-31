import Image from "next/image";
import {
  Section,
  Eyebrow,
  DisplayHeading,
  AccentText,
  isRenderableUrl,
} from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { MOODY_PAPER_DECOR } from "./decor-assets";
import { TornCard } from "./decor";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// The torn-paper card with the names comes first; the project's own photo
// sits below it (see feedback: "опустить его под блок с приглашением"),
// framed by the exact same tornTop/tornBottom pair every other card uses —
// tornTop above it, tornBottom below it, in normal document flow, not
// overlaid on top of the photo. An earlier version overlaid the two edge
// images ON the photo with their roles swapped, which both covered part of
// the photo in solid paper and used each texture backwards from how it
// appears everywhere else on the page (see feedback: "вывернутые
// текстуры... как у всех сделай").
export function MoodyPaperCover({ project, content }: CoverProps) {
  const hasPhoto = content.photoUrl && isRenderableUrl(content.photoUrl);

  return (
    <>
      {/* Its own full-height screen, deliberately — the photo below is a
          separate block in normal flow, not squeezed into this same
          min-height. Card content is usually shorter than one viewport, so
          this reads as generous dark canvas framing it top and bottom
          (see feedback: wanted full height "even if that means a lot of
          black above/below" rather than the card and photo sharing one
          min-height that neither alone could fill). */}
      <Section
        as="header"
        bleed="full"
        className="flex min-h-dvh flex-col items-center justify-center pt-0!"
      >
        <TornCard className="text-center">
          <Eyebrow>Приглашение на свадьбу</Eyebrow>
          <DisplayHeading className="mt-3 text-3xl leading-tight md:text-5xl">
            {project.groomName} <AccentText className="not-italic">&amp;</AccentText>{" "}
            {project.brideName}
          </DisplayHeading>
          <p className="mt-3 text-sm tracking-[0.2em] text-(--color-text)/60 uppercase">
            {dateFormatter.format(project.weddingDate)}
          </p>
          {content.tagline && (
            <p
              className="mx-auto mt-4 max-w-sm break-words text-(--color-text)/80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {content.tagline}
            </p>
          )}
        </TornCard>
      </Section>
      {hasPhoto && (
        <div className="w-full">
          <div className="w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOODY_PAPER_DECOR.tornTop}
              alt=""
              className="block h-auto w-[130%] max-w-none -translate-x-[11.5%]"
              aria-hidden
            />
          </div>
          {/* The paper texture itself stays full-bleed (see above) — only
              the photo is capped, so it doesn't stretch to low quality on
              ultra-wide screens. The cream fill matches the paper's own
              tone, so on screens past the cap it reads as a wide paper mat
              around a centered photo, not a stray gap. */}
          <div className="w-full bg-(--color-background)">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[1600px] overflow-hidden sm:aspect-[16/9]">
              <Image
                src={content.photoUrl!}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
          <div className="-mt-px w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOODY_PAPER_DECOR.tornBottom}
              alt=""
              className="block h-auto w-[130%] max-w-none -translate-x-[11.5%]"
              aria-hidden
            />
          </div>
        </div>
      )}
    </>
  );
}
