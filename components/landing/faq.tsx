import { Plus } from "lucide-react";
import { Section, Eyebrow, DisplayHeading, BodyText } from "@/components/primitives";

// Same env var proxy.ts/lib/site-url.ts key off — the real domain isn't
// bought yet, so this falls back to a placeholder until APP_BASE_DOMAIN is set.
const EXAMPLE_SLUG = "maria-ivan-2026";
const DOMAIN_EXAMPLE = `${EXAMPLE_SLUG}.${process.env.APP_BASE_DOMAIN ?? "домен.ru"}`;

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "У вас есть конструктор сайта?",
    answer:
      "Да. Вы сами выбираете шаблон и включаете нужные блоки — таймер, историю пары, программу дня, место проведения, дресс-код, галерею, пожелания и подарки, общий чат, RSVP — и сразу видите результат, без ожидания вёрстальщика.",
  },
  {
    question: "Какой адрес будет у сайта?",
    answer: `Например: ${DOMAIN_EXAMPLE} — адрес складывается из имён и года. По согласованию с оператором часть до точки («${EXAMPLE_SLUG}») можно немного изменить, но доменная часть после точки общая для всех сайтов на платформе и не меняется.`,
  },
  {
    question: "Можно ли подключить свой домен?",
    answer: "Пока нет — эта функция в ближайших планах.",
  },
  {
    question: "Срок изготовления сайта?",
    answer: "Обычно один день. Если нужны дополнительные доработки — до двух дней.",
  },
  {
    question: "Порядок оплаты?",
    answer:
      "Оплата производится напрямую оператору — он свяжется с вами лично после оформления заявки. Оплата картой онлайн (через Робокассу) — в ближайших планах.",
  },
  {
    question: "Можно ли изменить информацию на сайте после оплаты?",
    answer:
      "Да, можно менять что угодно: текст в любом блоке, фотографии, музыку, настройки RSVP-опроса, включать и выключать блоки (программу дня, дресс-код, галерею, пожелания и подарки, общий чат и другие). Просто напишите оператору.",
  },
  {
    question: "Приглашение адаптировано для отображения на мобильных устройствах?",
    answer: "Да, сайт полностью адаптирован: корректно выглядит на телефоне, планшете и компьютере.",
  },
  {
    question: "Что такое RSVP-форма?",
    answer:
      "Анкета для гостей: подтверждение присутствия, выбор блюд и напитков, +1, комментарий — вопросы настраиваются под вас. Ответы гостей сразу видны в личном кабинете и приходят уведомлением в Telegram.",
  },
  {
    question: "Можно ли изменить музыку на сайте?",
    answer: "Да, можно включить фоновую музыку и указать свой трек.",
  },
  {
    question: "Смогут ли попасть на сайт люди, которые не имеют к нему отношения?",
    answer:
      "Нет: сайт не индексируется поисковыми системами и открывается только по прямой ссылке, которую вы сами передаёте гостям.",
  },
  {
    question: "Как долго будет работать сайт?",
    answer: "Сайт остаётся доступен без ограничения по времени — мы не отключаем его автоматически после свадьбы.",
  },
];

// Native <details>/<summary> — full keyboard/screen-reader support for free,
// no "use client" needed just to toggle an open/closed panel.
export function Faq() {
  return (
    <Section id="faq" bleed="contained" className="border-t border-black/10">
      <div className="text-center">
        <Eyebrow>Вопросы и ответы</Eyebrow>
        <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
          Если коротко
        </DisplayHeading>
      </div>
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-black/10">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group py-5">
            <summary
              className="flex min-h-11 list-none items-center justify-between gap-4 rounded-sm font-medium text-(--color-text) cursor-pointer has-focus-visible:ring-2 has-focus-visible:ring-(--color-primary) has-focus-visible:outline-none [&::-webkit-details-marker]:hidden"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span>{item.question}</span>
              <Plus
                className="h-5 w-5 shrink-0 text-(--color-primary) transition-transform duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <BodyText className="mt-3 text-(--color-text)/70">{item.answer}</BodyText>
          </details>
        ))}
      </div>
    </Section>
  );
}
