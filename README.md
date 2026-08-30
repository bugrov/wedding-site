# Wedding Press

Свадебный сайт-конструктор: лендинг с лид-формой → админка (согласование и оплата) →
публичный сайт-приглашение на поддомене (`<slug>.<домен>`). Один оператор ведёт заявки
вручную; пара получает готовый сайт с RSVP-формой и личный кабинет со списком гостей.

## Стек

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript 5** (strict)
- **Tailwind CSS v4** — CSS-first конфиг в `app/globals.css`, без `tailwind.config.js`
- **Prisma 7** (`prisma-client` generator, `@prisma/adapter-pg`) + PostgreSQL
- **TanStack Query**, **React Hook Form + Zod**, **sonner**
- `output: "standalone"` — self-host на своём VPS через Docker, не Vercel

## Быстрый старт

```bash
npm install
docker compose up -d db          # поднимает Postgres на localhost:5433
cp .env.example .env             # заполнить DATABASE_URL/TELEGRAM_*/APP_BASE_DOMAIN
npx prisma migrate dev           # применить миграции
npm run admin:set-password       # создать первого администратора
npm run dev                      # http://localhost:3000
```

Локальные поддомены (`<slug>.lvh.me:3000`) резолвятся сами — `lvh.me` публично указывает
на `127.0.0.1`, ничего в `/etc/hosts` править не нужно. Опционально:

```bash
npm run seed:demos   # 5 живых демо-сайтов (по одному на шаблон), см. prisma/seed-demos.ts
```

## Как это устроено

**Путь одной свадьбы:** гость лендинга оставляет заявку (`Lead`) → оператор в админке
превращает её в проект (`Project`), дорабатывает контент и вручную отмечает статус (включая
оплату — сейчас без интеграции с платёжным шлюзом) → отдельным действием публикует сайт на
`<slug>.<домен>` (публикация не привязана к статусу автоматически) → гости отвечают через
RSVP-форму → пара следит за списком в личном кабинете по токену (`/client/[token]`, без
пароля — сама ссылка и есть доступ).

**Один рендерер, пять шаблонов.** `components/page-renderer.tsx` — единственное место,
которое превращает `blocksConfig` (какие блоки включены, в каком порядке, с каким контентом)
в реальную страницу. Он используется одинаково в админ-редакторе, в публичном
конфигураторе на лендинге и на опубликованном сайте — разница только в `previewMode`.
Каждый шаблон (`components/templates/<template>/`) — это набор рендереров, по одному на
каждый тип блока из `lib/blocks/schema.ts`, плюс своя тема и декор; контент-схема у всех
шаблонов общая, отличается только визуальное исполнение. Шаблон регистрируется в
`lib/templates/registry.ts`.

**Цвета и шрифты — только через переменные.** Палитра шаблона (`--color-primary`,
`--color-accent`, `--color-background`, `--color-text`) приходит через `ThemeWrapper`
каждого шаблона, шрифты — через `--font-display`/`--font-accent`/`--font-body`. Общие
примитивы (`components/primitives/`: `Section`, `DisplayHeading`, `PhotoGrid` и т.д.)
никогда не хардкодят цвет/шрифт конкретного шаблона — этим одна и та же вёрстка работает
под любой темой.

**Поддомены** — `proxy.ts` (не `middleware.ts`, переименовано в Next 16) по Host-заголовку
переписывает `<slug>.<домен>` в `/sites/<slug>`, не трогая базу — реальный запрос к Prisma
происходит уже в самой странице (`app/sites/[slug]/page.tsx`). Опубликованность гейтится
полем `publishedAt`, а не `status`: `status` может временно откатиться на «на согласовании»
для правок уже после публикации, сайт при этом остаётся доступен гостям.

## Структура проекта

```
app/            роуты App Router: admin/*, client/[token], sites/[slug], api/*, dev/*
components/     admin/, client/, editor/, landing/ — компоненты соответствующих поверхностей
                primitives/ — общие строительные блоки; templates/<template>/ — сами шаблоны
lib/            blocks/ (Zod-схемы контента), templates/ (реестр), theme/, hooks/, schemas/,
                auth/, telegram/, db/
prisma/         schema.prisma, migrations/, seed.ts (админ), seed-demos.ts (демо-сайты)
```

## Частые команды

| Команда                                                 | Что делает                                                                                                                                                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                           | Дев-сервер (Turbopack)                                                                                                                                                                       |
| `npm run build`                                         | Прод-сборка (`output: standalone`)                                                                                                                                                           |
| `docker compose up -d --build app`                      | Собрать и запустить прод-версию (`npm run start`/`next start` **не** обслуживает `output: standalone` корректно — нужен именно `node .next/standalone/server.js`, это и делает `Dockerfile`) |
| `npm run lint` / `npm run format` / `npm run typecheck` | ESLint / Prettier / `tsc --noEmit`                                                                                                                                                           |
| `npm run admin:set-password`                            | Создать/сбросить пароль администратора                                                                                                                                                       |
| `npm run seed:demos`                                    | Пересоздать 5 демо-сайтов на живых поддоменах                                                                                                                                                |

## Деплой

Продовая сборка — `Dockerfile` (multi-stage, копирует `.next/standalone` + `.next/static` +
`public`) и `docker-compose.yml` (сервисы `db` + `app`). Перед реальным доменом на VPS
дополнительно нужен reverse proxy с wildcard-сертификатом на `*.<домен>` — подробности пока
не задокументированы, обсуждаются отдельно.

## Документация

- **`CLAUDE.md`** / **`AGENTS.md`** — правила и архитектурные соглашения для работы с кодом
  (в первую очередь для AI-ассистента, но актуальны и для человека).
- **`.claude/project-state.md`** — текущее состояние: что сделано, что в работе, какие
  решения приняты и почему. Читать перед началом крупной задачи.
