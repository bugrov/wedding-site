import { Section, DisplayHeading, BodyText } from "@/components/primitives";
import { BASE_PRICE_FALLBACK } from "@/lib/settings";

export function LandingHero() {
  return (
    <Section as="div" bleed="contained" className="pt-20 pb-16 text-center md:pt-28 md:pb-24">
      <DisplayHeading>Сайт-приглашение на вашу свадьбу</DisplayHeading>
      <BodyText className="mx-auto mt-6 max-w-xl text-lg">
        Редакционный дизайн вместо шаблонной открытки: таймер до свадьбы, программа дня, RSVP от
        гостей и всё остальное — на отдельном сайте с вашим именем в адресе.
      </BodyText>
      <p className="mt-6 text-sm text-(--color-text)/70">
        От {BASE_PRICE_FALLBACK.toLocaleString("ru-RU")} ₽ — точная стоимость зависит от набора
        блоков
      </p>
      <a
        href="#configurator"
        className="mt-8 inline-block rounded-full bg-(--color-primary) px-6 py-3 text-sm font-medium text-(--color-background) transition hover:opacity-90"
      >
        Оставить заявку
      </a>
    </Section>
  );
}
