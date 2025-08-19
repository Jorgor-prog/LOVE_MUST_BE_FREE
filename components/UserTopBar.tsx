
"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function UserTopBar() {
  const [hasNew, setHasNew] = useState(false)
  function homeHref() {
    if (typeof window === "undefined") return "/dashboard"
    if (localStorage.getItem("code_started") === "1") return "/confirm"
    return "/dashboard"
  }
  useEffect(()=>{
    let latestSeen = Number(localStorage.getItem("inbox_last_seen")||"0")
    let last = latestSeen
    let t = setInterval(async ()=>{
      try {
        const r = await fetch("/api/chat/inbox", { cache: "no-store" })
        const j = await r.json()
        last = j.latestId || 0
        const seen = Number(localStorage.getItem("inbox_last_seen")||"0")
        setHasNew(last>seen)
      } catch(e){}
    }, 4000)
    return ()=>clearInterval(t)
  },[])
  return (
    <div className="topbar">
      <div className="logo">
        <Image src="/images/Logo_3.webp" width={40} height={40} alt="" />
        <span>LOVE MUST BE FREE</span>
      </div>
      <div className="row">
        <Link href={homeHref()} className="btn">Back</Link>
        <Link href={homeHref()} className="btn">Home</Link>
        <Link href="/reviews" className="btn">Reviews</Link>
        <Link href="/about" className="btn">About</Link>
        <Link href="/chat" className="btn" style={{ position: "relative" }}>
          <span>Chat</span>
          {hasNew ? <span style={{ position:"absolute", right:-4, top:-4 }} className="badge"/> : null}
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="btn">Logout</button>
        </form>
      </div>
    </div>
  )
}
