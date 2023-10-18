import { PrismaClient } from "@prisma/client";

const globlaForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globlaForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globlaForPrisma.prisma = prisma;

export const db = prisma;
