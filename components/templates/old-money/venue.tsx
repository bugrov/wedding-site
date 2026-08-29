import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// One of the alternating-background beats down the page (see feedback:
// "делаем чередование бордовых блоков") — see story.tsx for how
// alternateDark works.
export function OldMoneyVenue({ content, alternateDark }: BlockProps<"venue">) {
  return (
    <Section
      bleed={alternateDark ? "full" : "contained"}
      className={cn(
        "text-center",
        alternateDark && "bg-(--color-primary) text-(--color-background)",
      )}
    >
      <div className={cn(alternateDark && "mx-auto max-w-5xl px-6")}>
        <Eyebrow className={cn(alternateDark && "text-(--color-background)/70")}>
          Место проведения
        </Eyebrow>
        <DisplayHeading
          as="h2"
          className={cn("mt-3 text-3xl md:text-4xl", alternateDark && "text-(--color-background)")}
        >
          {content.address || "Адрес будет объявлен"}
        </DisplayHeading>
        {content.description && (
          <BodyText
            className={cn("mx-auto mt-4 max-w-lg", alternateDark && "text-(--color-background)/85")}
            font="display"
          >
            {content.description}
          </BodyText>
        )}
        {content.mapUrl && (
          <a
            href={content.mapUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "mt-6 inline-block text-sm underline underline-offset-4",
              alternateDark ? "text-(--color-background)" : "text-(--color-accent-text)",
            )}
          >
            Открыть на карте
          </a>
        )}
      </div>
    </Section>
  );
}
