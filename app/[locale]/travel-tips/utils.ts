import { createSupabaseServerClient } from "@/lib/supabase/server"

export type TravelTipSection =
  | "visas"
  | "health"
  | "money"
  | "luggage"
  | "tipping"

type TravelTipRow = {
  [key: string]: unknown
  cta_href?: string
}

export async function getTravelTips(
  country: string,
  section: TravelTipSection,
  locale: string
) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("travel_tips")
    .select(
      "*, cta_href, cta_label_es, cta_label_en, cta_label_fr, cta_label_it, cta_label_de"
    )
    .eq("country", country)
    .eq("section", section)
    .maybeSingle()

  if (error) {
    console.error("Error fetching travel tips:", error.message)
    return null
  }

  if (!data) return null

  const row = data as TravelTipRow
  const title =
    (row[`title_${locale}` as keyof TravelTipRow] as string) ||
    (row[`title_en`] as string) ||
    (row[`title_es`] as string)
  const intro =
    (row[`intro_${locale}` as keyof TravelTipRow] as string) ||
    (row[`intro_en`] as string) ||
    (row[`intro_es`] as string)
  const items =
    (row[`items_${locale}` as keyof TravelTipRow] as unknown as string[]) ||
    (row[`items_en`] as unknown as string[]) ||
    []
  const cta_label =
    (row[`cta_label_${locale}` as keyof TravelTipRow] as string) ||
    (row[`cta_label_en`] as string) ||
    null
  const cta_href = row.cta_href || null

  return { title, intro, items, cta_label, cta_href }
}
