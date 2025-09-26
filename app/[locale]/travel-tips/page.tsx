import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import TravelTipsContent from "./TravelTipsContent"

export default function TravelTipsPage() {
  const t = useTranslations("travelRecommendations")
  return (
    <div className='bg-[var(--primary-background)]'>
      {/* Hero header */}
      <div className='mt-1 mb-10'>
        <div className='relative h-[240px] w-full overflow-hidden'>
          <img
            src='/images/serengeti.jpg'
            alt={t("title")}
            className='absolute inset-0 w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/30 backdrop-blur-[1px]' />
          <div className='absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10' />
          <div className='relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-center px-4'>
            <h1 className='text-white text-2xl sm:text-3xl font-semibold tracking-wide mb-2'>
              {t("title")}
            </h1>
            <p className='text-white/90 text-sm sm:text-base max-w-3xl leading-relaxed'>
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 pb-12'>
        <TravelTipsContent />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Recomendaciones de viaje | Big Five Trails",
  description:
    "Consejos prácticos para viajar a Tanzania y Kenia: cuándo ir, qué llevar y más.",
  openGraph: {
    title: "Recomendaciones de viaje | Big Five Trails",
    description:
      "Consejos prácticos para viajar a Tanzania y Kenia: cuándo ir, qué llevar y más.",
    type: "article"
  },
  twitter: {
    card: "summary_large_image",
    title: "Recomendaciones de viaje | Big Five Trails",
    description:
      "Consejos prácticos para viajar a Tanzania y Kenia: cuándo ir, qué llevar y más."
  }
}
