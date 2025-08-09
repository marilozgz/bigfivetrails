import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
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
      {/* Mini hero para Destinations */}
      <div className='mt-1 mb-10'>
        <div className='relative h-[290px] w-full overflow-hidden'>
          <Image
            src='/images/tarangire.jpg'
            alt={t("hero.alt")}
            fill
            priority
            className='object-cover'
          />
          {/* Capa de color + blur */}
          <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />

          {/* Gradiente sutil por encima para darle profundidad */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10' />
          {/* Overlay suave con gradiente */}

          <div className='relative  mt-6 z-10 mx-auto max-w-7xl h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8'>
            <h2
              className={`text-white text-xl sm:text-2xl font-semibold tracking-wide mb-2 ${cormorant.className}`}>
              {t("hero.title")}
            </h2>
            <p
              className={`text-white/90 text-sm sm:text-base max-w-3xl leading-relaxed ${cormorant.className}`}>
              {t("hero.description")}
            </p>
          </div>
        </div>
      </div>

      {children}
      <Footer />
    </>
  )
}
