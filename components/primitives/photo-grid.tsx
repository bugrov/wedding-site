import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type GridPhoto = {
  src?: string;
  alt?: string;
};

export type PhotoGridVariant = "hero" | "collage-2" | "collage-3" | "collage-4";

const SLOT_COUNT: Record<PhotoGridVariant, number> = {
  hero: 1,
  "collage-2": 2,
  "collage-3": 3,
  "collage-4": 4,
};

const GRID_CLASS: Record<PhotoGridVariant, string> = {
  hero: "grid grid-cols-1",
  "collage-2": "grid grid-cols-2 gap-4",
  // Asymmetric: one tall photo beside two stacked smaller ones — the
  // "1 big + 2-3 small" collage from the editorial-style research.
  "collage-3": "grid grid-cols-2 grid-rows-2 gap-4",
  "collage-4": "grid grid-cols-2 grid-rows-2 gap-4",
};

const ASPECT_CLASS: Record<PhotoGridVariant, string> = {
  hero: "aspect-[16/10]",
  "collage-2": "aspect-[4/5]",
  "collage-3": "aspect-[4/5]",
  "collage-4": "aspect-square",
};

/**
 * Photo layout library from the plan's design system: hero (full-width),
 * and 2/3/4-photo collages. A missing photo slot renders a neutral
 * placeholder rather than breaking the grid — real content comes later,
 * per-project.
 */
export function PhotoGrid({
  photos,
  variant,
  className,
}: {
  photos: GridPhoto[];
  variant: PhotoGridVariant;
  className?: string;
}) {
  const slots = SLOT_COUNT[variant];
  const items = Array.from({ length: slots }, (_, i) => photos[i]);

  return (
    <div className={cn(GRID_CLASS[variant], className)}>
      {items.map((photo, i) => {
        // In collage-3 the first slot spans both rows — its height comes
        // from the grid track (row-span-2 + stretch), not from its own
        // aspect-ratio, otherwise the aspect box and the grid's row sizing
        // fight each other and the "tall" photo ends up the same height as
        // the other two instead of spanning both rows.
        const isSpanningFirst = variant === "collage-3" && i === 0;
        return (
          <PhotoSlot
            key={i}
            photo={photo}
            aspectClassName={isSpanningFirst ? undefined : ASPECT_CLASS[variant]}
            className={isSpanningFirst ? "row-span-2 h-full" : undefined}
          />
        );
      })}
    </div>
  );
}

// Exported so consumers rendering photos outside PhotoGrid itself (e.g. the
// gallery block's own variable-count grid) can apply the same guard.
export function isRenderableUrl(src: string): boolean {
  // A controlled input feeding this straight into next/image (e.g. the
  // configurator's live-editing photo fields) produces an invalid,
  // in-progress URL on every keystroke until typing finishes — next/image
  // throws synchronously on those instead of just failing to load, crashing
  // the whole tree. Treat "not a real URL yet" the same as "no photo".
  //
  // `new URL()` alone isn't enough: it happily parses a pasted Windows path
  // like "C:\Temp\foo.md" as an opaque "c:" scheme instead of throwing, so a
  // stray file path reached next/image and crashed it (next.config.ts only
  // allows https remotePatterns). Require http(s) explicitly, matching the
  // stricter check already used by lib/blocks/schema.ts's httpUrlSchema.
  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function PhotoSlot({
  photo,
  aspectClassName,
  className,
}: {
  photo?: GridPhoto;
  aspectClassName?: string;
  className?: string;
}) {
  if (!photo?.src || !isRenderableUrl(photo.src)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-sm bg-neutral-100 text-neutral-400",
          aspectClassName,
          className,
        )}
      >
        <ImageIcon className="h-6 w-6" aria-hidden />
        <span className="sr-only">Фото ещё не добавлено</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-sm", aspectClassName, className)}>
      <Image
        src={photo.src}
        alt={photo.alt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
