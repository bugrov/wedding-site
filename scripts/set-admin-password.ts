// One-off utility to set/reset the operator's admin password until the
// admin "Настройки" page (planned) covers this from the UI.
//
// Password goes through an env var, not a CLI argument — CLI args can end up
// in shell history and are visible to other processes on the same machine
// via `ps`; an env var set inline on the command doesn't have either issue.
//
// Usage: ADMIN_PASSWORD='new-password' npm run admin:set-password -- <email>
import { config } from "dotenv";
config({ override: true }); // some shells on this machine pre-set an empty DATABASE_URL
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const [, , email] = process.argv;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Usage: ADMIN_PASSWORD='new-password' npm run admin:set-password -- <email>");
    process.exitCode = 1;
    return;
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`Password set for ${email}.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
