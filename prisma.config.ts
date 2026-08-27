// override: true because some shells on this machine pre-set an empty
// DATABASE_URL, which dotenv's default (non-overriding) load would otherwise
// leave in place instead of the real value from .env.
import { config } from "dotenv";
config({ override: true });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
