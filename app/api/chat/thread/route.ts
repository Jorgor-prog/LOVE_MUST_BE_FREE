export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({ messages: [] })
  const url = new URL(req.url)
  const uid = Number(url.searchParams.get("userId")||"0")
  if (!uid) return NextResponse.json({ messages: [] })
  const ms = await prisma.message.findMany({ where: { OR: [{ fromId: uid, toId: s.user.id }, { fromId: s.user.id, toId: uid }] }, orderBy: { id: "asc" } })
  return NextResponse.json({ messages: ms })
}
