"use client"

import { Safari } from "@/lib/types/safari"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import SafariCardRow from "./SafariCardRow"
import SafariFilters from "./SafariFilters"

interface SafariFiltersWrapperProps {
  safaris: Safari[]
  locale: string
}

export default function SafariFiltersWrapper({
  safaris,
  locale
}: SafariFiltersWrapperProps) {
  const t = useTranslations("safaris")
  const [filteredSafaris, setFilteredSafaris] = useState<Safari[]>(safaris)
  const [initialLocation, setInitialLocation] = useState<string>("")
  const [initialSearch, setInitialSearch] = useState<string>("")
  const [initialPriceMin, setInitialPriceMin] = useState<string>("")
  const [initialPriceMax, setInitialPriceMax] = useState<string>("")
  const [initialDurationMin, setInitialDurationMin] = useState<string>("")
  const [initialDurationMax, setInitialDurationMax] = useState<string>("")
  const [clearAllFn, setClearAllFn] = useState<(() => void) | null>(null)
  const [currentFilters, setCurrentFilters] = useState({
    search: initialSearch,
    location: initialLocation,
    durationMin: initialDurationMin,
    durationMax: initialDurationMax,
    priceMin: initialPriceMin,
    priceMax: initialPriceMax
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tParam = params.get("t")
    if (tParam) {
      // normaliza valores comunes
      const map: Record<string, string> = {
        tanzania: "Tanzania",
        kenya: "Kenya",
        kenia: "Kenya"
      }
      setInitialLocation(map[tParam.toLowerCase()] || tParam)
    }
    const qParam = params.get("q")
    if (qParam) setInitialSearch(qParam)
    const minParam = params.get("min")
    const maxParam = params.get("max")
    if (minParam && /^\d+$/.test(minParam)) setInitialPriceMin(minParam)
    if (maxParam && /^\d+$/.test(maxParam)) setInitialPriceMax(maxParam)
    const dminParam = params.get("dmin")
    const dmaxParam = params.get("dmax")
    if (dminParam && /^\d+$/.test(dminParam)) setInitialDurationMin(dminParam)
    if (dmaxParam && /^\d+$/.test(dmaxParam)) setInitialDurationMax(dmaxParam)
  }, [])

  // Actualiza la URL sin recargar cuando cambian filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentFilters.location)
      params.set("t", currentFilters.location.toLowerCase())
    if (currentFilters.search) params.set("q", currentFilters.search)
    if (currentFilters.priceMin) params.set("min", currentFilters.priceMin)
    if (currentFilters.priceMax) params.set("max", currentFilters.priceMax)
    if (currentFilters.durationMin)
      params.set("dmin", currentFilters.durationMin)
    if (currentFilters.durationMax)
      params.set("dmax", currentFilters.durationMax)
    const query = params.toString()
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }, [currentFilters])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFiltersChange = useCallback((f: any) => {
    setCurrentFilters({
      search: f.search,
      location: f.location,
      durationMin: f.durationMin,
      durationMax: f.durationMax,
      priceMin: f.priceMin,
      priceMax: f.priceMax
    })
  }, [])

  return (
    <div className='flex flex-col lg:flex-row gap-8'>
      {/* Sidebar con filtros */}
      <div className='lg:w-80 flex-shrink-0'>
        <SafariFilters
          safaris={safaris}
          initialLocation={initialLocation}
          initialSearch={initialSearch}
          initialPriceMin={initialPriceMin}
          initialPriceMax={initialPriceMax}
          initialDurationMin={initialDurationMin}
          initialDurationMax={initialDurationMax}
          registerClearAll={(fn) => setClearAllFn(() => fn)}
          onFiltersChange={handleFiltersChange}
          onFilteredSafaris={setFilteredSafaris}
          locale={locale}
        />
      </div>

      {/* Contenido principal */}
      <div className='flex-1'>
        {/* Top bar */}
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm'>
            {t("results.count", { count: filteredSafaris.length })}
          </p>
          <div className='flex flex-wrap gap-2'>
            {currentFilters.location && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                {currentFilters.location}
              </span>
            )}
            {currentFilters.search && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                “{currentFilters.search}”
              </span>
            )}
            {currentFilters.durationMin && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                {t("filters.min")} {currentFilters.durationMin}d
              </span>
            )}
            {currentFilters.durationMax && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                {t("filters.max")} {currentFilters.durationMax}d
              </span>
            )}
            {currentFilters.priceMin && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                {t("filters.min")} ${currentFilters.priceMin}
              </span>
            )}
            {currentFilters.priceMax && (
              <span className='inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#f3efe5] text-[#1f221b] border border-[#c6b892]/50'>
                {t("filters.max")} ${currentFilters.priceMax}
              </span>
            )}
            {(currentFilters.location ||
              currentFilters.search ||
              currentFilters.durationMin ||
              currentFilters.durationMax ||
              currentFilters.priceMin ||
              currentFilters.priceMax) && (
              <button
                onClick={() => clearAllFn?.()}
                className='text-xs underline text-[#c6b892]'>
                {t("filters.clear")}
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 gap-5'>
          {filteredSafaris.map((s) => (
            <SafariCardRow
              key={s.id}
              safari={s}
              locale={locale}
            />
          ))}
          {filteredSafaris.length === 0 && (
            <p className='text-sm opacity-70'>{t("results.empty")}</p>
          )}
        </div>

        <div className='h-6' />
      </div>
    </div>
  )
}
