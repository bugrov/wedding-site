import "server-only";
import { prisma } from "@/lib/db";

// Cyrillic -> Latin, just enough for a name-based subdomain slug (see plan:
// "поддомены вида имя1-имя2.domain.ru") — doesn't need to be a linguistically
// correct transliteration, just stable and URL-safe.
const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function slugifyName(name: string): string {
  const transliterated = name
    .toLowerCase()
    .split("")
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join("");

  return (
    transliterated.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
    // A name that transliterates to nothing usable (emoji-only input,
    // etc.) still needs a non-empty slug segment.
    "guest"
  );
}

async function slugTaken(slug: string): Promise<boolean> {
  return (await prisma.project.findUnique({ where: { slug }, select: { id: true } })) !== null;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export async function generateUniqueSlug(
  groomName: string,
  brideName: string,
  weddingDate: Date,
): Promise<string> {
  const base = `${slugifyName(groomName)}-${slugifyName(brideName)}`;
  if (!(await slugTaken(base))) return base;

  // Same couple names, different couple — disambiguate with something
  // meaningful instead of a bare "-2" (see feedback: plain numbers "look
  // off"). Widens from year to the full wedding date only if two
  // identically-named couples also marry in the same year — a numeric
  // suffix is the last resort, for the (very rare) exact same date too.
  const withYear = `${base}-${weddingDate.getFullYear()}`;
  if (!(await slugTaken(withYear))) return withYear;

  const withDate = `${base}-${pad2(weddingDate.getDate())}-${pad2(weddingDate.getMonth() + 1)}-${weddingDate.getFullYear()}`;
  if (!(await slugTaken(withDate))) return withDate;

  let slug = withDate;
  let suffix = 2;
  while (await slugTaken(slug)) {
    slug = `${withDate}-${suffix}`;
    suffix++;
  }

  return slug;
}
