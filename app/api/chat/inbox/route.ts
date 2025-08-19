
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ latestId: 0 })
  const me = s.user
  const m = await prisma.message.findFirst({ where: { toId: me.id }, orderBy: { id: "desc" } })
  return NextResponse.json({ latestId: m?.id || 0 })
}
