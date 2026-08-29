import Image from "next/image";
import { DisplayHeading, AccentText, Eyebrow, PhotoGrid, Section } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { OLD_MONEY_DECOR } from "./decor-assets";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// A plain cream page with a round paper-doily vignette under the names —
// per feedback, a dark burgundy backdrop here sat right above the Timer's
// own dark burgundy hero and the two back-to-back read as too heavy/dark;
// keeping the drama for the Timer alone and staying light here instead.
export function OldMoneyCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="contained" className="text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[320px]">
        <Image
          src={OLD_MONEY_DECOR.coverDoily}
          alt=""
          fill
          priority
          className="object-contain"
          style={{
            filter:
              "drop-shadow(0 3px 6px rgba(42,27,22,0.35)) drop-shadow(0 18px 34px rgba(42,27,22,0.35))",
          }}
          sizes="320px"
        />
        {/* Names stack vertically rather than sharing one line — a plain
            inline "Groom & Bride" row overflowed the doily's width at
            narrow sizes, and long names would overflow it even at desktop
            widths. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
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
        <p className="mx-auto mt-6 max-w-sm text-(--color-text)/80">{content.tagline}</p>
      )}
      {content.photoUrl && (
        <div className="mx-auto mt-10 max-w-2xl">
          <PhotoGrid variant="hero" photos={[{ src: content.photoUrl }]} />
        </div>
      )}
    </Section>
  );
}
