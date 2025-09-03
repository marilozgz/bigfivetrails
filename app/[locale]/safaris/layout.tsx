import type { Metadata } from "next"
import Footer from "../components/Footer"

export const metadata: Metadata = {
  title: "Big Five Trails",
  description: "Big Five Trails Best Safari Tours in Tanzania"
}

export default function SafarisLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
