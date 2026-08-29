import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// Was a photo+text split with a bouquet accent photo — dropped per
// feedback ("как будто ни к чему"; the background-texture treatment on
// Schedule reads better than a side accent photo here). Centered text only.
// See story.tsx for how alternateDark works.
export function TuscanyDressCode({ content, alternateDark }: BlockProps<"dresscode">) {
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
        <BodyText
          className={cn("mx-auto mt-4 max-w-lg", alternateDark && "text-(--color-background)/90")}
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
