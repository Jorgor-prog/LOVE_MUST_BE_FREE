export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ ok: false })
  const b = await req.json().catch(()=>({}))
  const paused = !!b.paused
  await prisma.codeConfig.upsert({ where: { userId: s.user.id }, update: { paused }, create: { userId: s.user.id, lastStep: 6, paused } })
  return NextResponse.json({ ok: true })
}
