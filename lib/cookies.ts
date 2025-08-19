
import { cookies, headers } from "next/headers"
import { prisma } from "./prisma"
import { NextRequest } from "next/server"
import { randomBytes } from "crypto"

export async function getSessionToken() {
  const c = cookies()
  const token = c.get("session_token")?.value
  return token || null
}

export async function getSession() {
  const token = await getSessionToken()
  if (!token) return null
  const s = await prisma.session.findUnique({ where: { token }, include: { user: { include: { profile: true, codeConfig: true } } } })
  return s
}

export async function requireUser() {
  const s = await getSession()
  if (!s) return null
  return s.user
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex")
  await prisma.session.create({ data: { token, userId } })
  return token
}

export async function clearSession(token: string) {
  await prisma.session.delete({ where: { token } }).catch(()=>{})
}
