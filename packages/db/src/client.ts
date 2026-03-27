import { PrismaClient } from "@prisma/client";

type GlobalPrisma = typeof globalThis & {
  __propertyLkPrisma__?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

export const prisma =
  globalForPrisma.__propertyLkPrisma__ ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__propertyLkPrisma__ = prisma;
}
