// prisma/seeders/seed.ts
import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./user";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await seedUsers(prisma);

  console.log("✅ Seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
