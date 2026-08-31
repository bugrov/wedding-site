import Image from "next/image";
import { Section } from "@/components/primitives";
import type { CoverProps } from "@/lib/templates/types";
import { OLD_MONEY_DECOR } from "./decor-assets";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Names + date render in the flourish-heavy accent script (see theme.tsx's
// Fondamento) rather than the plain display serif — per feedback, plain
// Cormorant read as "no flourishes, no slant, no old-money character" for
// the doily's lettering, which the reference board sets in a calligraphic
// script for the whole "Clara & Elliot" line.
const scriptStyle = { fontFamily: "var(--font-accent)" } as const;

// A wedding-dress photo now sits behind the doily (see reference board and
// feedback) instead of a flat cream page — the doily's own paper tone reads
// clearly against it without needing a dark scrim. The project's own main
// photo used to render below as a separate hero shot here; it's now the
// Timer's hero photo instead (see old-money/timer.tsx), so this block no
// longer touches content.photoUrl at all.
export function OldMoneyCover({ project, content }: CoverProps) {
  return (
    <Section as="header" bleed="full" className="py-0 text-center md:py-0">
      <div className="relative mx-auto min-h-dvh w-full max-w-[1600px] overflow-hidden">
        <Image
          src={OLD_MONEY_DECOR.coverBackground}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {content.tagline && (
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent pt-12 pb-5"
            aria-hidden={false}
          >
            <p
              className="mx-auto max-w-xs px-6 text-center text-base break-words text-(--color-background)"
              style={scriptStyle}
            >
              {content.tagline}
            </p>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative aspect-square w-full max-w-[320px]">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
              <p className="text-lg text-(--color-accent-text)" style={scriptStyle}>
                Приглашение на свадьбу
              </p>
              <p
                className="mt-3 text-xl leading-snug break-words text-(--color-text) md:text-2xl"
                style={scriptStyle}
              >
                {project.groomName}
              </p>
              <p className="my-0.5 block text-lg text-(--color-accent-text)" style={scriptStyle}>
                &amp;
              </p>
              <p
                className="text-xl leading-snug break-words text-(--color-text) md:text-2xl"
                style={scriptStyle}
              >
                {project.brideName}
              </p>
              <p className="mt-2 block text-sm text-(--color-accent-text)" style={scriptStyle}>
                {dateFormatter.format(project.weddingDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
