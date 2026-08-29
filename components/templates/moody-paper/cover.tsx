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
    <Section as="header" bleed="full">
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
          <p className="mx-auto mt-4 max-w-sm text-(--color-text)/80">{content.tagline}</p>
        )}
      </TornCard>
      {hasPhoto && (
        <div className="mt-16 md:mt-24">
          <div className="w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOODY_PAPER_DECOR.tornTop}
              alt=""
              className="block h-auto w-[130%] max-w-none -translate-x-[11.5%]"
              aria-hidden
            />
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]">
            <Image
              src={content.photoUrl!}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
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
    </Section>
  );
}
