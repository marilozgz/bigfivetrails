/* eslint-disable @typescript-eslint/no-explicit-any */
import { locales } from "@/i18n"
import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import SafariFiltersWrapper from "./components/SafariFiltersWrapper"
import { getSafarisData } from "./utils"

/** ---------------- Palette ---------------- */
const COLORS = {
  pink: "var(--secondary-color)",
  beige: "var(--primary-background)",
  dark: "var(--dark-olive-green)",
  gold: "#c6b892",
  green: "#4c692f",
  terracotta: "#c54e2c"
}

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

/** ---------------- Page ---------------- */
export default async function DestinationsPage() {
  const t = await getTranslations("safaris")
  const locale = await getLocale()

  // Cargar safaris dinámicamente
  const safaris = await getSafarisData(locale)

  // Counts per location (for nicer sidebar)
  const locationCounts = new Map<string, number>()
  for (const s of safaris) {
    if (s.location) {
      locationCounts.set(s.location, (locationCounts.get(s.location) || 0) + 1)
    }
  }

  return (
    <div
      className={`min-h-dvh bg-[var(--primary-background)] text-[#1f221b]/95 ${cormorant.className}`}
      style={{
        // expose palette as CSS vars so we can use via var() in className strings if needed
        // without tailwind config changes
        ["--pink" as any]: COLORS.pink,
        ["--beige" as any]: COLORS.beige,
        ["--dark" as any]: COLORS.dark,
        ["--gold" as any]: COLORS.gold,
        ["--green" as any]: COLORS.green,
        ["--terra" as any]: COLORS.terracotta
      }}>
      {/* Hero Section para la página principal */}
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

          <div className='relative mt-6 z-10 mx-auto max-w-7xl h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8'>
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

      <section className='mx-auto max-w-7xl px-4'>
        <SafariFiltersWrapper safaris={safaris} />
      </section>
      {/* JSON-LD ItemList */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: safaris.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/${locale}/safaris/${s.code}`,
              name: s.title
            }))
          })
        }}
      />
    </div>
  )
}

const site =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
  "https://bigfivetrails.com"

export const metadata: Metadata = {
  title: "Safaris | Big Five Trails",
  description:
    "Explora safaris en Tanzania y Kenia: Serengeti, Ngorongoro, Masai Mara y más.",
  alternates: {
    canonical: `${site}/safaris`,
    languages: Object.fromEntries(
      locales.map((l) => [l, `${site}/${l}/safaris`])
    )
  },
  openGraph: {
    title: "Safaris | Big Five Trails",
    description:
      "Explora safaris en Tanzania y Kenia: Serengeti, Ngorongoro, Masai Mara y más.",
    images: ["/images/serengeti.jpg"],
    type: "website",
    url: `${site}/safaris`
  },
  twitter: {
    card: "summary_large_image",
    title: "Safaris | Big Five Trails",
    description:
      "Explora safaris en Tanzania y Kenia: Serengeti, Ngorongoro, Masai Mara y más."
  }
}
