import { routing } from "@/routing"

export default async function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.bigfivetrails.com"
  const locales = routing.locales || ["en", "es"]
  const routes = ["", "/safaris", "/contact"]
  const entries = [] as {
    url: string
    lastModified: string
    alternates?: { languages: Record<string, string> }
  }[]
  const lastModified = new Date().toISOString()
  for (const path of routes) {
    const languages: Record<string, string> = {}
    for (const l of locales) {
      languages[l] = `${base}/${l}${path}`
    }
    entries.push({
      url: `${base}/${locales[0]}${path}`,
      lastModified,
      alternates: { languages }
    })
  }
  return entries
}
