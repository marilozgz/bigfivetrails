import type { Metadata } from "next"
import Header from "../components/Header"
import "../globals.css"

export const metadata: Metadata = {
  title: "Big Five Trails",
  description: "Big Five Trails Best Safari Tours in Tanzania"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <Header />
        {children}
      </body>
    </html>
  )
}
