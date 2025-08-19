
"use client"
import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

const options = ['кокз 1','кокз 2','кокз 3','кокоз 4','кокоз 5','кокоз 6','кокоз 7','кокоз 8','кокоз 9','кокоз 10','кокоз 11']

export default function Page() {
  const [step, setStep] = useState(1)
  const [site, setSite] = useState("")
  const [nameOnSite, setNameOnSite] = useState("")
  const [idOnSite, setIdOnSite] = useState("")
  const [residence, setResidence] = useState("")
  const [matchOk, setMatchOk] = useState<boolean|null>(null)
  const [cubes, setCubes] = useState("")
  const [method, setMethod] = useState("")
  const [code, setCode] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [paused, setPaused] = useState(false)
  const [blur, setBlur] = useState(false)
  const [infoText, setInfoText] = useState("")
  const infoLen = 350

  useEffect(()=>{
    let s = ""
    while (s.length < infoLen) s += Math.random().toString(36).slice(2)
    setInfoText(s.slice(0, infoLen))
  }, [])

  useEffect(()=>{
    function handleVisibility() {
      if (document.visibilityState !== "visible") { setPaused(true); setBlur(true) }
      else setBlur(false)
    }
    function handleWindowBlur() { setPaused(true); setBlur(true) }
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

  useEffect(()=>{
    localStorage.setItem("code_started", streaming ? "1" : (localStorage.getItem("code_started")||"0"))
    localStorage.setItem("code_chars", code)
  }, [streaming, code])

  async function next1() {
    if (!site) return
    setStep(2)
  }

  async function confirm2() {
    const r = await fetch("/api/user/match-id?value=" + encodeURIComponent(idOnSite))
    const j = await r.json()
    if (j.match) setMatchOk(true)
    else setMatchOk(false)
    setStep(3)
  }

  function cont3() { setStep(4) }

  function next4() { setStep(5) }

  function next5() {
    const ok = /^\d{4}-\d{4}$/.test(method.trim())
    if (!ok) return
    setStep(6)
  }

  function start() {
    setPaused(false)
    setStreaming(true)
    fetch("/api/user/start", { method: "POST" })
    const es = new EventSource("/api/code-stream")
    es.onmessage = ev => {
      if (paused) return
      const ch = ev.data || ""
      setCode(prev => (prev + ch).split("").join(" "))
    }
  }

  function pause() {
    setPaused(true)
  }

  return (
    <div style={{minHeight:"100dvh", position:"relative"}} className="print-blur">
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      {blur ? <div className="blur-overlay"></div> : null}
      <div className="container">
        <div style={{display:"grid", placeItems:"center", position:"relative"}}>
          <div style={{position:"absolute"}}>
            <Image src="/images/Logo_3.webp" alt="" width={380} height={380} style={{opacity:.8}} />
          </div>
          <div className="card" style={{width:"100%", maxWidth:860}}>
            {step===1 && (
              <div className="col">
                <h2>Step 1</h2>
                <label>The name of the website where you communicated and conducted transactions</label>
                <select className="select" value={site} onChange={e=>setSite(e.target.value)}>
                  <option value="">Select...</option>
                  {options.map(o=>(<option key={o} value={o}>{o}</option>))}
                </select>
                <small className="muted">Если вы не нашли подходящий вариант обратитесь в поддержку.</small>
                <div className="row">
                  <a className="btn" href="/chat">Open support chat</a>
                  <button className="btn primary" onClick={next1} disabled={!site}>Next</button>
                </div>
              </div>
            )}
            {step===2 && (
              <div className="col">
                <h2>Step 2</h2>
                <label>Your name on the website</label>
                <input className="input" value={nameOnSite} onChange={e=>setNameOnSite(e.target.value)} />
                <label>Your ID on the website</label>
                <input className="input" value={idOnSite} onChange={e=>setIdOnSite(e.target.value)} />
                <label>Place of residence indicated on the website</label>
                <input className="input" value={residence} onChange={e=>setResidence(e.target.value)} />
                <small className="muted">The panda rabbit crocodile, di di di, eats candy, and could eat shashlik, but the elephant didn't come</small>
                <div className="row">
                  <a className="btn" href="/chat">Open support chat</a>
                  <button className="btn primary" onClick={confirm2}>Confirm and continue</button>
                </div>
              </div>
            )}
            {step===3 && (
              <div className="col">
                {matchOk ? (
                  <div className="grid2">
                    <div className="col">
                      <strong>Name on site</strong>
                      <span>{nameOnSite}</span>
                      <strong>ID on site</strong>
                      <span>{idOnSite}</span>
                      <strong>Residence</strong>
                      <span>{residence}</span>
                    </div>
                    <div className="col" style={{alignItems:"center"}}>
                      <div style={{width:140, height:140, borderRadius:999, border:"2px solid #1f2937", overflow:"hidden"}}>
                        <Image src="/images/Logo_3.webp" width={140} height={140} alt="" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col">
                    <div>The entered data does not match. Please contact support.</div>
                    <a className="btn" href="/chat">Open support chat</a>
                  </div>
                )}
                {matchOk ? <button className="btn primary" onClick={cont3}>Confirm and continue</button> : null}
              </div>
            )}
            {step===4 && (
              <div className="col">
                <h2>Step 4</h2>
                <label>How many cubes did you use?</label>
                <input className="input" value={cubes} onChange={e=>setCubes(e.target.value)} />
                <small className="muted">please indicate the approximate quantity</small>
                <button className="btn primary" onClick={next4} style={{marginTop:8}}>Next</button>
              </div>
            )}
            {step===5 && (
              <div className="col">
                <h2>Step 5</h2>
                <label>Enter the first four digits of the method and the last digits of the destination in the format -</label>
                <input className="input" placeholder="1234-1234" value={method} onChange={e=>setMethod(e.target.value)} />
                <button className="btn primary" onClick={next5} disabled={!/^\d{4}-\d{4}$/.test(method.trim())} style={{marginTop:8}}>Next</button>
              </div>
            )}
            {step===6 && (
              <div className="col">
                <h2>Step 6</h2>
                <div className="row" style={{gap:8}}>
                  <button className="btn primary" onClick={start}>Generate code</button>
                  <button className="btn" onClick={pause}>Pause</button>
                  <button className="btn" onClick={()=>setPaused(false)}>Start</button>
                </div>
                {paused ? <div className="card" style={{background:"#1f2937", marginTop:8}}>The pause is set for a maximum of 32 hours, after which the code will become invalid</div> : null}
                <div className="card" style={{marginTop:8}}>{code}</div>
                <textarea className="textarea" readOnly value={infoText} style={{marginTop:8}}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
