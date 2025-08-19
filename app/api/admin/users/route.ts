export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"
import { genLogin, genPassword } from "@/lib/utils"

export async function GET() {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({ users: [] })
  const users = await prisma.user.findMany({ where: { NOT: { id: s.user.id } }, select: { id: true, loginId: true, adminNoteName: true } } as any)
  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 })
  const body = await req.json()
  const loginId = genLogin()
  const loginPassword = genPassword()
  const u = await prisma.user.create({ data: { loginId, loginPassword, role: "USER", adminNoteName: String(body.adminNoteName||""), profile: { create: {} }, codeConfig: { create: {} } } } as any)
  return NextResponse.json({ userId: u.id, credentials: { loginId, loginPassword } })
}
