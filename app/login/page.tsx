
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { getSession } from "@/lib/cookies"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page() {
  const s = await getSession()
  if (s) {
    const r = s.user.role === "ADMIN" ? "/admin" : "/dashboard"
    redirect(r)
  }
  return (
    <div style={position:"relative", minHeight:"100dvh"}>
      <Image src="/images/Background_1.webp" alt="" fill style={objectFit:"cover"} />
      <div style={position:"absolute", inset:0, display:"grid", placeItems:"center"}>
        <div style={position:"absolute"}>
          <Image src="/images/Logo_3.webp" alt="" width=380 height=380 style={opacity:.8} />
        </div>
        <div className="card" style={minWidth:320, width:360, position:"relative"}>
          <form action="/api/auth/login" method="post" className="col">
            <input name="loginId" className="input" placeholder="Your login" />
            <input name="password" type="password" className="input" placeholder="Your password" />
            <button className="btn primary" style={width:"100%"}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
