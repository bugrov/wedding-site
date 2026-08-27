import { LandingThemeWrapper } from "@/components/landing/theme";
import { LandingHeader } from "@/components/landing/header";
import { LandingHero } from "@/components/landing/hero";
import { Configurator } from "@/components/landing/configurator";
import { LandingFooter } from "@/components/landing/footer";

// Public marketing/lead-intake page (see plan: "Публичный конфигуратор +
// приём заявок"). The "block with examples" from the plan's page structure
// is deliberately omitted for now — it needs 1-2 fully dressed demo sites
// (step 11, after all 5 templates exist), not the internal dev preview.
export default function LandingPage() {
  return (
    <LandingThemeWrapper>
      <LandingHeader />
      <LandingHero />
      <Configurator />
      <LandingFooter />
    </LandingThemeWrapper>
  );
}
