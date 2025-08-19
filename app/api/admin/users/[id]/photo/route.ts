
import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"
import { getSession } from "@/lib/cookies"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({}, { status: 401 })
  const form = await req.formData()
  const f = form.get("photo")
  if (!f || typeof f === "string") return NextResponse.json({}, { status: 400 })
  const arrayBuf = await f.arrayBuffer()
  const buf = Buffer.from(arrayBuf)
  const out = await sharp(buf).resize(512, 512, { fit: "cover" }).webp({ quality: 80 }).toBuffer()
  const name = `u_${params.id}_${Date.now()}.webp`
  const dir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, name), out)
  const url = "/uploads/" + name
  const { prisma } = await import("@/lib/prisma")
  await prisma.profile.upsert({ where: { userId: Number(params.id) }, update: { photoUrl: url }, create: { userId: Number(params.id), photoUrl: url } })
  return NextResponse.json({ photoUrl: url })
}
