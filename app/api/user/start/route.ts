export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function POST() {
  const s = await getSession()
  if (!s) return NextResponse.json({ ok: false })
  await prisma.codeConfig.upsert({ where: { userId: s.user.id }, update: { lastStep: 6 }, create: { userId: s.user.id, lastStep: 6, paused: false } })
  return NextResponse.json({ ok: true })
}
