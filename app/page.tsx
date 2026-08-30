import type { Metadata } from "next";
import { LandingThemeWrapper } from "@/components/landing/theme";
import { LandingHeader } from "@/components/landing/header";
import { LandingHero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Examples } from "@/components/landing/examples";
import { Configurator } from "@/components/landing/configurator";
import { Faq } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Wedding Press — сайты-приглашения на свадьбу",
  description:
    "Свадебный сайт за один вечер: выберите стиль, добавьте фото и текст — мы опубликуем.",
};

// Public marketing/lead-intake page (see plan: "Публичный конфигуратор +
// приём заявок").
export default function LandingPage() {
  return (
    <LandingThemeWrapper>
      <LandingHeader />
      <LandingHero />
      <HowItWorks />
      <Examples />
      <Configurator />
      <Faq />
      <LandingFooter />
    </LandingThemeWrapper>
  );
}
