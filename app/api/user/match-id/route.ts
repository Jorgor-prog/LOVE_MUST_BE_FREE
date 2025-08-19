
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ match: false })
  const url = new URL(req.url)
  const value = String(url.searchParams.get("value")||"").trim()
  const u = await prisma.user.findUnique({ where: { id: s.user.id }, include: { profile: true } })
  const id = (u?.profile?.idOnSite||"").trim()
  const match = id === value
  return NextResponse.json({ match })
}
