export interface SafariExperienceType {
  name: string
}

export interface SafariHighlight {
  name: string
}

export interface ItineraryDay {
  day: number
  title: string | MultiLanguageContent
  description?: string | MultiLanguageContent
  accommodation?: string | MultiLanguageContent | { name: string }
  meals?: string[]
  activities?: string[]
}

// Tipos para contenido multiidioma
export interface MultiLanguageContent {
  en?: string
  es?: string
  de?: string
  fr?: string
  it?: string
}

// Función helper para extraer contenido en el idioma correcto
export function getLocalizedContent(
  content: string | MultiLanguageContent | undefined,
  locale: string,
  fallback?: string
): string {
  if (!content) return fallback || ""

  // Si es un string simple, devolverlo directamente
  if (typeof content === "string") return content

  // Si es un objeto MultiLanguageContent, buscar el idioma específico
  if (typeof content === "object" && content !== null) {
    // Buscar el idioma específico
    if (locale === "fr" && content.fr) return content.fr
    if (locale === "en" && content.en) return content.en
    if (locale === "es" && content.es) return content.es
    if (locale === "de" && content.de) return content.de
    if (locale === "it" && content.it) return content.it

    // Fallback a inglés si existe
    if (content.en) return content.en

    // Fallback a español si existe
    if (content.es) return content.es

    // Fallback al primer idioma disponible
    const availableLanguages = Object.values(content).filter(Boolean)
    if (availableLanguages.length > 0) return availableLanguages[0]
  }

  return fallback || ""
}

export interface Safari {
  id: string
  code: string
  title: string | MultiLanguageContent
  overview?: string | MultiLanguageContent
  description?: string | MultiLanguageContent
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
  accommodation?: string | MultiLanguageContent
  transportation?: string | MultiLanguageContent
  bestTime?: string | MultiLanguageContent
  difficulty?: string | MultiLanguageContent
  // SEO opcional
  seo_title?: string
  seo_description?: string
  og_image?: string
}
