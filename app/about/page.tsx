import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"
import { getSession } from "@/lib/cookies"
import { redirect } from "next/navigation"

export default async function Page() {
  const s = await getSession()
  if (!s) redirect("/login")
  const text = "Ми робимо прості речі надійними, а складні — зрозумілими. Команда працює з увагою до дрібниць, щоб інтерфейси були плавні, швидкі та чесні. Наш підхід — мінімум зайвого, максимум користі. Ми тестуємо, міряємо, оптимізуємо та поважаємо час користувача. Продукт має працювати завжди: на мобільному, повільному інтернеті та з будь-якого куточка світу. Ми будуємо системи, яким можна довіряти, і сервіс, який не підводить. Якщо потрібно — переписуємо, якщо болить — лікуємо, якщо можна — спрощуємо. Тут немає магії: є практика, дисципліна та любов до якості."
  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      <div className="container">
        <div className="card">
          <h2>About</h2>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}
