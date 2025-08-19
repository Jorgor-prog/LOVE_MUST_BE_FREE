
import "./globals.css"
import Image from "next/image"

export const metadata = { title: "LOVE MUST BE FREE" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
