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
| `scripts/backup-db.sh`                                  | Снять и залить бэкап БД (на сервере — тот же крон каждую ночь, см. «Бэкапы»)                                                                                                                 |
| `scripts/restore-db.sh <timestamp>`                     | Восстановить БД из бэкапа (на сервере, необратимо, см. «Бэкапы»)                                                                                                                              |

## Деплой

Прод — VPS (Selectel, Ubuntu 24.04), Docker Compose. Продовая сборка — `Dockerfile`
(multi-stage, копирует `.next/standalone` + `.next/static` + `public`; `prisma generate`
резолвит `DATABASE_URL` уже на этапе сборки, поэтому нужен `ARG DATABASE_URL`, даже
несмотря на то что `.env` в `.dockerignore`). `docker-compose.prod.yml` (не тот, что для
локальной прод-сборки, — отдельный файл) поднимает `db` + `app` + `caddy`: наружу торчит
только Caddy (80/443), `db`/`app` доступны только во внутренней docker-сети. `Caddyfile`
сам получает и продлевает сертификаты Let's Encrypt — для основного домена сразу, для
`<slug>.<домен>` по требованию (on-demand TLS, проверка легитимности имени —
`/api/caddy-ask`). Код на сервер попадает не через `git clone`, а через `tar`/`ssh` в
`/opt/wedding-press`; реальный `.env` с секретами существует только на сервере.

## Бэкапы

`scripts/backup-db.sh` — крон на самом VPS (не в приложении: контейнер `app`
пересобирается при каждом деплое, а крону нужно жить постоянно):

```
0 3 * * * /opt/wedding-press/scripts/backup-db.sh >> /var/log/wedding-backup.log 2>&1
```

Каждую ночь скрипт снимает `pg_dump` из контейнера `db`, сжимает gzip'ом и заливает в
Object Storage (Selectel S3) через `aws-cli`, затем удаляет бэкапы старше 30 дней.

**Бэкапы лежат в отдельном приватном бакете** (`S3_BACKUP_BUCKET`, сейчас
`wedding-press-backups`) — **никогда** не в одном бакете с публичными фото/музыкой
(`S3_BUCKET`). У Selectel «публичность» — это свойство всего бакета целиком, а не ACL
конкретного объекта: файл, залитый с `--acl private` в публичный бакет, всё равно
публично читается через доменный домен бакета (`selstorage.ru`). Единственный надёжный
способ держать бэкапы (пароли, RSVP гостей) в приватности — отдельный бакет с доступом
"Приватный".

На VPS для `aws-cli` нужны те же S3-ключи, что и в `.env` (`~/.aws/credentials`), плюс
`AWS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt` в скриптах — собственный бандл
сертификатов `aws-cli` не доверяет цепочке, по которой выпущен сертификат Selectel
(системный бандл — доверяет).

**Восстановление** — `scripts/restore-db.sh <timestamp>`, например:

```bash
./scripts/restore-db.sh 2026-08-31_03-00
```

Скрипт скачивает архив из бакета и накатывает его через `psql` прямо в контейнер `db` —
**необратимо заменяет все текущие данные**, 5-секундная пауза перед стартом даёт время
отменить (`Ctrl+C`). Список доступных бэкапов:

```bash
aws s3 ls s3://wedding-press-backups/ --endpoint-url https://s3.ru-6.storage.selcloud.ru
```

## Документация

- **`CLAUDE.md`** / **`AGENTS.md`** — правила и архитектурные соглашения для работы с кодом
  (в первую очередь для AI-ассистента, но актуальны и для человека).
- **`.claude/project-state.md`** — текущее состояние: что сделано, что в работе, какие
  решения приняты и почему. Читать перед началом крупной задачи.
