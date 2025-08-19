import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"
import { getSession } from "@/lib/cookies"
import { redirect } from "next/navigation"

const ALL = [
  "Сервіс працює швидко, інтерфейс інтуїтивний. Підтримка відповіла за кілька хвилин.",
  "Дуже акуратний дизайн і жодних зайвих кроків. Те, що треба.",
  "Приємно здивувала стабільність: жодного збою за тиждень активного користування.",
  "Гарна локалізація і продуманий онбординг. Рекомендую.",
  "Оптимізація чудова: навіть на слабкому ноуті працює плавно.",
  "Було кілька питань — вирішили все у чаті без нервів.",
  "Все просто: зайшов, зробив справу, вийшов. Як має бути.",
  "Сподобалась увага до деталей і акуратні анімації.",
  "Навіть дрібні речі типу валідації зроблені правильно."
]

function pick7() {
  const a = [...ALL]
  for (let i=a.length-1;i>0;i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] }
  return a.slice(0,7)
}

export default async function Page() {
  const s = await getSession()
  if (!s) redirect("/login")
  if (s.user.role !== "USER") redirect("/admin")
  const items = pick7()
  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      <div className="container">
        <div className="card">
          <h2>Reviews</h2>
          <div className="col">
            {items.map((t,i)=>(
              <div key={i} className="card" style={{padding:12}}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
