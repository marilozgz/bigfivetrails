import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  getLocalizedContent,
  MultiLanguageContent,
  Safari
} from "@/lib/types/safari"

type SafariRow = {
  id: string
  code: string
  title?: string | MultiLanguageContent
  overview?: string | MultiLanguageContent
  description?: string | MultiLanguageContent
  accommodation?: string | MultiLanguageContent
  transportation?: string | MultiLanguageContent
  best_time?: string | MultiLanguageContent
  difficulty?: string | MultiLanguageContent
  location?: string
  duration_days?: number
  price_from?: number
  experience_types?: unknown[]
  highlights?: unknown[]
  route?: string[]
  thumbnail: string
  thumbnail_thumb?: string
  images?: string[]
  itinerary?: unknown[]
  max_group_size?: number
  popular?: boolean
  [key: string]: unknown
}

export async function getSafarisData(locale: string): Promise<Safari[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("safaris")
    .select(
      [
        "id",
        "code",
        "title",
        "overview",
        "location",
        "duration_days",
        "price_from",
        "experience_types",
        "highlights",
        "route",
        "thumbnail",
        "thumbnail_thumb",
        "popular"
      ].join(", ")
    )
    .order("popular", { ascending: false })

  if (error) {
    console.error("Error fetching safaris from Supabase:", error.message)
    return []
  }

  const rows: SafariRow[] = (data as unknown as SafariRow[]) || []
  return rows.map((row) => {
    const experienceTypes = Array.isArray(row.experience_types as unknown[])
      ? row.experience_types
      : []

    return {
      id: row.id,
      code: row.code,
      title: getLocalizedContent(row.title, locale),
      overview: getLocalizedContent(row.overview, locale),
      location: row.location || undefined,
      durationDays: row.duration_days || undefined,
      priceFrom: row.price_from || undefined,
      experienceTypes,
      highlights: row.highlights || [],
      route: row.route || [],
      thumbnail: row.thumbnail,
      thumbnail_thumb: row.thumbnail_thumb || undefined,
      popular: row.popular ?? false
    } as Safari
  })
}

export async function getSafariData(
  idOrCode: string,
  locale: string
): Promise<Safari | null> {
  const supabase = createSupabaseServerClient()
  const isUuid = /[0-9a-fA-F-]{36}/.test(idOrCode)
  const query = supabase
    .from("safaris")
    .select(
      [
        "id",
        "code",
        "title",
        "overview",
        "description",
        "location",
        "duration_days",
        "price_from",
        "experience_types",
        "highlights",
        "route",
        "thumbnail",
        "thumbnail_thumb",
        "images",
        "itinerary",
        "max_group_size",
        "accommodation",
        "transportation",
        "best_time",
        "difficulty",
        "popular"
      ].join(", ")
    )
    .limit(1)

  const { data, error } = isUuid
    ? await query.eq("id", idOrCode)
    : await query.eq("code", idOrCode)

  if (error) {
    console.error("Error fetching safari from Supabase:", error.message)
    return null
  }

  const row = (data as unknown as SafariRow[])?.[0] as SafariRow | undefined
  if (!row) return null

  return {
    id: row.id,
    code: row.code,
    title: getLocalizedContent(row.title, locale),
    overview: getLocalizedContent(row.overview, locale),
    description: getLocalizedContent(row.description, locale),
    location: row.location || undefined,
    durationDays: row.duration_days || undefined,
    priceFrom: row.price_from || undefined,
    experienceTypes: Array.isArray(row.experience_types)
      ? row.experience_types
      : [],
    highlights: row.highlights || [],
    route: row.route || [],
    thumbnail: row.thumbnail,
    thumbnail_thumb: row.thumbnail_thumb || undefined,
    images: row.images || [],
    itinerary: row.itinerary || [],
    maxGroupSize: row.max_group_size || undefined,
    accommodation: getLocalizedContent(row.accommodation, locale),
    transportation: getLocalizedContent(row.transportation, locale),
    bestTime: getLocalizedContent(row.best_time, locale),
    difficulty: getLocalizedContent(row.difficulty, locale),
    popular: row.popular ?? false
  } as Safari
}

export function formatCurrency(value?: number): string {
  if (!value && value !== 0) return ""
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value)
}

function shimmerSVG(width: number, height: number) {
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f6f7f8" offset="20%" />
        <stop stop-color="#edeef1" offset="50%" />
        <stop stop-color="#f6f7f8" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#f6f7f8" />
    <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`
}

export function getShimmerDataURL(width = 700, height = 475): string {
  const svg = shimmerSVG(width, height)
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : window.btoa(svg)
  return `data:image/svg+xml;base64,${base64}`
}
