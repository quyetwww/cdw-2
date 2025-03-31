import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

function makeClient() {
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
}

export const prisma = globalForPrisma.prisma || makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
