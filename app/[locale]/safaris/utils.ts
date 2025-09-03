import { safariService } from '../../../lib/services/strapi'
import { Safari } from '../../../lib/types/safari'

export type SortKey =
  | "popularity"
  | "priceAsc"
  | "priceDesc"
  | "durationAsc"
  | "durationDesc"

export function formatCurrency(
  amount: number,
  locale = "en-GB",
  currency = "EUR"
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  )
}

export function useUniqueByKey<T, K extends keyof T>(
  list: T[],
  key: K
): string[] {
  // Note: this is a simple helper; the hook naming mirrors original usage but has no React state
  return Array.from(new Set(list.map((item) => String(item[key])))).sort()
}

export function sortByKey<
  T extends { priceFrom: number; durationDays: number }
>(list: T[], key: SortKey): T[] {
  const arr = [...list]
  switch (key) {
    case "priceAsc":
      return arr.sort((a, b) => a.priceFrom - b.priceFrom)
    case "priceDesc":
      return arr.sort((a, b) => b.priceFrom - a.priceFrom)
    case "durationAsc":
      return arr.sort((a, b) => a.durationDays - b.durationDays)
    case "durationDesc":
      return arr.sort((a, b) => b.durationDays - a.durationDays)
    default:
      return arr
  }
}

// Función para cargar datos de safaris desde Strapi
export async function getSafarisData(locale: string): Promise<Safari[]> {
  try {
    console.log("🔍 Cargando safaris desde Strapi para locale:", locale)
    
    const safaris = await safariService.getAll(locale)
    
    console.log(`🎯 Safaris cargados desde Strapi: ${safaris.length}`)
    console.log(
      "📊 Safaris:",
      safaris.map((s) => ({ id: s.code, title: s.title }))
    )

    return safaris
  } catch (error) {
    console.error("💥 Error cargando safaris desde Strapi:", error)
    
    // Fallback a datos locales si Strapi no está disponible
    console.log("🔄 Intentando fallback a datos locales...")
    return await getSafarisDataLocal(locale)
  }
}

// Función para obtener un safari específico por código desde Strapi
export async function getSafariData(safariCode: string, locale: string): Promise<Safari | null> {
  try {
    console.log(
      `🔍 getSafariData: Cargando safari ${safariCode} desde Strapi para locale ${locale}`
    )
    
    const safari = await safariService.getByCode(safariCode, locale)
    
    if (safari) {
      console.log(`✅ getSafariData: Safari ${safariCode} cargado desde Strapi`)
      return safari
    } else {
      console.log(`❌ getSafariData: Safari ${safariCode} no encontrado en Strapi`)
      
      // Fallback a datos locales
      console.log("�� Intentando fallback a datos locales...")
      return await getSafariDataLocal(safariCode, locale)
    }
  } catch (error) {
    console.error(`💥 Error cargando safari ${safariCode} desde Strapi:`, error)
    
    // Fallback a datos locales
    console.log("🔄 Intentando fallback a datos locales...")
    return await getSafariDataLocal(safariCode, locale)
  }
}

// Funciones de fallback para datos locales (mantener compatibilidad)
async function getSafarisDataLocal(locale: string): Promise<Safari[]> {
  try {
    console.log("🔍 Fallback: Buscando safaris locales para locale:", locale)

    // Solo cargar safaris que sabemos que existen
    const safariIds = ["ndutu", "serengeti", "maretuniwonder", "pumba"]
    console.log("📋 IDs de safaris locales a buscar:", safariIds)

    const safaris = await Promise.all(
      safariIds.map(async (id) => {
        console.log(`🔍 Intentando cargar safari local: ${id}`)
        try {
          const data = await import(
            `../../../data/safaris/${id}/${id}.${locale}.json`
          )
          console.log(`✅ Safari local ${id} cargado exitosamente`)
          return data.default
        } catch (error) {
          console.log(
            `❌ Error cargando ${id}.${locale}.json:`,
            (error as Error).message
          )
          // Fallback al español si no existe el idioma
          try {
            const fallback = await import(
              `../../../data/safaris/${id}/${id}.es.json`
            )
            console.log(`✅ Safari local ${id} cargado con fallback español`)
            return fallback.default
          } catch (fallbackError) {
            console.warn(
              `❌ No se pudo cargar el safari local ${id}:`,
              (fallbackError as Error).message
            )
            return null
          }
        }
      })
    )

    const validSafaris = safaris.filter(Boolean)
    console.log(`🎯 Safaris locales válidos encontrados: ${validSafaris.length}`)
    
    return validSafaris
  } catch (error) {
    console.error("💥 Error general cargando safaris locales:", error)
    return []
  }
}

async function getSafariDataLocal(safariId: string, locale: string): Promise<Safari | null> {
  try {
    console.log(
      `🔍 getSafariDataLocal: Intentando cargar ${safariId}.${locale}.json`
    )
    const data = await import(
      `../../../data/safaris/${safariId}/${safariId}.${locale}.json`
    )
    console.log(`✅ getSafariDataLocal: Safari ${safariId} cargado exitosamente`)
    return data.default
  } catch (error) {
    console.log(
      `❌ getSafariDataLocal: Error cargando ${safariId}.${locale}.json:`,
      (error as Error).message
    )
    // Fallback al español si no existe el idioma
    try {
      console.log(
        `🔄 getSafariDataLocal: Intentando fallback español para ${safariId}`
      )
      const fallback = await import(
        `../../../data/safaris/${safariId}/${safariId}.es.json`
      )
      console.log(
        `✅ getSafariDataLocal: Safari ${safariId} cargado con fallback español`
      )
      return fallback.default
    } catch (fallbackError) {
      console.error(
        `❌ getSafariDataLocal: No se pudo cargar el safari ${safariId}:`,
        (fallbackError as Error).message
      )
      return null
    }
  }
}
