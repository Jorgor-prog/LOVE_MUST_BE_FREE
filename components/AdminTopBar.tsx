"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function AdminTopBar() {
  const [lang, setLang] = useState<"uk"|"en"|"ru">("uk")
  useEffect(()=>{
    const v = (typeof window==="undefined"?"":localStorage.getItem("admin_lang")) as "uk"|"en"|"ru"|null
    if (v) setLang(v)
  },[])
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value as "uk"|"en"|"ru"
    setLang(v)
    if (typeof window!=="undefined") localStorage.setItem("admin_lang", v)
  }
  return (
    <div className="topbar">
      <div className="logo">
        <Image src="/images/Logo_3.webp" width={56} height={56} alt="" />
        <span>ADMIN</span>
      </div>
      <div className="row">
        <Link href="/admin" className="btn">Users</Link>
        <select className="select" value={lang} onChange={onChange} style={{width:140}}>
          <option value="uk">Українська</option>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
        <form action="/api/auth/logout" method="post">
          <button className="btn">Logout</button>
        </form>
      </div>
    </div>
  )
}
