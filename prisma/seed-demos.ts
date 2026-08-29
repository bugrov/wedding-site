import { randomBytes } from "node:crypto";
import { config } from "dotenv";
config({ override: true }); // some shells on this machine pre-set an empty DATABASE_URL
import { PrismaClient, ProjectStatus } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createDefaultBlocksConfig, type BlocksConfig } from "../lib/blocks";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Step 11: real, publicly reachable demo sites for each of the 5 templates —
// examples.tsx links its style swatches here instead of "#configurator" (see
// its own comment). Deliberately one shared set of real stock photos and
// content across all 5, so a visitor can compare templates on the same
// couple/content instead of being distracted by different photos (see
// project-state.md Design Decisions — approved by the user before use).
// Pexels serves each photo under whatever extension its own original upload
// had (usually .jpeg, occasionally .png) — hardcoding .jpeg 404s for those.
function pexelsPhoto(id: number, ext: "jpeg" | "png" = "jpeg"): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&w=1600`;
}

const COVER_PHOTO = pexelsPhoto(31429051); // couple by a waterfall, greenery
const GALLERY_PHOTOS = [
  pexelsPhoto(33140490), // portrait by an ivy wall
  pexelsPhoto(37380420), // couple with bouquet, daylight
  pexelsPhoto(32392450), // couple on a cobblestone old-town street
  pexelsPhoto(9093323), // couple by a historic building
];

// Matches the public configurator's own fallback names (FALLBACK_GROOM_NAME/
// FALLBACK_BRIDE_NAME in components/landing/configurator.tsx).
const GROOM_NAME = "Александр";
const BRIDE_NAME = "Мария";
const WEDDING_DATE = new Date("2027-06-12T15:00:00");
const VENUE_QUERY = "Усадьба Кусково, Москва";

function demoBlocksConfig(): BlocksConfig {
  const blocksConfig = createDefaultBlocksConfig();

  blocksConfig.cover = { tagline: "Мы женимся", photoUrl: COVER_PHOTO };

  blocksConfig.content.story = {
    text: "Мы познакомились пять лет назад в осеннем парке — и с тех пор не расставались. Будем очень рады разделить этот день с самыми близкими.",
    photos: [GALLERY_PHOTOS[1], GALLERY_PHOTOS[3]],
  };

  blocksConfig.content.schedule = {
    items: [
      { time: "15:00", title: "Сбор гостей" },
      { time: "15:30", title: "Церемония" },
      { time: "16:30", title: "Фотосессия и фуршет" },
      { time: "18:00", title: "Банкет" },
      { time: "23:00", title: "Праздничный салют" },
    ],
  };

  blocksConfig.content.venue = {
    address: "Москва, усадьба «Кусково», ул. Юности, 2",
    description:
      "Церемония пройдёт в старинной усадьбе с видом на пруд — идеальное место для загородной свадьбы в кругу близких.",
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`,
  };

  blocksConfig.content.gallery = { photos: GALLERY_PHOTOS };

  blocksConfig.content.wishes = {
    text: "Ваше присутствие для нас — главный подарок. Если всё же хотите порадовать нас чем-то ещё, будем благодарны конверту с добрыми пожеланиями.",
  };

  blocksConfig.content.chat = {
    text: "Закрытый чат для гостей — здесь можно обсудить детали и задать вопросы.",
  };

  blocksConfig.content.rsvp = {
    askFood: true,
    askDrink: true,
    askPlusOne: true,
    askComment: true,
    deadline: "2027-05-15",
  };

  return blocksConfig;
}

// Palette per template's own default tokens (see each template's theme.tsx /
// components/landing/examples.tsx STYLES) — dresscode swatch stays
// coordinated with the site's actual colors instead of a generic default.
const DEMOS: { slug: string; templateId: string; dresscodePalette: string[] }[] = [
  {
    slug: "demo-tuscany",
    templateId: "tuscany",
    dresscodePalette: ["#4B5320", "#9C6B30", "#F6F2EA"],
  },
  {
    slug: "demo-old-money",
    templateId: "old-money",
    dresscodePalette: ["#6B1E2B", "#A9813E", "#F6EFE2"],
  },
  {
    slug: "demo-editorial-bw",
    templateId: "editorial-bw",
    dresscodePalette: ["#1A1A1A", "#B5533C", "#E5E0DA"],
  },
  {
    slug: "demo-pink-sketch",
    templateId: "pink-sketch",
    dresscodePalette: ["#8B3226", "#C1503D", "#F2D9D3"],
  },
  {
    slug: "demo-moody-paper",
    templateId: "moody-paper",
    dresscodePalette: ["#1E2118", "#6B6650", "#F1F0EC"],
  },
];

async function main() {
  for (const demo of DEMOS) {
    const blocksConfig = demoBlocksConfig();
    blocksConfig.content.dresscode = {
      text: "Просим гостей выбрать элегантный образ в тёплой палитре — избегайте белого и слишком ярких цветов.",
      palette: demo.dresscodePalette,
    };

    const data = {
      groomName: GROOM_NAME,
      brideName: BRIDE_NAME,
      weddingDate: WEDDING_DATE,
      templateId: demo.templateId,
      blocksConfig: blocksConfig as object,
      status: ProjectStatus.PUBLISHED,
      publishedAt: new Date(),
    };

    const project = await prisma.project.upsert({
      where: { slug: demo.slug },
      create: { slug: demo.slug, clientAccessToken: randomBytes(24).toString("hex"), ...data },
      update: data,
    });

    console.log(`OK ${project.slug} (${project.templateId})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
