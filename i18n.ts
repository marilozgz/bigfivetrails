export const locales = ["en", "es", "de", "fr", "it"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"
