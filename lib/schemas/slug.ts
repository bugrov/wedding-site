import { z } from "zod";

// Split out from lib/schemas/project.ts (which does a runtime import of the
// generated Prisma client for ProjectStatus) so the admin project editor — a
// client component — can validate the slug input without pulling Prisma's
// Node-only runtime into the browser bundle (Turbopack error: "chunking
// context does not support external modules (request: node:module)").
//
// Same charset proxy.ts requires of a Host-header slug (`^[a-z0-9-]+$`) —
// anything else could never actually be reached at <slug>.<domain>. "www" is
// excluded separately: proxy.ts treats `www.<domain>` as the bare app domain
// (no rewrite), so a project with that literal slug would be unreachable.
export const slugSchema = z
  .string()
  .min(3, "Слишком короткий адрес (минимум 3 символа)")
  .max(63, "Слишком длинный адрес (максимум 63 символа)")
  .regex(/^[a-z0-9-]+$/, "Только строчные латинские буквы, цифры и дефис")
  .refine((value) => value !== "www", "Этот адрес зарезервирован, выберите другой");
