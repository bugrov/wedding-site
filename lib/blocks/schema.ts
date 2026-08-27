import { z } from "zod";

// z.string().url() alone accepts any scheme, including "javascript:" — fine
// while only the operator filled these in, but these URL fields (mapUrl,
// musicUrl, photoUrl) are now reachable directly from the public
// configurator, and mapUrl/photoUrl get rendered as href/src. Restrict to
// http(s) explicitly (see api-security-hardening audit finding).
const httpUrlSchema = z
  .string()
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Ссылка должна начинаться с http(s)",
  )
  .refine((value) => {
    if (value === "") return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Некорректная ссылка");

// The 9 blocks from the plan, minus "Обложка" (Cover) — Cover is mandatory
// and not part of the toggleable/reorderable list (it's the project's root,
// not a block in the ordinary sense). Order here is the default sequence;
// admin/configurator UIs let the operator drag-reorder within it.
export const BLOCK_TYPES = [
  "timer",
  "story",
  "schedule",
  "venue",
  "dresscode",
  "gallery",
  "wishes",
  "rsvp",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_LABELS: Record<BlockType, string> = {
  timer: "Таймер",
  story: "О нас",
  schedule: "Программа дня",
  venue: "Место проведения",
  dresscode: "Дресс-код",
  gallery: "Галерея",
  wishes: "Пожелания и подарки",
  rsvp: "RSVP-форма",
};

export const DEFAULT_BLOCK_ORDER: BlockType[] = [...BLOCK_TYPES];

// --- Per-block content schemas -------------------------------------------
// Plain textareas only (no rich text) — see plan: keeps typography under the
// template's control instead of letting free-form formatting break it.

export const coverContentSchema = z.object({
  tagline: z.string().max(120, "Слишком длинный текст").optional(),
  photoUrl: httpUrlSchema.optional(),
});

export type CoverContent = z.infer<typeof coverContentSchema>;

export const timerContentSchema = z.object({});

export const storyContentSchema = z.object({
  text: z.string().min(1, "Добавьте текст истории").max(4000, "Слишком длинный текст"),
  photoUrl: httpUrlSchema.optional(),
});

export const scheduleItemSchema = z.object({
  time: z.string().min(1, "Укажите время"),
  title: z.string().min(1, "Укажите название"),
  description: z.string().max(500, "Слишком длинный текст").optional(),
});

export const scheduleContentSchema = z.object({
  items: z.array(scheduleItemSchema).min(1, "Добавьте хотя бы один пункт программы"),
});

export const venueContentSchema = z.object({
  // Not required at the storage layer: the venue renderer already falls
  // back to "Адрес будет объявлен" for an empty address (a real project can
  // exist before the venue is finalized). The admin edit form is the right
  // place to nudge "fill this in before publishing", not this schema.
  address: z.string(),
  mapUrl: httpUrlSchema.optional(),
  description: z.string().max(1000, "Слишком длинный текст").optional(),
});

export const dressCodeContentSchema = z.object({
  text: z.string().min(1, "Добавьте описание дресс-кода").max(1000, "Слишком длинный текст"),
  palette: z.array(z.string()).max(8, "Не более 8 цветов").optional(),
});

export const galleryContentSchema = z.object({
  photos: z.array(httpUrlSchema).max(20, "Не более 20 фото").default([]),
});

export const wishesContentSchema = z.object({
  text: z.string().min(1, "Добавьте текст").max(2000, "Слишком длинный текст"),
  items: z.array(z.string()).max(20, "Не более 20 пунктов").optional(),
});

export const rsvpContentSchema = z.object({
  askFood: z.boolean().default(true),
  askPlusOne: z.boolean().default(true),
  askComment: z.boolean().default(true),
});

export const blockContentSchemas = {
  timer: timerContentSchema,
  story: storyContentSchema,
  schedule: scheduleContentSchema,
  venue: venueContentSchema,
  dresscode: dressCodeContentSchema,
  gallery: galleryContentSchema,
  wishes: wishesContentSchema,
  rsvp: rsvpContentSchema,
} as const;

export type BlockContent<T extends BlockType> = z.infer<(typeof blockContentSchemas)[T]>;

// Seed content so a newly-enabled block isn't blank — always editable
// per-project afterwards, never a hardcoded constant shown to guests as-is.
export const DEFAULT_BLOCK_CONTENT: { [K in BlockType]: BlockContent<K> } = {
  timer: {},
  story: {
    text: "Мы познакомились совершенно случайно, а теперь готовимся к самому важному дню в нашей жизни. Расскажите гостям вашу историю здесь.",
  },
  schedule: {
    items: [
      { time: "15:00", title: "Сбор гостей" },
      { time: "16:00", title: "Церемония" },
      { time: "18:00", title: "Банкет" },
    ],
  },
  venue: { address: "" },
  dresscode: {
    text: "Просим гостей придерживаться элегантного стиля в спокойных тонах.",
  },
  gallery: { photos: [] },
  wishes: {
    text: "Ваше присутствие — главный подарок для нас. Но если хотите порадовать чем-то ещё, будем благодарны конвертам с добрыми пожеланиями.",
  },
  rsvp: { askFood: true, askPlusOne: true, askComment: true },
};

// --- Cross-cutting features (not a position in the page, just a toggle) --

export const blockFeaturesSchema = z.object({
  music: z.boolean().default(false),
  // Deliberately not httpUrlSchema: this doubles as "just tell us the track
  // name, we'll find the real file" at the lead stage (see UI label) — it's
  // only ever used as an <audio src>, not a clickable/navigable href, so a
  // non-URL value here can't do anything worse than fail to play.
  musicUrl: z.string().max(200, "Слишком длинный текст").optional(),
  qrCode: z.boolean().default(true),
  personalizedLinks: z.boolean().default(false),
});

export type BlockFeatures = z.infer<typeof blockFeaturesSchema>;

export const DEFAULT_BLOCK_FEATURES: BlockFeatures = {
  music: false,
  qrCode: true,
  personalizedLinks: false,
};

// --- Overall blocksConfig JSON shape (stored on Lead/Project) ------------

export const blocksConfigSchema = z.object({
  enabledBlocks: z.array(z.enum(BLOCK_TYPES)),
  order: z.array(z.enum(BLOCK_TYPES)),
  cover: coverContentSchema.default({}),
  content: z
    .object({
      timer: timerContentSchema.optional(),
      story: storyContentSchema.optional(),
      schedule: scheduleContentSchema.optional(),
      venue: venueContentSchema.optional(),
      dresscode: dressCodeContentSchema.optional(),
      gallery: galleryContentSchema.optional(),
      wishes: wishesContentSchema.optional(),
      rsvp: rsvpContentSchema.optional(),
    })
    .default({}),
  features: blockFeaturesSchema.default({ music: false, qrCode: true, personalizedLinks: false }),
});

export type BlocksConfig = z.infer<typeof blocksConfigSchema>;

export function createDefaultBlocksConfig(
  enabledBlocks: BlockType[] = [...BLOCK_TYPES],
): BlocksConfig {
  const content = Object.fromEntries(
    enabledBlocks.map((type) => [type, DEFAULT_BLOCK_CONTENT[type]]),
  ) as BlocksConfig["content"];

  return {
    enabledBlocks,
    order: DEFAULT_BLOCK_ORDER.filter((type) => enabledBlocks.includes(type)),
    cover: {},
    content,
    features: DEFAULT_BLOCK_FEATURES,
  };
}
