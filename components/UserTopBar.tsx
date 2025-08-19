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
    let lastKnown = Number(localStorage.getItem("inbox_last_seen")||"0")
    async function check() {
      try {
        const r = await fetch("/api/chat/inbox", { cache: "no-store" })
        const j = await r.json()
        const latest = Number(j.latestId||0)
        lastKnown = Number(localStorage.getItem("inbox_last_seen")||"0")
        setHasNew(latest>lastKnown)
      } catch {}
    }
    const t = setInterval(check, 4000)
    check()
    function onSeenUpdate() {
      lastKnown = Number(localStorage.getItem("inbox_last_seen")||"0")
      setHasNew(false)
    }
    window.addEventListener("inbox_seen_update", onSeenUpdate)
    return ()=>{ clearInterval(t); window.removeEventListener("inbox_seen_update", onSeenUpdate) }
  },[])
  return (
    <div className="topbar">
      <div className="logo">
        <Image src="/images/Logo_3.webp" width={56} height={56} alt="" />
        <span>LOVE MUST BE FREE</span>
      </div>
      <div className="row">
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
