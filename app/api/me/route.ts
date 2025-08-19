
import { NextResponse } from "next/server"
import { getSession } from "@/lib/cookies"

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({ user: null })
  return NextResponse.json({ user: s.user })
}
