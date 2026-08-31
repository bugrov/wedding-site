// Template-level decorative stock photography for Tuscany — approved via the
// plan's asset process (3-5 candidates presented, user picked these). Shared
// across every client site using this template, unlike client-uploaded
// content photos (Cover/Story/Gallery), which always come from the project.
//
// Named constants, not inline strings in the block markup — when
// Theme.decorOverride gets wired up (admin theme editor, step 6), each of
// these becomes a `theme.decorOverride?.<key> ?? DEFAULT` fallback instead of
// a rewrite.
//
// Originally hotlinked straight from Pexels — moved to our own Object
// Storage after Pexels/Cloudflare started returning 404 to this VPS's IP
// range specifically (same class of issue as the Telegram API block, not a
// code bug: the identical URL 200s from other networks). A plain literal,
// not built from S3_PUBLIC_URL: these are permanent, single-bucket assets,
// not per-environment like user uploads.
export const TUSCANY_DECOR = {
  /** Timer section background — wedding table with olive branches + candles. */
  timerBackground:
    "https://fe87d3c5-44cb-4722-9177-bada90e1ae91.selstorage.ru/photos/7e9f0493-6196-45d7-b871-e66a23edcc22.jpg",
  /** Schedule section background — rustic table setting, gold cutlery, olive
   * sprig (picked over a "rings on olive branch" alternative after comparing
   * both live). */
  scheduleBackground:
    "https://fe87d3c5-44cb-4722-9177-bada90e1ae91.selstorage.ru/photos/885c47f1-70ed-475b-842e-351f6509338b.jpg",
} as const;
