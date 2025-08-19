export const dynamic = "force-dynamic"
import { getSession } from "@/lib/cookies"
import { redirect } from "next/navigation"

export default async function Page() {
  const s = await getSession()
  if (s) {
    redirect(s.user.role === "ADMIN" ? "/admin" : "/dashboard")
  }
  redirect("/login")
}
