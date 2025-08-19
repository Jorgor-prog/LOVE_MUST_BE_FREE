
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
        <div className="card" style={{maxWidth:720, margin:"24px auto"}}>
          <h1>All services are already ordered and paid</h1>
          <p>You only need to clarify and confirm the order details. Once the data is verified, you will receive your code.</p>
          <div className="row" style={{marginTop:16}}>
            <a className="btn primary" href="/confirm">Clarify and confirm details</a>
            <a className="btn" href="/chat">Support chat</a>
          </div>
        </div>
      </div>
    </div>
  )
}
