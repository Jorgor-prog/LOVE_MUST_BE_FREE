
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const a = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  return NextResponse.json({ id: a?.id || null })
}
