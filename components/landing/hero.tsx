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
          {/* One card, price on top and the CTA directly under it — the
              send-invite.online reference groups price + button into a
              single unit rather than two floating elements side by side
              (see feedback). Same parchment-card language as the calendar
              widget (see Tuscany's WeddingCalendar): --color-accent-text is
              tuned for contrast against a light background, not the dark
              photo behind the hero, so the price needed a light card under
              it to read clearly. */}
          <div className="relative mx-auto mt-8 w-full max-w-[280px] rounded-2xl bg-(--color-background) px-8 py-6 shadow-xl">
            <BotanicalSprig className="absolute -top-3 -right-2 h-8 w-5 rotate-[20deg] text-(--color-accent)/60" />
            <p className="text-xs tracking-[0.2em] text-(--color-text)/50 uppercase">
              Стоимость сайта
            </p>
            <p
              className="mt-1 text-4xl leading-tight font-normal text-(--color-accent-text) md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {BASE_PRICE_FALLBACK.toLocaleString("ru-RU")} ₽
            </p>
            <a
              href="#configurator"
              className="mt-5 block rounded-full bg-(--color-primary) px-6 py-3 text-center text-sm font-medium text-(--color-background) transition hover:opacity-90"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
