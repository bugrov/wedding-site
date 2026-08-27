import Image from "next/image";
import { Section, DisplayHeading, BodyText, AccentText } from "@/components/primitives";
import { BASE_PRICE_FALLBACK } from "@/lib/settings";

export function LandingHero() {
  return (
    <Section as="div" bleed="full" className="relative overflow-hidden py-0">
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
            Свадебный сайт за один вечер. Выберите стиль, добавьте фото и текст — мы опубликуем.
            Получите ссылку, которую не стыдно отправить гостям.
          </BodyText>
          <AccentText className="mt-8 block text-3xl text-amber-100 md:text-5xl">
            От {BASE_PRICE_FALLBACK.toLocaleString("ru-RU")} ₽
          </AccentText>
          <p className="mt-1 text-sm text-(--color-background)/70">
            Точная стоимость зависит от набора блоков
          </p>
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
