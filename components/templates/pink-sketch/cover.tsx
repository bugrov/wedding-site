import Image from "next/image";
import {
  Section,
  DisplayHeading,
  AccentText,
  Eyebrow,
  isRenderableUrl,
} from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { PHOTO_FRAME_CLASSNAME, VerticalLabel } from "./decor";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PinkSketchCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="contained" className="text-center">
      <Eyebrow>Приглашение на свадьбу</Eyebrow>
      <DisplayHeading className="mt-3 text-4xl md:text-6xl">
        {project.groomName} <AccentText className="not-italic">&amp;</AccentText>{" "}
        {project.brideName}
      </DisplayHeading>
      <p className="mt-3 text-sm tracking-[0.2em] text-(--color-text)/60 uppercase">
        {dateFormatter.format(project.weddingDate)}
      </p>
      {content.tagline && (
        <p className="mx-auto mt-4 max-w-md text-(--color-text)/80">{content.tagline}</p>
      )}
      <div className="relative mx-auto mt-10 max-w-md pl-4">
        <VerticalLabel className="top-1/2 -left-2">Сохраните дату</VerticalLabel>
        <div
          className={cn("relative aspect-[4/5] overflow-hidden bg-black/5", PHOTO_FRAME_CLASSNAME)}
        >
          {content.photoUrl && isRenderableUrl(content.photoUrl) && (
            <Image
              src={content.photoUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          )}
        </div>
      </div>
    </Section>
  );
}
