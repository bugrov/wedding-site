import Image from "next/image";
import { Section, DisplayHeading, BodyText, BotanicalSprig } from "@/components/primitives";
import { BASE_PRICE_FALLBACK } from "@/lib/settings";

export function LandingHero() {
  return (
    <Section as="div" bleed="full" className="relative overflow-hidden py-0 md:py-0">
      <div className="relative flex min-h-[640px] items-center justify-center px-6 py-24 text-center md:min-h-[720px]">
        {/* Self-hosted (public/images), not hotlinked — see public/images/CREDITS.md. */}
        <Image
          src="/images/hero-couple.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div className="relative max-w-2xl">
          <DisplayHeading className="text-(--color-background)">
            Свадьба начинается здесь
          </DisplayHeading>
          <BodyText className="mx-auto mt-6 max-w-xl text-lg text-(--color-background)/90">
            Свадебный сайт в эстетике Pinterest — за один вечер. Выберите стиль, добавьте фото и
            текст — мы опубликуем. Получите ссылку, которую не стыдно отправить гостям.
          </BodyText>
          {/* Price and CTA in one flex row with an explicit gap — as two
              separate inline-block elements they had no guaranteed spacing
              and could sit flush against each other (see feedback: "слиплась
              кнопка"). Wrapping instead of forcing one line keeps this from
              cramping on narrow screens. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            {/* Same parchment-card language as the calendar widget (see
                Tuscany's WeddingCalendar) instead of a glass-on-dark card —
                --color-accent-text is tuned for contrast against a light
                background, not a dark photo, so the price needed a light
                card under it to stay readable in that color. */}
            <div className="relative rounded-2xl bg-(--color-background) px-8 py-4 shadow-xl">
              <BotanicalSprig className="absolute -top-3 -right-2 h-8 w-5 rotate-[20deg] text-(--color-accent)/60" />
              <p
                className="text-4xl leading-tight font-normal text-(--color-accent-text) md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {BASE_PRICE_FALLBACK.toLocaleString("ru-RU")} ₽
              </p>
            </div>
            <a
              href="#configurator"
              className="inline-block rounded-full bg-(--color-background) px-6 py-3 text-sm font-medium text-(--color-primary) transition hover:opacity-90"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
