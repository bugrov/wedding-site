import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Eyebrow, DisplayHeading, isRenderableUrl } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";
import { Monogram } from "./decor";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Full-bleed travel photography with overlaid text (see plan: "Крупная
// травел-фотография на всю ширину") — the one signature move for this
// direction, unlike Tuscany's centered split or Old Money's framed card.
// Falls back to a plain neutral placeholder + normal-toned text when no
// client photo is set yet, same "never leave a client-image slot totally
// blank" convention as the other templates. `grayscale` on the image itself
// — this direction is named "Editorial Ч-Б" specifically, so every client
// photo renders black-and-white here regardless of what color photo they
// actually upload, guaranteeing the look instead of hoping they pick B&W
// shots themselves.
export function EditorialBwCover({ project, content }: CoverProps) {
  const hasPhoto = !!content.photoUrl && isRenderableUrl(content.photoUrl);

  return (
    <header className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col items-stretch justify-end overflow-hidden">
      {hasPhoto ? (
        <Image
          src={content.photoUrl!}
          alt=""
          fill
          priority
          className="object-cover grayscale"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400">
          <ImageIcon className="h-10 w-10" aria-hidden />
        </div>
      )}
      {hasPhoto && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          aria-hidden
        />
      )}
      <div className="relative p-8 md:p-16">
        <Monogram
          groomName={project.groomName}
          brideName={project.brideName}
          className={hasPhoto ? "border-white text-white" : undefined}
        />
        <Eyebrow className={cn("mt-6 block", hasPhoto && "text-white/70")}>
          Приглашение на свадьбу
        </Eyebrow>
        <DisplayHeading className={cn("mt-3", hasPhoto && "text-white")}>
          {project.groomName} &amp; {project.brideName}
        </DisplayHeading>
        <p
          className={cn(
            "mt-3 text-lg italic",
            hasPhoto ? "text-white/90" : "text-(--color-text)/70",
          )}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {dateFormatter.format(project.weddingDate)}
        </p>
        {content.tagline && (
          <p
            className={cn(
              "mt-4 max-w-md break-words",
              hasPhoto ? "text-white/80" : "text-(--color-text)/80",
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {content.tagline}
          </p>
        )}
      </div>
    </header>
  );
}
