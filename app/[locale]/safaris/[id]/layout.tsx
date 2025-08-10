import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function SafariDetailLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className={cormorant.className}>
      {/* Mini-hero para manejar el espacio bajo el header */}
      <div className='h-24 bg-[var(--primary-background)]' />
      {children}
    </div>
  )
}
