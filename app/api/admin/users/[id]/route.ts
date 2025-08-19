
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 })
  const id = Number(params.id)
  const user = await prisma.user.findUnique({ where: { id }, include: { profile: true, codeConfig: true } })
  return NextResponse.json({ user })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 })
  const id = Number(params.id)
  const body = await req.json()
  const dataUser: any = { loginId: body.loginId, loginPassword: body.loginPassword, adminNoteName: body.adminNoteName }
  await prisma.user.update({ where: { id }, data: dataUser })
  if (body.profile) {
    await prisma.profile.upsert({ where: { userId: id }, update: { nameOnSite: body.profile.nameOnSite || null, idOnSite: body.profile.idOnSite || null, residence: body.profile.residence || null }, create: { userId: id, nameOnSite: body.profile.nameOnSite || null, idOnSite: body.profile.idOnSite || null, residence: body.profile.residence || null } })
  }
  if (body.codeConfig) {
    await prisma.codeConfig.upsert({ where: { userId: id }, update: { paused: !!body.codeConfig.paused }, create: { userId: id, paused: !!body.codeConfig.paused } })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 })
  const id = Number(params.id)
  await prisma.message.deleteMany({ where: { OR: [{ fromId: id }, { toId: id }] } })
  await prisma.profile.deleteMany({ where: { userId: id } })
  await prisma.codeConfig.deleteMany({ where: { userId: id } })
  await prisma.session.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
