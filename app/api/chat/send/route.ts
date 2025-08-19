
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const toId = Number(body.toId)
  const text = String(body.text||"").slice(0,2000)
  if (!toId || !text) return NextResponse.json({ ok: false }, { status: 400 })
  await prisma.message.create({ data: { fromId: s.user.id, toId, text } })
  return NextResponse.json({ ok: true })
}
