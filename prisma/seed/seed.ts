import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";
import { seedClassFields } from "./classfields.seed";

const prisma = new PrismaClient();

async function main() {
  // await prisma.$executeRaw`TRUNCATE TABLE "makes" RESTART IDENTITY CASCADE`;
  // await await seedTaxonomy(prisma);
  await seedClassFields(prisma);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
