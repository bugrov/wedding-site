import Image from "next/image";
import { Section, DisplayHeading, BodyText } from "@/components/primitives";
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
          {/* "Glass" card, not italic AccentText — same display font as the
              couple's names on Cover, per feedback. Flat price, no "от" and
              no block-count caveat: deliberately one fixed number now. */}
          <div className="mt-8 inline-block rounded-2xl border border-white/25 bg-white/10 px-8 py-4 shadow-lg backdrop-blur-md">
            <p
              className="text-4xl leading-tight font-normal text-(--color-background) md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {BASE_PRICE_FALLBACK.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <a
            href="#configurator"
            className="mt-8 inline-block rounded-full bg-(--color-background) px-6 py-3 text-sm font-medium text-(--color-primary) transition hover:opacity-90"
          >
            Оставить заявку
          </a>
        </div>
      </div>
    </Section>
  );
}
