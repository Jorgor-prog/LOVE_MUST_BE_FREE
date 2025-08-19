export const dynamic = "force-dynamic"
import { getSession } from "@/lib/cookies"
import { NextResponse } from "next/server"

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({})
  return NextResponse.json({ user: s.user })
}
