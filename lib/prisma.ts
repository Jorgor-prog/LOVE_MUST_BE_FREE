
import { PrismaClient } from "@prisma/client"
const globalAny = global as any
export const prisma = globalAny.prisma || new PrismaClient()
if (!globalAny.prisma) globalAny.prisma = prisma
