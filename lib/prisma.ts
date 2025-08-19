import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient = globalThis.prisma ?? new PrismaClient()
if (!globalThis.prisma) globalThis.prisma = prisma
