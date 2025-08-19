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
    document.addEventListener("visibilitychange", handleVisibility)
    return ()=>document.removeEventListener("visibilitychange", handleVisibility)
  },[])

  async function load() {
    const a = await fetch("/api/chat/admin-id", { cache: "no-store" })
    const admin = await a.json()
    setToId(admin.id||null)
    const r = await fetch("/api/chat/thread-user", { cache: "no-store" })
    const j = await r.json()
    setMessages(j.messages||[])
    const last = (j.messages||[]).at(-1)?.id || 0
    localStorage.setItem("inbox_last_seen", String(last))
    window.dispatchEvent(new Event("inbox_seen_update"))
    requestAnimationFrame(()=>{ listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }) })
  }

  async function send() {
    if (!toId) return
    const t = text.trim()
    if (!t) return
    await fetch("/api/chat/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toId, text: t }) })
    setText("")
    await load()
  }

  useEffect(()=>{
    load()
    const i = setInterval(load, 3000)
    return ()=>clearInterval(i)
  },[])

  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      {blur ? <div className="blur-overlay"/> : null}
      <div className="container">
        <div className="card">
          <h2>Chat</h2>
          <div ref={listRef} style={{height:360, overflow:"auto", border:"1px solid #1f2937", borderRadius:10, padding:8, marginBottom:8}}>
            {messages.map(m=>(
              <div key={m.id} style={{display:"flex", justifyContent: m.isMine ? "flex-end" : "flex-start", padding:"6px 0"}}>
                <div style={{maxWidth: "70%", border:"1px solid #334155", background:"#0b1220", borderRadius:12, padding:"8px 12px"}}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="row">
            <input className="input" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Type a message"/>
            <button className="btn primary" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
