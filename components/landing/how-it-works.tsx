import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";

const STEPS = [
  {
    title: "Выберите шаблон и блоки",
    description: "Прямо на этой странице — сразу видно, как будет выглядеть сайт.",
  },
  {
    title: "Укажите главное",
    description: "Имена, дату, немного текста и фото — детали доработаем вместе позже.",
  },
  {
    title: "Мы соберём сайт",
    description: "На основе заявки готовим настоящий сайт под ключ.",
  },
  {
    title: "Согласуем детали",
    description: "Присылаем ссылку на предпросмотр и вносим правки, пока всё не понравится.",
  },
  {
    title: "Оплата и готово",
    description: "После оплаты — финальная ссылка на сайт, которую можно отправлять гостям.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" bleed="contained" className="border-t border-black/10">
      <div className="text-center">
        <Eyebrow>Как это работает</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          От идеи до ссылки
        </DisplayHeading>
      </div>
      <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="text-center">
            <span
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-sm font-semibold text-(--color-background)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {i + 1}
            </span>
            <p className="mt-4 font-medium">{step.title}</p>
            <BodyText className="mt-1 text-sm text-(--color-text)/70">{step.description}</BodyText>
          </li>
        ))}
      </ol>
    </Section>
  );
}
