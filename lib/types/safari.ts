// Tipos para los datos de Strapi
export interface StrapiResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiSingleResponse<T> {
  data: T
  meta: {}
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  accommodation: string
  meals: string[]
  activities: string[]
}

export interface Safari {
  id: number
  documentId: string
  code: string
  title: string
  slug: string | null
  durationDays: number
  priceFrom: number
  popular: boolean
  description: string
  maxGroupSize: number
  accomodation: string
  transportation: string
  bestTime: string
  difficulty: 'easy' | 'moderate' | 'challenging'
  location: string | null
  thumbnail: string | null
  images: string[] | null
  route: string[] | null
  included: string[] | null
  notIncluded: string[] | null
  itinerary: ItineraryDay[] | null
  accommodation: string | null
  experienceTypes: string[] | null
  highlights: string[] | null
  duration: string | null
  client: string | null
  participants: number | null
  price_usd: number | null
  start_point: string | null
  end_point: string | null
  overview: string | null
  excluded: string[] | null
  payment_terms: string[] | null
  operator: {
    name: string
    email: string
    website: string
  } | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface Destination {
  id: number
  documentId: string
  name: string
  code: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface ExperienceType {
  id: number
  documentId: string
  name: string
  code: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}

export interface Highlight {
  id: number
  documentId: string
  name: string
  code: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
}
