@AGENTS.md

# Project

Свадебный сайт-конструктор: лендинг → лид → админка (согласование/оплата) → публичный сайт на поддомене (`<slug>.<APP_BASE_DOMAIN>`, роутится через `proxy.ts`). Один и тот же `PageRenderer` рендерит блоки и в админ-редакторе, и в публичном конфигураторе, и на опубликованном сайте — разница только в `previewMode`.

## 1. Стек

- Next.js 16 (App Router, typed route props вида `LayoutProps<"/">`), React 19, TypeScript 5 (strict).
- Tailwind CSS v4, CSS-first конфиг (`@import "tailwindcss"` + `@theme inline` в `app/globals.css`) — **нет** `tailwind.config.js`.
- Prisma 7 с генератором `prisma-client` (не легаси `@prisma/client`) и `@prisma/adapter-pg`. Клиент импортируется из `@/app/generated/prisma/client`.
- TanStack Query v5, React Hook Form + Zod v4 (`@hookform/resolvers/zod`), `sonner` для тостов.
- `output: "standalone"` — self-host на своём VPS через Docker, не Vercel
  (см. §15 «Деплой на прод» — `git push` сюда не деплоит автоматически).

## 2. Архитектура проекта

Это **не** Feature-Sliced Design (нет слоёв `entities/features/widgets/shared`). Реальная структура:

- `app/` — роуты App Router: `admin/*` (панель), `client/[token]` (кабинет клиента по токену), `sites/[slug]` (опубликованный сайт), `api/*` (route handlers), `dev/*` (внутренние страницы для превью шаблонов).
- `components/templates/<template>/` — один шаблон = **набор рендереров** (`cover.tsx`, по одному файлу на каждый тип блока, `theme.tsx`, `decor.tsx`/`decor-assets.ts`), а не единый компонент страницы. Шаблон регистрируется в `lib/templates/registry.ts` и целиком описывается типом `TemplateDefinition` (`lib/templates/types.ts`).
- `components/primitives/` — общие строительные блоки (`Section`, `Eyebrow`, `DisplayHeading`, `AccentText`, `BodyText`, `PhotoGrid`, `DividerLine`, `DotDivider`, `BotanicalSprig`, `isRenderableUrl`). Шрифты в примитивах всегда идут через CSS-переменные (`--font-display`, `--font-accent`, `--font-body`), никогда не хардкодятся — так один и тот же JSX работает под любым шаблоном.
- `components/admin/`, `components/client/`, `components/editor/`, `components/blocks/`, `components/landing/` — компоненты соответствующих поверхностей.
- `components/page-renderer.tsx` — единственное место, которое превращает `blocksConfig` (включённые блоки + порядок + контент) в реальную страницу.
- `lib/blocks/schema.ts` — Zod-схемы контента блоков (`BLOCK_TYPES`, `*ContentSchema`, `blocksConfigSchema`), одинаковые для всех шаблонов — отличаются только рендереры.
- `lib/hooks/` — все клиентские запросы (мутации/queries) живут здесь как хуки, `lib/schemas/` — Zod-схемы форм, переиспользуемые и на клиенте, и на сервере.
- `lib/templates/`, `lib/theme/` — реестр шаблонов и работа с цветовыми токенами.

## 3. Next.js App Router

- Читай `node_modules/next/dist/docs/` перед новым Next.js кодом — версия ломает привычные API (см. `AGENTS.md`).
- `params`/`searchParams` — промисы, всегда `await`.
- Файл называется `proxy.ts`, а не `middleware.ts` (переименовано в этой версии Next). Proxy делает только rewrite по `Host`-заголовку, **без** обращения к БД — реальный `prisma`-запрос происходит в Server Component страницы (`app/sites/[slug]/page.tsx`), не в proxy.
- Дедупликация повторных Prisma-запросов в рамках одного запроса (например, между `generateMetadata` и самим компонентом страницы) — через `cache()` из `react`, потому что Next автоматически дедуплицирует только `fetch()`, а не произвольные Prisma-вызовы.
- Валидацию данных из БД перед рендером делай через `safeParse`, а не `parse` — невалидная запись должна деградировать (`notFound()`/фолбэк на дефолт), а не ронять страницу.

## 4. React / TypeScript

- Strict TypeScript, никакого `any` без крайней необходимости.
- Пропсы и состояние — именованные типы/интерфейсы, не инлайновые объекты на каждый компонент.
- `"use client"` — только там, где реально нужна интерактивность (формы, хуки состояния, обработчики событий). Всё остальное — Server Component по умолчанию.
- Общая бизнес-логика (валидация, сабмит) выносится в хук (`lib/hooks/`), UI-компонент/шаблон отвечает только за разметку — см. `useRsvpForm`, переиспользуемый всеми 5 шаблонами.

## 5. Tailwind

