import Image from "next/image";
import { Section, DisplayHeading, AccentText, Eyebrow, PhotoGrid } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { ScallopedOval } from "./decor";
import { OLD_MONEY_DECOR } from "./decor-assets";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A dark, vintage-lace backdrop behind a scalloped oval vignette — the
// "engraved invitation card on a burgundy ground" register from the
// reference, replacing the earlier plain rectangular bordered card.
export function OldMoneyCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="full" className="relative overflow-hidden text-center">
      <Image
        src={OLD_MONEY_DECOR.coverBackground}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-(--color-primary)/90" aria-hidden />
      <div className="relative mx-auto flex max-w-md flex-col items-center px-6">
        <div className="relative flex aspect-[3/4] w-full max-w-[300px] items-center justify-center">
          <ScallopedOval className="absolute inset-0 h-full w-full" />
          {/* Names stack vertically rather than sharing one line — a plain
              inline "Groom & Bride" row overflowed the oval's width at
              narrow sizes, and long names would overflow it even at
              desktop widths. */}
          <div className="relative flex h-[88%] w-[82%] flex-col items-center justify-center overflow-hidden rounded-full bg-(--color-background) px-4 text-center">
            <Eyebrow>Приглашение на свадьбу</Eyebrow>
            <DisplayHeading className="mt-3 text-xl leading-snug break-words md:text-2xl">
              {project.groomName}
            </DisplayHeading>
            <AccentText className="my-0.5 block text-lg">&amp;</AccentText>
            <DisplayHeading className="text-xl leading-snug break-words md:text-2xl">
              {project.brideName}
            </DisplayHeading>
            <AccentText className="mt-2 block text-sm">
              {dateFormatter.format(project.weddingDate)}
            </AccentText>
          </div>
        </div>
        {content.tagline && (
          <p className="mt-8 max-w-sm text-(--color-background)/85">{content.tagline}</p>
        )}
      </div>
      {content.photoUrl && (
        <div className="relative mx-auto mt-12 max-w-2xl px-6">
          <PhotoGrid variant="hero" photos={[{ src: content.photoUrl }]} />
        </div>
      )}
    </Section>
  );
}
