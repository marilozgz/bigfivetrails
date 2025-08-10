"use client"

import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { notFound } from "next/navigation"
import { use, useEffect, useState } from "react"
import { formatCurrency } from "../utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

/** ---------------- Types & Mock Data ---------------- */
interface SafariDetail {
  id: string
  title: string
  location: string
  durationDays: number
  experienceTypes: ExperienceTypeKey[]
  priceFrom: number
  thumbnail: string
  popular?: boolean
  highlights?: HighlightKey[]
  route?: string[]
  description: string
  included: string[]
  notIncluded: string[]
  itinerary: DayItinerary[]
  images: string[]
  maxGroupSize: number
  accommodation: string
  transportation: string
  bestTime: string
  difficulty: "Easy" | "Moderate" | "Challenging"
}

type ExperienceTypeKey =
  | "lodge"
  | "photographic"
  | "smallGroup"
  | "adventure"
  | "camping"

type HighlightKey =
  | "bigFive"
  | "privateGuide"
  | "greatFirstTimers"
  | "twiceDailyDrives"
  | "maraRiverView"
  | "budgetFriendly"
  | "kiliFoothills"
  | "nightInBush"
  | "customizableCamp"

interface DayItinerary {
  day: number
  title: string
  description: string
  accommodation: string
  meals: string[]
  activities: string[]
}

