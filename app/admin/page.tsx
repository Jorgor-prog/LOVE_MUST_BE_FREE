
"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
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
  useEffect(()=>{ load() }, [])

  async function createUser() {
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminNoteName: note }) })
    const j = await r.json()
    setCred(j.credentials)
    setNote("")
    await load()
  }

  function copyCred() {
    if (!cred) return
    navigator.clipboard.writeText(`login: ${cred.loginId} password: ${cred.loginPassword}`)
  }

  return (
    <div className="container">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h1>{t.title}</h1>
        <div className="row">
          <span style={{marginRight:8}}>{t.switch}</span>
          <select className="select" value={lang} onChange={e=>setLang(e.target.value as any)}>
            <option value="uk">Українська</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
      <div className="card">
        <div className="row" style={{gap:8}}>
          <input className="input" placeholder={t.note} value={note} onChange={e=>setNote(e.target.value)} />
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
  )
}
