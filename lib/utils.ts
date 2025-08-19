
export function clsx(...a: any[]) {
  return a.filter(Boolean).join(" ")
}

export function genLogin() {
  const n = Math.random().toString(36).slice(2,8)
  return "u_" + n
}

export function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%*"
  let s = ""
  for (let i=0;i<12;i++) s += chars[Math.floor(Math.random()*chars.length)]
  return s
}

export function uid() {
  return Math.random().toString(36).slice(2)
}
