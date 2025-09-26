/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useTranslations } from "next-intl"
import { useEffect, useMemo, useState } from "react"
import { getTravelTips } from "./utils"

type DestinationKey = "tanzania" | "kenya"
type SectionKey = "visas" | "health" | "money" | "luggage" | "tipping"

export default function TravelTipsContent() {
  const t = useTranslations("travelRecommendations")
  const options: Array<{ key: DestinationKey; label: string; icon: string }> = [
    { key: "tanzania", label: t("tanzania.title"), icon: "🌍" },
    { key: "kenya", label: t("kenya.title"), icon: "🦒" }
  ]

  const [selected, setSelected] = useState<DestinationKey>("tanzania")
  const [section, setSection] = useState<SectionKey>("visas")
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null)
  const [dynamicIntro, setDynamicIntro] = useState<string | null>(null)
  const [dynamicItems, setDynamicItems] = useState<string[] | null>(null)
  const [dynamicCta, setDynamicCta] = useState<{
    label: string
    href: string
  } | null>(null)

  // Lee ?country=tanzania|kenya para selección inicial
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const country = params.get("country")?.toLowerCase()
    if (country === "tanzania" || country === "kenya") {
      setSelected(country)
    }
    const s = params.get("section")?.toLowerCase()
    if (
      s === "visas" ||
      s === "health" ||
      s === "money" ||
      s === "luggage" ||
      s === "tipping"
    ) {
      setSection(s)
    }
  }, [])

  // Sincroniza en URL (replaceState) para compartir
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("country", selected)
    params.set("section", section)
    const query = params.toString()
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }, [selected, section])

  const contentItems: string[] = useMemo(() => {
    const data = t.raw(`${selected}.sections.${section}`)
    if (Array.isArray(data)) return data as string[]
    return (t.raw(`${selected}.tips`) as string[]) || []
  }, [selected, section, t])

  // Fetch dinámico desde Supabase
  useEffect(() => {
    ;(async () => {
      try {
        const locale = document.documentElement.lang || "en"
        const data = await getTravelTips(selected, section, locale)
        if (data) {
          setDynamicTitle(data.title || null)
          setDynamicIntro(data.intro || null)
          setDynamicItems(Array.isArray(data.items) ? data.items : null)
          setDynamicCta(
            data.cta_label && data.cta_href
              ? { label: data.cta_label, href: data.cta_href }
              : null
          )
        } else {
          setDynamicTitle(null)
          setDynamicIntro(null)
          setDynamicItems(null)
          setDynamicCta(null)
        }
      } catch (e) {
        setDynamicTitle(null)
        setDynamicIntro(null)
        setDynamicItems(null)
        setDynamicCta(null)
      }
    })()
  }, [selected, section])

  const intro: string = useMemo(() => t(`${selected}.intro`), [selected, t])
  const link = useMemo(
    () =>
      t.raw(`${selected}.link`) as undefined | { label: string; href: string },
    [selected, t]
  )

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6'>
      {/* Sidebar selector */}
      <aside className='bg-white rounded-xl border border-[#c6b892]/30 p-4 h-fit'>
        <h3 className='text-sm font-semibold text-gray-900 mb-3'>
          {t("title")}
        </h3>
        <div className='space-y-2'>
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`w-full text-left px-3 py-2 rounded-md border transition ${
                selected === opt.key
                  ? "bg-[#f3efe5] border-[#c6b892] text-[#1f221b]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#c6b892]/50"
              }`}>
              <span
                className='mr-2'
                aria-hidden>
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <section className='bg-white rounded-xl border border-[#c6b892]/30 p-6 shadow-sm'>
        <div className='flex items-center gap-3 mb-3'>
          <span
            className='text-2xl'
            aria-hidden>
            {options.find((o) => o.key === selected)?.icon}
          </span>
          <h2 className='text-2xl font-semibold'>
            {dynamicTitle || t(`${selected}.title`)}
          </h2>
        </div>
        <p className='text-gray-700 mb-5'>{dynamicIntro || intro}</p>

        <div className='mb-5 flex flex-wrap gap-2'>
          {(
            ["visas", "health", "money", "luggage", "tipping"] as SectionKey[]
          ).map((key) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${
                section === key
                  ? "bg-[#f3efe5] border-[#c6b892] text-[#1f221b]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#c6b892]/50"
              }`}>
              {t(`sections.labels.${key}` as any)}
            </button>
          ))}
        </div>

        <ul className='list-disc pl-5 space-y-2 text-gray-800'>
          {(dynamicItems || contentItems).map((item, i) => (
            <li key={`${selected}-${section}-${i}`}>{item}</li>
          ))}
        </ul>

        {(dynamicCta || (link && link.href && link.label)) && (
          <div className='mt-6'>
            <a
              href={(dynamicCta?.href || link?.href) as string}
              className='inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md border border-[#c6b892] text-[#c6b892] hover:bg-[#c6b892] hover:text-white'>
              {(dynamicCta?.label || link?.label) as string}
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
