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
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: safari.title,
    description: safari.overview || safari.description,
    image: safari.thumbnail || safari.thumbnail_thumb,
    touristType: safari.experienceTypes?.map((e) =>
      typeof e === "string" ? e : e.name
    ),
    itinerary: safari.itinerary?.map((d) => ({
      "@type": "TouristTrip",
      name: d.title,
      description: d.description
    }))
  }
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
