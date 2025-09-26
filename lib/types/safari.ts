export interface SafariExperienceType {
  name: string
}

export interface SafariHighlight {
  name: string
}

export interface ItineraryDay {
  day: number
  title: string
  description?: string
  accommodation?: string | { name: string }
  meals?: string[]
  activities?: string[]
}

export interface Safari {
  id: string
  code: string
  title: string
  overview?: string
  description?: string
  location?: string
  durationDays?: number
  priceFrom?: number
  experienceTypes?: (string | SafariExperienceType)[]
  highlights?: (string | SafariHighlight)[]
  route?: string[]
  thumbnail: string
  // URL de miniatura opcional
  thumbnail_thumb?: string
  popular?: boolean
  images?: string[]
  itinerary?: ItineraryDay[]
  maxGroupSize?: number
  accommodation?: string
  transportation?: string
  bestTime?: string
  difficulty?: string
  // SEO opcional
  seo_title?: string
  seo_description?: string
  og_image?: string
}
