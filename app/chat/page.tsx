
"use client"
import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function Page() {
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [toId, setToId] = useState<number|null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [blur, setBlur] = useState(false)

  useEffect(()=>{
    function handleVisibility() {
      if (document.visibilityState !== "visible") setBlur(true)
      else setBlur(false)
    }
    function handleWindowBlur() { setBlur(true) }
    function handleWindowFocus() { setBlur(false) }
    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("focus", handleWindowFocus)
    const style = document.createElement("style")
    style.textContent = "@media print { .print-blur { filter: blur(10px) } }"
    document.head.appendChild(style)
    return ()=>{
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("focus", handleWindowFocus)
      style.remove()
    }
  }, [])

  async function load() {
    const r = await fetch("/api/chat/thread-user", { cache: "no-store" })
    const j = await r.json()
    setMessages(j.messages || [])
    const idr = await fetch("/api/chat/admin-id")
    const jd = await idr.json()
    setToId(jd.id)
    if (j.latest && j.latest.id) localStorage.setItem("inbox_last_seen", String(j.latest.id))
    requestAnimationFrame(()=>{
      listRef.current?.scrollTo({ top: 999999, behavior: "smooth" })
    })
  }

  useEffect(()=>{
    load()
    const t = setInterval(async ()=>{
      const r = await fetch("/api/chat/thread-user?head=1", { cache: "no-store" })
      const h = await r.json()
      if (h.latest && h.latest.id) {
        const seen = Number(localStorage.getItem("inbox_last_seen")||"0")
        if (h.latest.id > seen) {
          await load()
        }
      }
    }, 3500)
    return ()=>clearInterval(t)
  }, [])

  async function send() {
    if (!text.trim() || !toId) return
    await fetch("/api/chat/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toId, text }) })
    setText("")
    await load()
  }

  return (
    <div style={{minHeight:"100dvh", position:"relative"}} className="print-blur">
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      {blur ? <div className="blur-overlay"></div> : null}
      <div className="container">
        <div className="card" style={{height:"70dvh", display:"flex", flexDirection:"column"}}>
          <div ref={listRef} style={{flex:1, overflow:"auto", padding:"8px 0"}}>
            {messages.map(m=>(
              <div key={m.id} style={{display:"flex", justifyContent: m.isMine ? "flex-end" : "flex-start", padding:"6px 0"}}>
                <div style={{maxWidth: "70%", border:"1px solid #1f2937", background: m.isMine ? "#0ea5e9" : "#0f172a", color: m.isMine ? "#0b1220":"#e5e7eb", borderRadius:12, padding:"8px 12px"}}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="row">
            <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message"/>
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