- Tailwind v4, CSS-first: конфигурация и токены — в `app/globals.css` через `@theme inline`, отдельного `tailwind.config.js` нет.
- Цвета шаблона — через CSS-переменные (`--color-primary`, `--color-accent`, `--color-background`, `--color-text`), а не хардкод хексов в JSX — это то, что позволяет одному и тому же блоку рендериться под любой темой/шаблоном.
- Условные и конфликтующие классы — только через `cn()` (`lib/utils.ts` = `twMerge(clsx(...))`), не через ручную конкатенацию строк.
- Курсор: `cursor-pointer` на всех интерактивных элементах (кнопки, ссылки, лейблы, чекбоксы/радио, `[role=button]`) уже задан глобально в `app/globals.css` — не переопределяй точечно без причины. Нативные `radio`/`checkbox` не должны сохранять браузерный вид по умолчанию — стилизуй руками.

## 6. Prisma

- Импорт клиента только из `@/app/generated/prisma/client`, никогда из `@prisma/client` напрямую.
- Driver adapter (`PrismaPg`) — не убирать при рефакторинге подключения.
- Сессии админа — в таблице `AdminSession` (БД-сессии, не JWT). Логаут = удаление строки, а не просто очистка cookie — сессия должна реально становиться недействительной.
- Видимость опубликованного сайта гейтится полем `publishedAt`, а не `status` — `status` может временно откатываться на "на согласовании" для правок уже после публикации, сайт при этом должен оставаться доступен гостям.

## 7. Server / Client Components

- По умолчанию — Server Component. `"use client"` ставится только в конкретном листовом компоненте, которому реально нужны хуки/события (формы, интерактивные виджеты), а не поднимается на верхний уровень страницы "на всякий случай".
- Данные (Prisma-запросы, `notFound()`, `generateMetadata`) — на сервере (`app/sites/[slug]/page.tsx` как пример). Клиентские компоненты получают уже провалидированные пропсы, а не сами дергают БД.
- Мутации из клиентских компонентов — только через хуки на TanStack Query (`lib/hooks/use-*-mutation.ts`), никогда голый `fetch` прямо в компоненте.

## 8. Типизация компонентов/пропсов/состояния

- Пропсы блока шаблона типизируются через `BlockProps<T extends BlockType>` (`lib/templates/types.ts`), обложка — через `CoverProps`. Не создавай параллельных ad hoc типов пропсов для новых блоков/шаблонов — используй существующие дженерики.
- `ProjectSummary` — сознательно урезанный тип (не весь Prisma `Project`): шаблоны не должны знать о форме БД, только о том, что им нужно для рендера.
- Формы — `useForm` из `react-hook-form` + `zodResolver`, тип значений формы выводится как `z.infer<typeof schema>`, не пишется руками отдельно.

## 9–10. UI/UX и визуальная концепция

- Направление — Pinterest-inspired editorial/wedding эстетика, у каждого шаблона свой чёткий референс-борд и характерная "фишка" (не универсальный дефолтный дизайн):
  - **Tuscany**, **Old Money** — чередование двух фоновых трактовок (крем/тёмный) между блоками.
  - **Editorial Ч-Б** — чёрно-белая редакционная эстетика.
  - **Pink Sketch** — рисованные акценты, фото в рамке с блюр-тенью и видимой тонкой границей.
  - **Moody Paper** — рваная бумага как реальная фотографированная текстура (не CSS clip-path), карточка на всю ширину блока, тёмный canvas как базовый фон страницы, бумага — только внутри карточек.
- Поиск фото/декоративных текстур — если задача требует найти новое изображение (текстура вроде рваной бумаги, фото и т.п.), сначала предложить несколько вариантов со ссылками на выбор и дождаться согласования, не выбирать и не встраивать самостоятельно.
- Цвета шаблона всегда прокидываются как `ColorTokens` (`primary`, `accent`, `background`, `text`) через `ThemeWrapper`, никогда не хардкодятся в отдельных блоках шаблона.
- Чередование фона блоков (`alternatingBlocks`/`alternateDark`) считается **динамически**, по позиции среди реально включённых блоков (`page-renderer.tsx`), а не хардкодится по типу блока — иначе выключение одного блока может оставить два блока одинакового цвета рядом.

## 11. Запреты / анти-паттерны

- Не делать голый `fetch`/мутацию прямо в компоненте — только через хук в `lib/hooks/`.
- Не хардкодить цвет/шрифт конкретного шаблона в общих примитивах или в другом шаблоне — только через CSS-переменные текущего шаблона.
- Не хардкодить чередование фона блоков по типу блока — только через `alternatingBlocks`/`alternateDark` по позиции среди включённых блоков.
- Не рисовать "рваный край"/декоративные текстуры через `clip-path` или другую CSS-имитацию, если рефборд подразумевает реальную фотографированную текстуру — искать/использовать настоящее изображение.
- Не поднимать `"use client"` выше, чем нужно — не превращать серверные страницы в клиентские целиком ради одного интерактивного элемента внутри.
- Не использовать `@prisma/client` напрямую — только сгенерированный путь `@/app/generated/prisma/client`.
- Не убирать/не переписывать блок `@AGENTS.md` в корневом `CLAUDE.md` — он перегенерируется `next dev`.
- Не коммитить крупный этап (новый шаблон, архитектурное изменение) без полного цикла `/feature-review` (`.claude/skills/feature-review` — код-ревью + статические проверки + визуальное QA в браузере на 3 брейкпоинтах + проверка кириллицы) и явного одобрения пользователя после отчёта — см. `## Project State`.

