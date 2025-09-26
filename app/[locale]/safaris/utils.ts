import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Safari } from "@/lib/types/safari"

type SafariRow = {
  id: string
  code: string
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
        `title_${locale}:title_${locale}`,
        `overview_${locale}:overview_${locale}`,
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
    const title = row[`title_${locale}`] || row.title_en || row.title || ""
    const overview =
      row[`overview_${locale}`] || row.overview_en || row.overview || ""
    const experienceTypes = Array.isArray(row.experience_types as unknown[])
      ? row.experience_types
      : []

    return {
      id: row.id,
      code: row.code,
      title,
      overview,
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
        `title_${locale}:title_${locale}`,
        `overview_${locale}:overview_${locale}`,
        `description_${locale}:description_${locale}`,
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
    title: row[`title_${locale}`] || row.title_en || row.title || "",
    overview:
      row[`overview_${locale}`] || row.overview_en || row.overview || "",
    description:
      row[`description_${locale}`] ||
      row.description_en ||
      row.description ||
      "",
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
    accommodation: row.accommodation || undefined,
    transportation: row.transportation || undefined,
    bestTime: row.best_time || undefined,
    difficulty: row.difficulty || undefined,
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
