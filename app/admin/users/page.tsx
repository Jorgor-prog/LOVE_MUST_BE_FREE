"use client"
import { useEffect, useRef, useState } from "react"
import AdminTopBar from "@/components/AdminTopBar"

export default function Page({ params }: any) {
  const id = Number(params.id)
  const [u, setU] = useState<any|null>(null)
  const [file, setFile] = useState<File|null>(null)
  const [msg, setMsg] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [codeText, setCodeText] = useState("")
  const [intervalMs, setIntervalMs] = useState(200)
  const [paused, setPaused] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  async function load() {
    const r = await fetch(`/api/admin/users/${id}`, { cache: "no-store" })
    const j = await r.json()
    setU(j.user)
    setPaused(!!j.user?.codeConfig?.paused)
  }
  useEffect(()=>{ load() }, [id])

  async function saveUser() {
    if (!u) return
    const body = {
      loginId: u.loginId,
      loginPassword: u.loginPassword,
      adminNoteName: u.adminNoteName,
      profile: { nameOnSite: u.profile?.nameOnSite||"", idOnSite: u.profile?.idOnSite||"", residence: u.profile?.residence||"", photoUrl: u.profile?.photoUrl||"" }
    }
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    await load()
  }

  async function removeUser() {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    location.href = "/admin"
  }

  async function uploadPhoto() {
    if (!file) return
    const fd = new FormData()
    fd.append("photo", file)
    const r = await fetch(`/api/admin/users/${id}/photo`, { method: "POST", body: fd })
    const j = await r.json()
    if (u) setU({ ...u, profile: { ...(u.profile||{}), photoUrl: j.photoUrl } })
  }

  async function loadThread() {
    const r = await fetch(`/api/chat/thread?userId=${id}`, { cache: "no-store" })
    const j = await r.json()
    setMessages(j.messages||[])
    requestAnimationFrame(()=>{ listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }) })
  }

  async function send() {
    const text = msg.trim()
    if (!text) return
    await fetch("/api/chat/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toId: id, text }) })
    setMsg("")
    await loadThread()
  }

  useEffect(()=>{
    loadThread()
    const t = setInterval(loadThread, 3000)
    return ()=>clearInterval(t)
  }, [id])

  async function togglePause(p: boolean) {
    setPaused(p)
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codeConfig: { paused: p } }) })
  }

  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <AdminTopBar />
      <div className="container">
        {u ? (
          <div className="grid2">
            <div className="card">
              <h3>User</h3>
              <div className="col">
                <label>Admin note name</label>
                <input className="input" value={u.adminNoteName||""} onChange={e=>setU({...u, adminNoteName: e.target.value})} />
                <label>Login</label>
                <input className="input" value={u.loginId||""} onChange={e=>setU({...u, loginId: e.target.value})} />
                <label>Password</label>
                <input className="input" value={u.loginPassword||""} onChange={e=>setU({...u, loginPassword: e.target.value})} />
                <h3>Profile</h3>
                <label>Name on site</label>
                <input className="input" value={u.profile?.nameOnSite||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), nameOnSite: e.target.value}})} />
                <label>ID on site</label>
                <input className="input" value={u.profile?.idOnSite||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), idOnSite: e.target.value}})} />
                <label>Residence</label>
                <input className="input" value={u.profile?.residence||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), residence: e.target.value}})} />
                <div className="row" style={{marginTop:8}}>
                  <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
                  <button className="btn" onClick={uploadPhoto}>Upload</button>
                </div>
                {u.profile?.photoUrl ? (
                  <div style={{width:140, height:140, borderRadius:"999px", overflow:"hidden", border:"1px solid #1f2937"}}>
                    <img src={u.profile.photoUrl} width={140} height={140} style={{objectFit:"cover"}} alt="" />
                  </div>
                ) : null}
                <div className="row" style={{marginTop:8}}>
                  <button className="btn primary" onClick={saveUser}>Save</button>
                  <button className="btn danger" onClick={removeUser}>Delete</button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Chat</h3>
              <div ref={listRef} style={{height:280, overflow:"auto", border:"1px solid #1f2937", borderRadius:10, padding:8, marginBottom:8}}>
                {messages.map((m:any)=>(
                  <div key={m.id} style={{display:"flex", justifyContent: m.fromId===u.id ? "flex-start" : "flex-end", padding:"6px 0"}}>
                    <div style={{maxWidth:"70%", border:"1px solid #334155", background:"#0b1220", borderRadius:12, padding:"8px 12px"}}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="row">
                <input className="input" value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{ if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Type a message"/>
                <button className="btn primary" onClick={send}>Send</button>
              </div>
            </div>

            <div className="card">
              <h3>Code</h3>
              <div className="col">
                <textarea className="textarea" value={codeText} onChange={e=>setCodeText(e.target.value)} placeholder="Enter code for this user"/>
                <div className="row" style={{justifyContent:"space-between"}}>
                  <small className="muted">{codeText.length} chars</small>
                  <div className="row">
                    <input type="number" className="input" style={{width:120}} value={intervalMs} min={30} max={2000} onChange={e=>setIntervalMs(Number(e.target.value||0))}/>
                    <span>ms</span>
                  </div>
                </div>
                <div className="row" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>togglePause(true)} style={{background:"#334155"}}>Pause</button>
                  <button className="btn primary" onClick={()=>togglePause(false)}>Start</button>
                  <div style={{width:10,height:10,borderRadius:999,marginLeft:8, background: paused ? "#ef4444" : "#22c55e"}}/>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
