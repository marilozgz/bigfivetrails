import { getLocalizedContent } from "@/lib/types/safari"
import { getSafariData } from "../utils"

export default async function SafariJsonLd({
  id,
  locale
}: {
  id: string
  locale: string
}) {
  const safari = await getSafariData(id, locale)
  if (!safari) return null

  // Helper para parsear campos que pueden venir como strings JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseField = (field: any): any => {
    if (!field) return field
    if (typeof field === "string") {
      try {
        return JSON.parse(field)
      } catch {
        return field
      }
    }
    return field
  }
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: getLocalizedContent(safari.title, locale),
    description:
      getLocalizedContent(safari.overview, locale) ||
      getLocalizedContent(safari.description, locale),
    image: safari.thumbnail || safari.thumbnail_thumb,
    touristType: safari.experienceTypes?.map((e) =>
      typeof e === "string" ? e : e.name
    ),
    itinerary: (() => {
      const parsedItinerary = parseField(safari.itinerary)
      return Array.isArray(parsedItinerary)
        ? parsedItinerary.map((d) => ({
            "@type": "TouristTrip",
            name: getLocalizedContent(d.title, locale),
            description: getLocalizedContent(d.description, locale)
          }))
        : []
    })()
  }
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
