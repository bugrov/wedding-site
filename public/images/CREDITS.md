# Landing page hero photo

`hero-couple.jpg` — photo by Hisu lee on Unsplash
(https://unsplash.com/photos/grayscale-shot-of-bride-and-groom-FTW8ADj5igs).

Unsplash License — free for commercial use, no attribution required.
Self-hosted (not hotlinked) so it can't go missing later. Kept here for
reference/traceability only.

# Demo-previews directory

`demo-previews/*.jpg` — our own screenshots of each template's live demo
site (see `prisma/seed-demos.ts`), used as the swatch thumbnails in
`components/landing/examples.tsx`. Not third-party stock — captured directly
from the app. Point-in-time captures: re-shoot and replace if a template's
cover design or the demo content changes.

# film/ directory (Editorial Ч-Б template)

Real scanned-film texture photos backing the "vintage film texture" redesign
of the Editorial Ч-Б template (see `.claude/project-state.md` Design
Decisions) — used in place of the CSS-simulated grain from the first pass,
per explicit request for real stock textures rather than generated ones.

- `divider-tile.webp` — one repeating frame-cell period cropped from
  Freepik/Magnific's "Роль плёнки" vector
  (https://www.magnific.com/ru/free-vector/film-roll_1020923.htm), by
  starline. Downloaded as SVG (no login required for that format), rasterized
  and cropped locally via ImageMagick; sprocket holes/frame windows keyed to
  transparent so `--color-background` shows through them.
- `grain-noise.webp` — from "Старая текстура плёнки с зерновым шумом"
  (https://www.magnific.com/ru/free-vector/old-film-texture-with-grain-noise_415522547.htm),
  by upklyak. Used as the page-wide ambient grain (`theme.tsx`) and
  alternated with `grain-scratches.webp` over gallery photo tiles.
- `grain-scratches.webp` — from "Старая плёнка с эффектом зерна с
  царапинами"
  (https://www.magnific.com/ru/free-vector/old-film-grain-effect-overlay-with-scratches_414763867.htm),
  by upklyak. Used over the "Наша история" photo(s) and alternated with
  `grain-noise.webp` over gallery photo tiles.
- `story-banner.webp` — background flourish behind "Наша история", cut out
  from "Старый баннер с катушками фильмов — ностальгический элемент дизайна"
  (https://www.magnific.com/ru/free-psd/vintage-film-reel-banner-nostalgic-design-element_406617490.htm),
  by xadartstudio. Downloaded as flattened JPG (white background), background
  removed locally via ImageMagick (`-fuzz -transparent white`).

All four: Freepik/Magnific free-tier license — free for commercial use,
**attribution required** (unlike the Pixabay-licensed assets elsewhere in
this project, which don't require it) — see each asset's own "Как
атрибутировать?" link on its page for the exact credit line if this ever
needs to be surfaced publicly. Downloaded via a logged-in Magnific account
(the user's own) for the two `upklyak` JPGs specifically — that author's free
JPG export hit a "daily limit" gate until logged in; the other two downloaded
without login.
