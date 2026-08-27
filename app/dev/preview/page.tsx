import {
  Section,
  DisplayHeading,
  AccentText,
  BodyText,
  Eyebrow,
  PhotoGrid,
  DividerLine,
  DotDivider,
  BotanicalSprig,
} from "@/components/primitives";
import { colorTokensToCssVars } from "@/lib/theme/tokens";

// Internal style-guide page — not linked from anywhere public. Lets us
// sanity-check the shared primitives with sample data before any real
// template exists (step 3), and again whenever a primitive changes.
export default function PrimitivesPreviewPage() {
  const sampleTokens = colorTokensToCssVars({
    primary: "#4B5320",
    accent: "#9C6B30",
    background: "#F6F2EA",
    text: "#2B2620",
  });

  return (
    <main
      style={{
        ...sampleTokens,
        // Generic fallbacks — real per-template Google Fonts arrive in step 3.
        ["--font-display" as string]: "Georgia, serif",
        ["--font-accent" as string]: "Georgia, serif",
        ["--font-body" as string]: "system-ui, sans-serif",
        backgroundColor: "var(--color-background)",
      }}
    >
      <Section bleed="contained">
        <Eyebrow>Превью примитивов</Eyebrow>
        <DisplayHeading className="mt-2">Иван &amp; Мария</DisplayHeading>
        <AccentText className="mt-2 block">мы женимся</AccentText>
        <DividerLine className="my-6" />
        <BodyText>
          Это тестовая страница дизайн-системы: типографика, декор и фото-сетки без привязки к
          конкретному шаблону — проверяем, что примитивы работают, прежде чем собирать на них первый
          реальный шаблон.
        </BodyText>
        <DotDivider className="my-6" />
        <BotanicalSprig />
      </Section>

      <Section bleed="full" className="bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <Eyebrow>PhotoGrid — hero</Eyebrow>
          <PhotoGrid className="mt-4" variant="hero" photos={[]} />
        </div>
      </Section>

      <Section bleed="contained">
        <Eyebrow>PhotoGrid — collage-2</Eyebrow>
        <PhotoGrid className="mt-4" variant="collage-2" photos={[]} />
      </Section>

      <Section bleed="contained">
        <Eyebrow>PhotoGrid — collage-3 (асимметричный)</Eyebrow>
        <PhotoGrid className="mt-4" variant="collage-3" photos={[]} />
      </Section>

      <Section bleed="contained">
        <Eyebrow>PhotoGrid — collage-4</Eyebrow>
        <PhotoGrid className="mt-4" variant="collage-4" photos={[]} />
      </Section>
    </main>
  );
}
