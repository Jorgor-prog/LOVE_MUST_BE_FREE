
import { NextResponse } from "next/server"
import { prisma } from "./prisma"
import { createSession, getSession, getSessionToken, clearSession } from "./cookies"
import { cookies } from "next/headers"
import { compare } from "bcryptjs"

export async function login(loginId: string, password: string) {
  const u = await prisma.user.findUnique({ where: { loginId } })
  if (!u) return null
  const okPlain = u.loginPassword && password === u.loginPassword
  let okHash = false
  if (u.passwordHash) okHash = false
  if (!okPlain && !okHash) return null
  const token = await createSession(u.id)
  cookies().set("session_token", token, { httpOnly: true, sameSite: "lax", secure: true, path: "/" })
  return u
}

export async function logout() {
  const token = cookies().get("session_token")?.value
  if (token) await clearSession(token)
  cookies().set("session_token", "", { httpOnly: true, path: "/", maxAge: 0 })
  return true
}
