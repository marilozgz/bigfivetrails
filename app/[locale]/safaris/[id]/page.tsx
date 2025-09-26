import { ItineraryDay } from "@/lib/types/safari"
import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { notFound } from "next/navigation"
import { formatCurrency, getSafariData, getShimmerDataURL } from "../utils"
import Breadcrumbs from "./breadcrumbs"
import SafariJsonLd from "./jsonld"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default async function SafariDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const t = await getTranslations("safaris")
  const locale = await getLocale()
  const { id } = await params
  const safari = await getSafariData(id, locale)

  if (!safari) {
    notFound()
  }

  const experienceLabels = (safari.experienceTypes || [])
    .filter(
      (
        type: unknown
      ): type is string | { name: string; description?: string } =>
        type !== null && type !== undefined
    )
    .map((type: string | { name: string }) => {
      const typeKey = typeof type === "object" ? type.name : type
      return t(`catalog.experienceTypes.${typeKey}`)
    })

  const highlightLabels = (safari.highlights || [])
    .filter(
      (
        highlight: unknown
      ): highlight is string | { name: string; description?: string } =>
        highlight !== null && highlight !== undefined
    )
    .map((highlight: string | { name: string }): string => {
      const highlightKey =
        typeof highlight === "object" ? highlight.name : highlight
      return t(`catalog.highlights.${highlightKey}`)
    })

  return (
    <div
      className={`min-h-dvh bg-[var(--primary-background)] text-[#1f221b]/95 ${cormorant.className}`}>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header con título y galería */}
        <div className='mb-8'>
          <Breadcrumbs
            locale={locale}
            code={safari.code}
            title={safari.title}
          />
          <div className='text-center mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#1f221b] mb-4'>
              {safari.title}
            </h1>
            <p className='text-xl text-[#1f221b]/80'>
              {safari.location} • {safari.durationDays} {t("detail.days")}
            </p>
          </div>

          {/* Galería de imágenes simple */}
          <div className='relative h-64 md:h-80 rounded-lg overflow-hidden mb-8'>
            <Image
              src={
                safari.thumbnail_thumb ||
                safari.thumbnail ||
                safari.images?.[0] ||
                "/images/default-safari.jpg"
              }
              alt={safari.title}
              fill
              className='object-cover'
              priority
              placeholder='blur'
              blurDataURL={getShimmerDataURL(1024, 512)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Overview */}
            <section>
              <h2 className='text-3xl font-semibold mb-4'>
                {t("detail.description")}
              </h2>
              <p className='text-lg leading-relaxed text-gray-700'>
                {safari.description}
              </p>
            </section>

            {/* Highlights */}
            {highlightLabels.length > 0 && (
              <section>
                <h2 className='text-3xl font-semibold mb-4'>
                  {t("detail.highlights")}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {highlightLabels
                    .filter((h: unknown): h is string => typeof h === "string")
                    .map((highlight: string, index: number) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 p-4 bg-white rounded-lg border border-[#c6b892]/30'>
                        <div className='w-2 h-2 bg-[#c6b892] rounded-full' />
                        <span className='text-gray-700'>{highlight}</span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {safari.itinerary && safari.itinerary.length > 0 && (
              <section>
                <h2 className='text-3xl font-semibold mb-6'>
                  {t("detail.itinerary")}
                </h2>
                <div className='space-y-6'>
                  {safari.itinerary.map((day: ItineraryDay) => (
                    <div
                      key={day.day}
                      className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
                      <div className='flex items-start gap-4'>
                        <div className='flex-shrink-0 w-12 h-12 bg-[#c6b892] rounded-full flex items-center justify-center text-white font-bold'>
                          {day.day}
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-xl font-semibold mb-2'>
                            {day.title}
                          </h3>
                          <p className='text-gray-700 mb-3'>
                            {day.description}
                          </p>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <h4 className='font-semibold text-[#c6b892] mb-2'>
                                {t("detail.accommodation")}
                              </h4>
                              <p className='text-sm text-gray-600'>
                                {typeof day.accommodation === "string"
                                  ? day.accommodation
                                  : typeof day.accommodation === "object" &&
                                    day.accommodation?.name
                                  ? day.accommodation.name
                                  : "Alojamiento incluido"}
                              </p>
                            </div>
                            <div>
                              <h4 className='font-semibold text-[#c6b892] mb-2'>
                                {t("detail.meals")}
                              </h4>
                              <p className='text-sm text-gray-600'>
                                {day.meals
                                  ? day.meals
                                      .filter(
                                        (meal): meal is string =>
                                          typeof meal === "string"
                                      )
                                      .join(", ")
                                  : t("detail.mealsIncluded")}
                              </p>
                            </div>
                          </div>

                          {day.activities && day.activities.length > 0 && (
                            <div className='mt-3'>
                              <h4 className='font-semibold text-[#c6b892] mb-2'>
                                {t("detail.activities")}
                              </h4>
                              <ul className='list-disc list-inside text-sm text-gray-600'>
                                {day.activities
                                  .filter(
                                    (activity): activity is string =>
                                      typeof activity === "string"
                                  )
                                  .map((activity: string, index: number) => (
                                    <li key={index}>{activity}</li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Route */}
            {safari.route && safari.route.length > 0 && (
              <section>
                <h2 className='text-3xl font-semibold mb-4'>
                  {t("detail.route")}
                </h2>
                <div className='flex items-center gap-2 text-lg text-gray-700'>
                  {safari.route
                    .filter(
                      (location: unknown): location is string =>
                        typeof location === "string"
                    )
                    .map(
                      (
                        location: string,
                        index: number,
                        filteredArray: string[]
                      ) => (
                        <div
                          key={location}
                          className='flex items-center'>
                          <span>{location}</span>
                          {index < filteredArray.length - 1 && (
                            <svg
                              className='w-5 h-5 mx-2 text-[#c6b892]'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 8l4 4m0 0l-4 4m4-4H3'
                              />
                            </svg>
                          )}
                        </div>
                      )
                    )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Price Card */}
            <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6 sticky top-8'>
              <div className='text-center mb-6'>
                <div className='text-2xl font-bold text-[#c54e2c] mb-2'>
                  {formatCurrency(safari.priceFrom)}
                </div>
                <div className='text-sm text-gray-600'>
                  {t("detail.perPerson")}
                </div>
              </div>

              <button className='w-full bg-[#4c692f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3d5a26] transition-colors mb-4'>
                {t("detail.bookNow")}
              </button>

              <button className='w-full border border-[#c6b892] text-[#c6b892] py-3 px-6 rounded-lg font-semibold hover:bg-[#c6b892] hover:text-white transition-colors'>
                {t("detail.requestQuote")}
              </button>
            </div>

            {/* Safari Details */}
            <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
              <h3 className='text-xl font-semibold mb-4'>
                {t("detail.details")}
              </h3>
              <div className='space-y-4'>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.duration")}:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.durationDays} {t("detail.days")}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.location")}:
                  </span>
                  <span className='ml-2 text-gray-700'>{safari.location}</span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.experienceType")}:
                  </span>
                  <div className='mt-1'>
                    {experienceLabels
                      .filter(
                        (l: unknown): l is string => typeof l === "string"
                      )
                      .map((label: string, index: number) => (
                        <span
                          key={index}
                          className='inline-block bg-[#f8f6f0] text-[#1f221b] px-2 py-1 rounded text-sm mr-2 mb-2'>
                          {label}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.maxGroupSize")}:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.maxGroupSize} {t("detail.people")}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.accommodation")}:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.accommodation}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.transportation")}:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.transportation}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.bestTime")}:
                  </span>
                  <span className='ml-2 text-gray-700'>{safari.bestTime}</span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    {t("detail.difficulty")}:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Route Map */}
            {safari.route && safari.route.length > 0 && (
              <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
                <h3 className='text-xl font-semibold mb-4 text-center'>
                  {t("detail.routeMap")}
                </h3>
                <div className='relative'>
                  {/* Imagen del mapa */}
                  <div className='relative w-full aspect-square bg-white rounded-lg border border-[#c6b892]/20 overflow-hidden'>
                    <Image
                      src={`/images/safaris/mapa-${
                        safari.code === "ndutu"
                          ? "safariclassic"
                          : safari.code === "serengeti"
                          ? "safariclassic"
                          : safari.code === "maretuniwonder"
                          ? "maretuniwonder"
                          : safari.code
                      }.png`}
                      alt={`Ruta del safari ${safari.title}`}
                      fill
                      className='object-contain'
                    />
                  </div>

                  {/* Información de la ruta */}
                  <div className='mt-4 text-center'>
                    <p className='text-sm text-gray-700'>
                      <span className='font-semibold text-[#c6b892]'>
                        {safari.durationDays} días
                      </span>{" "}
                      • {safari.route.length} destinos
                    </p>
                    <p className='text-xs text-gray-600 mt-2'>
                      {safari.route.join(" → ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* JSON-LD */}
      <SafariJsonLd
        id={safari.code || String(id)}
        locale={locale}
      />
    </div>
  )
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const locale = await getLocale()
  const { id } = await params
  const safari = await getSafariData(id, locale)
  // Título basado en el título mostrado, enriquecido con ubicación y duración si están disponibles
  const composedTitleParts: string[] = []
  if (safari?.title) composedTitleParts.push(safari.title)
  if (safari?.location) composedTitleParts.push(String(safari.location))
  if (safari?.durationDays)
    composedTitleParts.push(`${safari.durationDays} días`)
  const fallbackComposedTitle =
    composedTitleParts.length > 0
      ? `${composedTitleParts.join(" · ")} | Big Five Trails`
      : "Safari | Big Five Trails"
  const title = safari?.seo_title || fallbackComposedTitle

  // Descripción priorizando la propia del safari
  const description =
    safari?.seo_description ||
    safari?.description ||
    safari?.overview ||
    "Safaris inolvidables en Tanzania y Kenia con Big Five Trails."
  const images = [
    safari?.og_image || safari?.thumbnail || "/images/serengeti.jpg"
  ].filter(Boolean) as string[]
  const url =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/safaris/${safari?.code || id}`
      : undefined
  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      images,
      type: "website",
      url
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images
    }
  }
}