const SAFARI_DETAILS: Record<string, SafariDetail> = {
  "tz-001": {
    id: "tz-001",
    title: "Serengeti Classic",
    location: "Tanzania",
    durationDays: 7,
    experienceTypes: ["lodge", "photographic"],
    priceFrom: 2450,
    popular: true,
    thumbnail: "/images/safaris/safariclassic.jpg",
    highlights: ["bigFive", "privateGuide", "greatFirstTimers"],
    route: ["Arusha", "Tarangire", "Central Serengeti", "Ngorongoro"],
    description:
      "Embárcate en un safari clásico de 7 días por los parques nacionales más emblemáticos de Tanzania. Desde las llanuras del Serengeti hasta el cráter del Ngorongoro, experimenta la vida salvaje africana en su máxima expresión con alojamiento en lodges de lujo y guías expertos.",
    included: [
      "Alojamiento en lodges de lujo",
      "Todas las comidas durante el safari",
      "Transporte en vehículo 4x4 con techo abatible",
      "Guía profesional de safari",
      "Todas las actividades de safari",
      "Tasas de entrada a parques nacionales",
      "Agua mineral ilimitada",
      "Seguro de evacuación médica"
    ],
    notIncluded: [
      "Vuelos internacionales",
      "Visado de Tanzania",
      "Bebidas alcohólicas",
      "Propinas para guías y personal",
      "Gastos personales",
      "Seguro de viaje"
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada a Arusha",
        description:
          "Bienvenida en el aeropuerto y traslado al lodge en Arusha. Briefing sobre el safari y cena de bienvenida.",
        accommodation: "Lodge en Arusha",
        meals: ["Cena"],
        activities: ["Briefing del safari", "Cena de bienvenida"]
      },
      {
        day: 2,
        title: "Tarangire National Park",
        description:
          "Safari matutino y vespertino en Tarangire, famoso por sus grandes manadas de elefantes y baobabs centenarios.",
        accommodation: "Lodge en Tarangire",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Safari matutino",
          "Safari vespertino",
          "Observación de vida salvaje"
        ]
      },
      {
        day: 3,
        title: "Serengeti Central",
        description:
          "Traslado al Serengeti, el parque más famoso de África. Safari por la tarde en busca de la Gran Migración.",
        accommodation: "Lodge en Serengeti Central",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Traslado al Serengeti",
          "Safari vespertino",
          "Búsqueda de la Gran Migración"
        ]
      },
      {
        day: 4,
        title: "Serengeti - Safari Completo",
        description:
          "Día completo de safari en el Serengeti con safaris matutino y vespertino para maximizar las oportunidades de avistamiento.",
        accommodation: "Lodge en Serengeti Central",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Safari matutino",
          "Safari vespertino",
          "Observación de depredadores"
        ]
      },
      {
        day: 5,
        title: "Serengeti - Safari Libre",
        description:
          "Otro día completo en el Serengeti con la opción de safari libre o actividades adicionales como caminatas guiadas.",
        accommodation: "Lodge en Serengeti Central",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Safari libre",
          "Caminata guiada opcional",
          "Relajación en el lodge"
        ]
      },
      {
        day: 6,
        title: "Ngorongoro Crater",
        description:
          "Descenso al cráter del Ngorongoro, uno de los lugares con mayor densidad de vida salvaje del mundo.",
        accommodation: "Lodge en Ngorongoro",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Descenso al cráter",
          "Safari en el cráter",
          "Observación de rinocerontes negros"
        ]
      },
      {
        day: 7,
        title: "Regreso a Arusha",
        description:
          "Safari matutino en el cráter antes de regresar a Arusha para el vuelo de regreso.",
        accommodation: "No incluido",
        meals: ["Desayuno"],
        activities: [
          "Safari matutino en el cráter",
          "Traslado a Arusha",
          "Despedida"
        ]
      }
    ],
    images: [
      "/images/safaris/safariclassic.jpg",
      "/images/serengeti.jpg",
      "/images/ngorongoro.jpg",
      "/images/tarangire.jpg"
    ],
    maxGroupSize: 6,
    accommodation: "Lodges de lujo 4-5 estrellas",
    transportation: "Vehículo 4x4 Toyota Land Cruiser con techo abatible",
    bestTime: "Todo el año (mejor de junio a octubre para la Gran Migración)",
    difficulty: "Easy"
  },
  "ke-002": {
    id: "ke-002",
    title: "Masai Mara Express",
    location: "Kenya",
    durationDays: 4,
    experienceTypes: ["lodge", "smallGroup"],
    priceFrom: 1190,
    thumbnail: "/images/safaris/masaimara.jpg",
    highlights: ["twiceDailyDrives", "maraRiverView", "budgetFriendly"],
    route: ["Nairobi", "Masai Mara"],
    description:
      "Un safari express de 4 días al Masai Mara, el hogar de la Gran Migración y uno de los mejores lugares para avistar la vida salvaje africana. Perfecto para viajeros con tiempo limitado que quieren una experiencia intensa.",
    included: [
      "Alojamiento en lodge de safari",
      "Todas las comidas",
      "Transporte en minibús 4x4",
      "Guía profesional",
      "Safaris diarios",
      "Tasas de entrada al parque",
      "Agua mineral"
    ],
    notIncluded: [
      "Vuelos internacionales",
      "Visado de Kenya",
      "Bebidas alcohólicas",
      "Propinas",
      "Gastos personales"
    ],
    itinerary: [
      {
        day: 1,
        title: "Nairobi - Masai Mara",
        description:
          "Salida temprano desde Nairobi hacia el Masai Mara. Safari vespertino al llegar.",
        accommodation: "Lodge en Masai Mara",
        meals: ["Almuerzo", "Cena"],
        activities: ["Traslado al Masai Mara", "Safari vespertino"]
      },
      {
        day: 2,
        title: "Masai Mara - Safari Completo",
        description:
          "Día completo de safari con safaris matutino y vespertino para maximizar las oportunidades de avistamiento.",
        accommodation: "Lodge en Masai Mara",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Safari matutino",
          "Safari vespertino",
          "Observación de vida salvaje"
        ]
      },
      {
        day: 3,
        title: "Masai Mara - Safari Libre",
        description:
          "Otro día completo en el Masai Mara con opciones de safari libre o actividades culturales.",
        accommodation: "Lodge en Masai Mara",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: [
          "Safari libre",
          "Visita a pueblo Masai opcional",
          "Relajación"
        ]
      },
      {
        day: 4,
        title: "Masai Mara - Nairobi",
        description:
          "Safari matutino antes de regresar a Nairobi para el vuelo de regreso.",
        accommodation: "No incluido",
        meals: ["Desayuno"],
        activities: ["Safari matutino", "Traslado a Nairobi", "Despedida"]
      }
    ],
    images: ["/images/safaris/masaimara.jpg", "/images/serengeti.jpg"],
    maxGroupSize: 8,
    accommodation: "Lodge de safari 3-4 estrellas",
    transportation: "Minibús 4x4 con techo abatible",
    bestTime: "Julio a octubre (Gran Migración)",
    difficulty: "Easy"
  },
  "tz-003": {
    id: "tz-003",
    title: "Kilimanjaro Adventure + Safari",
    location: "Tanzania",
    durationDays: 10,
    experienceTypes: ["adventure", "camping"],
    priceFrom: 3290,
    thumbnail: "/images/safaris/kilimanjaro.jpg",
    highlights: ["kiliFoothills", "nightInBush", "customizableCamp"],
    route: ["Arusha", "Manyara", "Serengeti", "Ngorongoro"],
    description:
      "Una aventura épica de 10 días que combina la escalada al Kilimanjaro con un safari por los parques nacionales más impresionantes de Tanzania. Perfecto para aventureros que quieren combinar montaña y vida salvaje.",
    included: [
      "Escalada al Kilimanjaro con guías certificados",
      "Alojamiento en campamentos durante la escalada",
      "Alojamiento en lodges durante el safari",
      "Todas las comidas",
      "Equipo de escalada",
      "Transporte en vehículo 4x4",
      "Guías profesionales",
      "Tasas de entrada a parques y montaña"
    ],
    notIncluded: [
      "Vuelos internacionales",
      "Visado de Tanzania",
      "Equipo personal de escalada",
      "Bebidas alcohólicas",
      "Propinas",
      "Seguro de viaje"
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada y Preparación",
        description:
          "Llegada a Arusha, briefing sobre la escalada y preparación del equipo.",
        accommodation: "Hotel en Arusha",
        meals: ["Cena"],
        activities: ["Briefing de escalada", "Preparación de equipo"]
      },
      {
        day: 2,
        title: "Kilimanjaro - Día 1",
        description:
          "Inicio de la escalada por la ruta Machame. Caminata hasta el primer campamento.",
        accommodation: "Campamento Machame",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Inicio de escalada", "Caminata a Machame Camp"]
      },
      {
        day: 3,
        title: "Kilimanjaro - Día 2",
        description:
          "Ascenso gradual hacia Shira Camp con vistas espectaculares del valle.",
        accommodation: "Campamento Shira",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Ascenso a Shira Camp", "Aclimatación"]
      },
      {
        day: 4,
        title: "Kilimanjaro - Día 3",
        description: "Caminata hacia Barranco Camp con vistas del pico Kibo.",
        accommodation: "Campamento Barranco",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Caminata a Barranco Camp", "Vistas del Kibo"]
      },
      {
        day: 5,
        title: "Kilimanjaro - Día 4",
        description:
          "Ascenso final hacia Barafu Camp, preparación para la cumbre.",
        accommodation: "Campamento Barafu",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Ascenso a Barafu Camp", "Preparación para cumbre"]
      },
      {
        day: 6,
        title: "Kilimanjaro - Cumbre",
        description:
          "Ascenso nocturno a la cumbre del Kilimanjaro (5,895m) y descenso.",
        accommodation: "Campamento Mweka",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Ascenso a la cumbre", "Descenso a Mweka Camp"]
      },
      {
        day: 7,
        title: "Descenso y Descanso",
        description:
          "Descenso final del Kilimanjaro y traslado a Arusha para descanso.",
        accommodation: "Hotel en Arusha",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Descenso del Kilimanjaro", "Descanso en Arusha"]
      },
      {
        day: 8,
        title: "Safari - Manyara",
        description:
          "Inicio del safari con visita al Parque Nacional del Lago Manyara.",
        accommodation: "Lodge en Manyara",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Safari en Manyara", "Observación de aves y vida salvaje"]
      },
      {
        day: 9,
        title: "Safari - Serengeti",
        description:
          "Safari en el Serengeti con búsqueda de la Gran Migración.",
        accommodation: "Lodge en Serengeti",
        meals: ["Desayuno", "Almuerzo", "Cena"],
        activities: ["Safari en Serengeti", "Búsqueda de la Gran Migración"]
      },
      {
        day: 10,
        title: "Safari - Ngorongoro y Regreso",
        description:
          "Safari en el cráter del Ngorongoro antes de regresar a Arusha.",
        accommodation: "No incluido",
        meals: ["Desayuno"],
        activities: ["Safari en Ngorongoro", "Traslado a Arusha", "Despedida"]
      }
    ],
    images: [
      "/images/safaris/kilimanjaro.jpg",
      "/images/serengeti.jpg",
      "/images/ngorongoro.jpg"
    ],
    maxGroupSize: 4,
    accommodation: "Campamentos durante escalada, lodges durante safari",
    transportation: "Vehículo 4x4 para safari, caminata para escalada",
    bestTime: "Junio a octubre (temporada seca)",
    difficulty: "Challenging"
  }
}

