// One-off utility to set/reset the operator's admin password until the
// admin "Настройки" page (planned) covers this from the UI.
// Usage: npm run admin:set-password -- <email> <new-password>
import { config } from "dotenv";
config({ override: true }); // some shells on this machine pre-set an empty DATABASE_URL
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: npm run admin:set-password -- <email> <new-password>");
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
