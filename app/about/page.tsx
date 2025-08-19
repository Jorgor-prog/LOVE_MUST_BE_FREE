
import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"
import { getSession } from "@/lib/cookies"
import { redirect } from "next/navigation"

export default async function Page() {
  const s = await getSession()
  if (!s) redirect("/login")
  if (s.user.role !== "USER") redirect("/admin")
  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      <div className="container">
        <div className="card">
          <h2>About</h2>
          <p>Coming soon</p>
        </div>
      </div>
    </div>
  )
}
