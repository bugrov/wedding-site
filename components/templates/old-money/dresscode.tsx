import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// See story.tsx for how alternateDark works.
export function OldMoneyDressCode({ content, alternateDark }: BlockProps<"dresscode">) {
  return (
    <Section
      bleed={alternateDark ? "full" : "contained"}
      className={cn(
        "text-center",
        alternateDark && "bg-(--color-primary) text-(--color-background)",
      )}
    >
      <div className={cn(alternateDark && "mx-auto max-w-5xl px-6")}>
        <Eyebrow className={cn(alternateDark && "text-(--color-background)/70")}>Дресс-код</Eyebrow>
        <DisplayHeading
          as="h2"
          className={cn("mt-3 text-3xl md:text-4xl", alternateDark && "text-(--color-background)")}
        >
          Стиль вечера
        </DisplayHeading>
        <div
          className={cn(
            "mx-auto mt-4 h-px w-10",
            alternateDark ? "bg-(--color-background)/40" : "bg-(--color-accent)",
          )}
        />
        <BodyText
          className={cn("mx-auto mt-6 max-w-lg", alternateDark && "text-(--color-background)/85")}
          font="display"
        >
          {content.text}
        </BodyText>
        {content.palette && content.palette.length > 0 && (
          <div className="mt-6 flex justify-center gap-3">
            {content.palette.map((color, i) => (
              <span
                key={i}
                className="h-8 w-8 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