export default function SafariDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const t = useTranslations("safaris")
  const { id } = use(params)
  const safari = SAFARI_DETAILS[id]
  const [selectedImage, setSelectedImage] = useState(0)

  // Carrusel automático de imágenes
  useEffect(() => {
    if (safari.images.length <= 1) return

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % safari.images.length)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [safari.images.length])

  if (!safari) {
    notFound()
  }

  const experienceLabels = safari.experienceTypes.map((type) =>
    t(`catalog.experienceTypes.${type}`)
  )

  const highlightLabels =
    safari.highlights?.map((highlight) =>
      t(`catalog.highlights.${highlight}`)
    ) || []

  return (
    <div
      className={`min-h-dvh bg-[var(--primary-background)] text-[#1f221b]/95 ${cormorant.className}`}>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header con título y galería */}
        <div className='mb-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-[#1f221b] mb-4'>
              {safari.title}
            </h1>
            <p className='text-xl text-[#1f221b]/80'>
              {safari.location} • {safari.durationDays} días
            </p>
          </div>

          {/* Galería de imágenes compacta */}
          <div className='relative h-64 md:h-80 rounded-lg overflow-hidden mb-8'>
            <Image
              fill
              src={safari.images[selectedImage]}
              alt={safari.title}
              className='object-cover transition-opacity duration-700'
              priority
            />

            {/* Indicadores de progreso automático */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {safari.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedImage === index
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            {/* Controles de navegación */}
            <button
              onClick={() =>
                setSelectedImage(
                  (prev) =>
                    (prev - 1 + safari.images.length) % safari.images.length
                )
              }
              className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>

            <button
              onClick={() =>
                setSelectedImage((prev) => (prev + 1) % safari.images.length)
              }
              className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Overview */}
            <section>
              <h2 className='text-3xl font-semibold mb-4'>
                Descripción del Safari
              </h2>
              <p className='text-lg leading-relaxed text-gray-700'>
                {safari.description}
              </p>
            </section>

            {/* Highlights */}
            {highlightLabels.length > 0 && (
              <section>
                <h2 className='text-3xl font-semibold mb-4'>Destacados</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {highlightLabels.map((highlight, index) => (
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
            <section>
              <h2 className='text-3xl font-semibold mb-6'>
                Itinerario Detallado
              </h2>
              <div className='space-y-6'>
                {safari.itinerary.map((day) => (
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
                        <p className='text-gray-700 mb-3'>{day.description}</p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <h4 className='font-semibold text-[#c6b892] mb-2'>
                              Alojamiento
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {day.accommodation}
                            </p>
                          </div>
                          <div>
                            <h4 className='font-semibold text-[#c6b892] mb-2'>
                              Comidas
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {day.meals.join(", ")}
                            </p>
                          </div>
                        </div>

                        {day.activities.length > 0 && (
                          <div className='mt-3'>
                            <h4 className='font-semibold text-[#c6b892] mb-2'>
                              Actividades
                            </h4>
                            <ul className='list-disc list-inside text-sm text-gray-600'>
                              {day.activities.map((activity, index) => (
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

            {/* Route */}
            {safari.route && safari.route.length > 0 && (
              <section>
                <h2 className='text-3xl font-semibold mb-4'>Ruta del Safari</h2>
                <div className='flex items-center gap-2 text-lg text-gray-700'>
                  {safari.route.map((location, index) => (
                    <div
                      key={location}
                      className='flex items-center'>
                      <span>{location}</span>
                      {index < safari.route!.length - 1 && (
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
                  ))}
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
                <div className='text-sm text-gray-600'>por persona</div>
              </div>

              <button className='w-full bg-[#4c692f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3d5a26] transition-colors mb-4'>
                Reservar Ahora
              </button>

              <button className='w-full border border-[#c6b892] text-[#c6b892] py-3 px-6 rounded-lg font-semibold hover:bg-[#c6b892] hover:text-white transition-colors'>
                Solicitar Cotización
              </button>
            </div>

            {/* Route Map */}
            {safari.route && safari.route.length > 0 && (
              <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
                <h3 className='text-xl font-semibold mb-4 text-center'>
                  Mapa de la Ruta
                </h3>
                <div className='relative'>
                  {/* Imagen del mapa */}
                  <div className='relative w-full aspect-square bg-white rounded-lg border border-[#c6b892]/20 overflow-hidden'>
                    <Image
                      src={`/images/safaris/mapa-${
                        safari.id === "tz-001"
                          ? "safariclassic"
                          : safari.id === "ke-002"
                          ? "masaimara"
                          : safari.id === "tz-003"
                          ? "ngorongoro"
                          : safari.id.replace("tz-", "")
                      }.jpg`}
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

            {/* Safari Details */}
            <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
              <h3 className='text-xl font-semibold mb-4'>
                Detalles del Safari
              </h3>
              <div className='space-y-4'>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Duración:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.durationDays} días
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Ubicación:
                  </span>
                  <span className='ml-2 text-gray-700'>{safari.location}</span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Tipo de Experiencia:
                  </span>
                  <div className='mt-1'>
                    {experienceLabels.map((label, index) => (
                      <span
                        key={index}
                        className='inline-block bg-[#c6b892]/20 text-[#c6b892] px-2 py-1 rounded text-sm mr-2 mb-2'>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Tamaño máximo del grupo:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.maxGroupSize} personas
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Alojamiento:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.accommodation}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Transporte:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.transportation}
                  </span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Mejor época:
                  </span>
                  <span className='ml-2 text-gray-700'>{safari.bestTime}</span>
                </div>
                <div>
                  <span className='font-semibold text-[#c6b892]'>
                    Dificultad:
                  </span>
                  <span className='ml-2 text-gray-700'>
                    {safari.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
              <h3 className='text-xl font-semibold mb-4'>Incluido</h3>
              <ul className='space-y-2'>
                {safari.included.map((item, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2'>
                    <svg
                      className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='text-gray-700 text-sm'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Not Included */}
            <div className='bg-white rounded-lg border border-[#c6b892]/30 p-6'>
              <h3 className='text-xl font-semibold mb-4'>No Incluido</h3>
              <ul className='space-y-2'>
                {safari.notIncluded.map((item, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2'>
                    <svg
                      className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                    <span className='text-gray-700 text-sm'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
