"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import AdminTopBar from "@/components/AdminTopBar"
import { adminStrings } from "@/lib/i18n"

export default function Page() {
  const [lang, setLang] = useState<"en"|"uk"|"ru">("uk")
  const t = adminStrings[lang]
  const [users, setUsers] = useState<any[]>([])
  const [note, setNote] = useState("")
  const [cred, setCred] = useState<any|null>(null)

  async function load() {
    const r = await fetch("/api/admin/users", { cache: "no-store" })
    const j = await r.json()
    setUsers(j.users || [])
  }
  useEffect(()=>{
    const v = (typeof window==="undefined"?"":localStorage.getItem("admin_lang")) as any
    if (v) setLang(v)
    load()
  },[])

  async function createUser() {
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminNoteName: note }) })
    const j = await r.json()
    setCred(j.credentials||null)
    setNote("")
    await load()
  }

  function copyCred() {
    if (!cred) return
    navigator.clipboard.writeText(`login: ${cred.loginId} password: ${cred.loginPassword}`)
  }

  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}/>
      <AdminTopBar />
      <div className="container">
        <div className="card">
          <h2>{t.createUser}</h2>
          <div className="row" style={{marginTop:8}}>
            <input className="input" placeholder={t.notePlaceholder} value={note} onChange={e=>setNote(e.target.value)} />
            <button className="btn primary" onClick={createUser}>{t.create}</button>
            {cred ? <button className="btn" onClick={copyCred}>{t.copy}</button> : null}
          </div>
        </div>
        <div className="card" style={{marginTop:12}}>
          <h3>{t.list}</h3>
          <div className="col">
            {users.map(u=>(
              <Link key={u.id} className="link" href={`/admin/users/${u.id}`}>{u.adminNoteName || u.loginId}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
