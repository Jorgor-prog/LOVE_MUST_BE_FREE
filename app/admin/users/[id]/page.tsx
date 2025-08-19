
"use client"
import { useEffect, useState } from "react"

export default function Page({ params }: any) {
  const id = Number(params.id)
  const [u, setU] = useState<any|null>(null)
  const [file, setFile] = useState<File|null>(null)
  const [msg, setMsg] = useState("")
  async function load() {
    const r = await fetch(`/api/admin/users/${id}`)
    const j = await r.json()
    setU(j.user)
  }
  useEffect(()=>{ load() }, [id])
  if (!u) return <div className="container"><div className="card">Loading</div></div>

  async function save() {
    const r = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify(u) })
    await load()
  }

  async function del() {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    location.href = "/admin"
  }

  async function uploadPhoto() {
    if (!file) return
    const fd = new FormData()
    fd.append("photo", file)
    await fetch(`/api/admin/users/${id}/photo`, { method: "POST", body: fd })
    await load()
  }

  async function send() {
    setMsg("")
    await fetch(`/api/chat/send`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ toId: u.id, text: msg }) })
  }

  return (
    <div className="container">
      <div className="card">
        <div className="col">
          <label>Admin note name</label>
          <input className="input" value={u.adminNoteName||""} onChange={e=>setU({...u, adminNoteName: e.target.value})} />
          <label>Login</label>
          <input className="input" value={u.loginId} onChange={e=>setU({...u, loginId: e.target.value})} />
          <label>Password</label>
          <input className="input" value={u.loginPassword} onChange={e=>setU({...u, loginPassword: e.target.value})} />
          <label>Role</label>
          <input className="input" value={u.role} readOnly />
          <h3>Profile</h3>
          <label>Name on site</label>
          <input className="input" value={u.profile?.nameOnSite||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), nameOnSite:e.target.value}})} />
          <label>ID on site</label>
          <input className="input" value={u.profile?.idOnSite||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), idOnSite:e.target.value}})} />
          <label>Residence</label>
          <input className="input" value={u.profile?.residence||""} onChange={e=>setU({...u, profile:{...(u.profile||{}), residence:e.target.value}})} />
          <div className="row">
            <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
            <button className="btn" onClick={uploadPhoto}>Upload</button>
          </div>
          {u.profile?.photoUrl ? <img src={u.profile.photoUrl} width={120}/> : null}
          <h3>Code config</h3>
          <div className="row">
            <label>Paused</label>
            <input type="checkbox" checked={u.codeConfig?.paused||false} onChange={e=>setU({...u, codeConfig:{...(u.codeConfig||{}), paused:e.target.checked}})} />
          </div>
          <div className="row" style={{gap:8}}>
            <button className="btn primary" onClick={save}>Save</button>
            <button className="btn danger" onClick={del}>Delete user</button>
            <a className="btn" href="/admin">Back</a>
          </div>
          <h3>Chat</h3>
          <div className="row" style={{gap:8}}>
            <input className="input" placeholder="Message" value={msg} onChange={e=>setMsg(e.target.value)} />
            <button className="btn" onClick={send}>Chat with user</button>
          </div>
        </div>
      </div>
    </div>
  )
}
