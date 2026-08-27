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

export async function generateUniqueSlug(groomName: string, brideName: string): Promise<string> {
  const base = `${slugifyName(groomName)}-${slugifyName(brideName)}`;
  let slug = base;
  let suffix = 2;

  while (await prisma.project.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix}`;
    suffix++;
  }

  return slug;
}
