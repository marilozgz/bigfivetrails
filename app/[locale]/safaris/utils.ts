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
