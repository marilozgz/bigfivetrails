import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Cormorant_Garamond } from "next/font/google"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  title: "Big Five Trails",
  description: "Big Five Trails Best Safari Tours in Tanzania"
}

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default async function SafarisLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = await getTranslations("safaris")
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
