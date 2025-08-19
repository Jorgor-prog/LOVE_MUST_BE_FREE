import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"
import type { Message } from "@prisma/client"

export async function GET(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ messages: [] })
  const me = s.user
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  if (!admin) return NextResponse.json({ messages: [] })
  const url = new URL(req.url)
  const head = url.searchParams.get("head")
  if (head) {
    const latest = await prisma.message.findFirst({ where: { OR: [{ fromId: admin.id, toId: me.id }, { fromId: me.id, toId: admin.id }] }, orderBy: { id: "desc" }, select: { id: true } })
    return NextResponse.json({ latest })
  }
  const ms: Message[] = await prisma.message.findMany({ where: { OR: [{ fromId: admin.id, toId: me.id }, { fromId: me.id, toId: admin.id }] }, orderBy: { id: "asc" } })
  const messages = ms.map(m => ({ ...m, isMine: m.fromId === me.id }))
  return NextResponse.json({ messages })
}
