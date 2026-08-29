import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";
import type { BlockProps } from "@/lib/templates/types";
import { cn } from "@/lib/utils";

// See story.tsx for how alternateDark works. CTA button inverts (cream
// fill) when this block lands on the dark treatment, for contrast.
export function OldMoneyChat({ content, alternateDark }: BlockProps<"chat">) {
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
          Чат для гостей
        </Eyebrow>
        <DisplayHeading
          as="h2"
          className={cn("mt-3 text-3xl md:text-4xl", alternateDark && "text-(--color-background)")}
        >
          Общий чат
        </DisplayHeading>
        <BodyText
          className={cn("mx-auto mt-4 max-w-lg", alternateDark && "text-(--color-background)/85")}
          font="display"
        >
          {content.text}
        </BodyText>
        {content.link && (
          <a
            href={content.link}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "mt-6 inline-block border px-6 py-3 text-sm font-medium transition",
              alternateDark
                ? "border-(--color-background) bg-(--color-background) text-(--color-primary) hover:opacity-90"
                : "border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-background)",
            )}
          >
            Перейти в чат
          </a>
        )}
      </div>
    </Section>
  );
}