## 12. Использование существующих компонентов / design system

- Прежде чем писать новую разметку для блока — проверить `components/primitives/index.ts`: `Section`, `Eyebrow`, `DisplayHeading`, `AccentText`, `BodyText`, `PhotoGrid`, `DividerLine`, `DotDivider`, `BotanicalSprig`, `isRenderableUrl`.
- Новый шаблон реализует **все** рендереры блоков из `TemplateDefinition["blocks"]` (по одному на каждый `BlockType` из `lib/blocks/schema.ts`) — контент-схема одна на все шаблоны, отличается только визуальный рендер.
- Новый шаблон регистрируется в `lib/templates/registry.ts`.

## 13. Accessibility / responsive

- Интерактивные элементы — `min-h-11` (минимальная зона тапа), видимый `focus-visible` (например `has-focus-visible:ring-2`), лейблы у полей форм через `htmlFor`/`id`.
- Кастомные radio/checkbox — визуально скрывать нативный инпут (`sr-only`), но не убирать его из DOM/доступности.
- Декоративные изображения (текстуры, орнаменты) — `alt=""` + `aria-hidden`; контентные изображения — осмысленный `alt`.
- Вёрстка — mobile-first, брейкпоинты Tailwind (`sm`/`md`), декоративные full-bleed текстуры не должны ломать раскладку на узких экранах (см. приём "оверсайз + `overflow-hidden` + negative-translate" для полноширинных декоративных картинок).

## 14. Тестирование, линт, форматирование

- Тестраннер в проекте не настроен (нет jest/vitest/playwright) — не предполагать наличие тестов и не ссылаться на несуществующие test-команды.
- ESLint — flat config (`eslint.config.mjs`) на базе `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier`. Не линтить `app/generated/**`, `.next/**`, `.claude/**`.
- Prettier: 2 пробела, без табов, двойные кавычки, `;` обязательны, trailing comma везде, `printWidth: 100`.

## 15. Деплой на прод

**`git push` сюда НЕ деплоит ничего сам по себе.** Это не Vercel — репозиторий
приватный, на сервере нет git-клона и деплой-ключа, автодеплоя по вебхуку
нет. (Легко перепутать с другими проектами того же пользователя, где push в
`main` действительно триггерит автодеплой на Vercel — это НЕ тот случай.)
После `git push` прод остаётся на старом коде, пока не прогнан пайплайн ниже
руками.

- **Инфраструктура**: Selectel VPS `root@135.106.197.113` (Ubuntu 24.04),
  код на сервере лежит в `/opt/wedding-press` (обычная папка, не git-репо),
  `docker-compose.prod.yml` (не путать с локальным `docker-compose.yml`) —
  сервисы `db` + `app` + `caddy`, наружу торчит только Caddy (80/443).
- **Синк кода** — вручную через `tar` + `scp` + `ssh`, не `git pull`:

  ```bash
  # Из корня репозитория, локально:
  tar -czf /tmp/deploy.tar.gz \
    --exclude=node_modules --exclude=.next --exclude=.git \
    --exclude=.env --exclude=.env.local \
    --exclude=.claude --exclude=.agents --exclude=.windsurf \
    --exclude=app/generated .

  scp /tmp/deploy.tar.gz root@135.106.197.113:/tmp/deploy.tar.gz

  ssh root@135.106.197.113 \
    "cd /opt/wedding-press && tar -xzf /tmp/deploy.tar.gz && rm /tmp/deploy.tar.gz"
  ```

- **Пересборка и рестарт** — прод `.env` с реальными секретами (S3, Telegram,
  пароли БД) живёт только на сервере, не в репозитории:

  ```bash
  ssh root@135.106.197.113 \
    "cd /opt/wedding-press && set -a && source .env && set +a && \
     docker compose -f docker-compose.prod.yml build app"

  ssh root@135.106.197.113 \
    "cd /opt/wedding-press && set -a && source .env && set +a && \
     docker compose -f docker-compose.prod.yml up -d app"
  ```

  `db` и `caddy` обычно уже здоровы и не требуют пересборки — билд/рестарт
  нужен только сервису `app` для обычного деплоя кода.

- **Проверка после деплоя**: `docker compose -f docker-compose.prod.yml ps`
  на сервере (все три сервиса `Up`/`healthy`) и `curl` реального домена
  (`https://wedding-press.ru/...`, при необходимости с `-H "Host:
  <slug>.wedding-press.ru"` для конкретного опубликованного сайта).
- Одноразовые скрипты (сиды, миграции) гоняются так же через `ssh` +
  `docker compose exec app ...`, не через локальное подключение к проду.

## Project State

Перед началом крупной задачи — прочитать `.claude/project-state.md`. После завершения крупного этапа — обновить его.
