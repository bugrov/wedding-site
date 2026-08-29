import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// See story.tsx for how alternateDark works.
export function OldMoneyWishes({ content, alternateDark }: BlockProps<"wishes">) {
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
          Пожелания и подарки
        </Eyebrow>
        <DisplayHeading
          as="h2"
          className={cn("mt-3 text-3xl md:text-4xl", alternateDark && "text-(--color-background)")}
        >
          От всего сердца
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
        {content.items && content.items.length > 0 && (
          <ul className="mx-auto mt-6 max-w-md list-none space-y-2">
            {content.items.map((item, i) => (
              <li key={i}>
                <BodyText
                  font="display"
                  className={cn(alternateDark && "text-(--color-background)")}
                >
                  {item}
                </BodyText>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
