export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { login } from "@/lib/auth"

export async function POST(req: Request) {
  const form = await req.formData()
  const loginId = String(form.get("loginId")||"")
  const password = String(form.get("password")||"")
  const u = await login(loginId, password)
  if (!u) return NextResponse.redirect(new URL("/login?e=1", req.url))
  const isAdmin = u.role === "ADMIN"
  return NextResponse.redirect(new URL(isAdmin?"/admin":"/dashboard", req.url))
}
