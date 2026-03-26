import { PrismaClient } from "@prisma/client";

declare global {
  var __propertyLkPrisma__: PrismaClient | undefined;
}

export const prisma = globalThis.__propertyLkPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__propertyLkPrisma__ = prisma;
}
