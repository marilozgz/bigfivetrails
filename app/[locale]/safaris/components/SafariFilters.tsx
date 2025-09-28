"use client"

import { getLocalizedContent, Safari } from "@/lib/types/safari"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

interface SafariFiltersProps {
  safaris: Safari[]
  onFilteredSafaris: (filtered: Safari[]) => void
  initialLocation?: string
  initialSearch?: string
  initialPriceMin?: string
  initialPriceMax?: string
  initialDurationMin?: string
  initialDurationMax?: string
  registerClearAll?: (clearFn: () => void) => void
  onFiltersChange?: (filters: FilterState) => void
  locale: string
}

interface FilterState {
  search: string
  location: string
  experience: string[]
  durationMin: string
  durationMax: string
  priceMin: string
  priceMax: string
}

export default function SafariFilters({
  safaris,
  onFilteredSafaris,
  initialLocation,
  initialSearch,
  initialPriceMin,
  initialPriceMax,
  initialDurationMin,
  initialDurationMax,
  registerClearAll,
  onFiltersChange,
  locale
}: SafariFiltersProps) {
  const t = useTranslations("safaris")

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch || "",
    location: initialLocation || "",
    experience: [],
    durationMin: initialDurationMin || "",
    durationMax: initialDurationMax || "",
    priceMin: initialPriceMin || "",
    priceMax: initialPriceMax || ""
  })

  const [isOpen, setIsOpen] = useState(false)

  // Obtener valores únicos para los filtros
  const uniqueLocations = [
    ...new Set(safaris.map((s) => s.location).filter(Boolean))
  ].sort()
  const uniqueExperiences = [
    ...new Set(safaris.flatMap((s) => s.experienceTypes || []))
  ].sort()

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...safaris]

    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (safari) =>
          getLocalizedContent(safari.title, locale)
            .toLowerCase()
            .includes(searchLower) ||
          getLocalizedContent(safari.overview, locale)
            .toLowerCase()
            .includes(searchLower) ||
          safari.location?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro de ubicación
    if (filters.location) {
      filtered = filtered.filter(
        (safari) => safari.location === filters.location
      )
    }

    // Filtro de experiencia
    if (filters.experience.length > 0) {
      filtered = filtered.filter((safari) =>
        safari.experienceTypes?.some((exp) => {
          const expKey = typeof exp === "object" ? exp.name : exp
          return (
            typeof expKey === "string" && filters.experience.includes(expKey)
          )
        })
      )
    }

    // Filtro de duración
    if (filters.durationMin) {
      const min = parseInt(filters.durationMin)
      filtered = filtered.filter((safari) => (safari.durationDays || 0) >= min)
    }
    if (filters.durationMax) {
      const max = parseInt(filters.durationMax)
      filtered = filtered.filter((safari) => (safari.durationDays || 0) <= max)
    }

    // Filtro de precio
    if (filters.priceMin) {
      const min = parseInt(filters.priceMin)
      filtered = filtered.filter((safari) => (safari.priceFrom || 0) >= min)
    }
    if (filters.priceMax) {
      const max = parseInt(filters.priceMax)
      filtered = filtered.filter((safari) => (safari.priceFrom || 0) <= max)
    }

    onFilteredSafaris(filtered)
    onFiltersChange?.(filters)
  }, [filters, safaris, onFilteredSafaris])

  const handleExperienceToggle = (exp: string) => {
    setFilters((prev) => ({
      ...prev,
      experience: prev.experience.includes(exp)
        ? prev.experience.filter((e) => e !== exp)
        : [...prev.experience, exp]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      location: "",
      experience: [],
      durationMin: "",
      durationMax: "",
      priceMin: "",
      priceMax: ""
    })
  }

  useEffect(() => {
    if (registerClearAll) registerClearAll(clearAllFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className='lg:hidden mb-4'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.172a1 1 0 01-.628.928l-4 1.5a1 1 0 01-1.372-.928v-5.672a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
          {t("filters.title")}
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        className={`
        ${isOpen ? "block" : "hidden"} lg:block
        lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit
      `}>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {t("filters.title")}
          </h3>
          <button
            onClick={clearAllFilters}
            className='text-sm text-[#c6b892] hover:text-[#b8a87d] font-medium'>
            {t("filters.clear")}
          </button>
        </div>

        <div className='space-y-6'>
          {/* Search */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t("filters.search.label")}
            </label>
            <input
              type='text'
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder={t("filters.search.placeholder")}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'
            />
          </div>

          {/* Location */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t("filters.location")}
            </label>
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'>
              <option value=''>{t("filters.location")}</option>
              {uniqueLocations.map((location) => (
                <option
                  key={location || "unknown"}
                  value={location || ""}>
                  {location || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Types */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t("filters.experience")}
            </label>
            <div className='space-y-2'>
              {uniqueExperiences.map((exp) => {
                const expKey = typeof exp === "object" ? exp.name : exp
                return (
                  <label
                    key={expKey || "unknown"}
                    className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={
                        typeof expKey === "string" &&
                        filters.experience.includes(expKey)
                      }
                      onChange={() =>
                        typeof expKey === "string" &&
                        handleExperienceToggle(expKey)
                      }
                      className='rounded border-gray-300 text-[#c6b892] focus:ring-[#c6b892]'
                    />
                    <span className='ml-2 text-sm text-gray-700'>
                      {t(`catalog.experienceTypes.${expKey}`, {
                        defaultValue: expKey
                      })}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t("filters.duration")}
            </label>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='number'
                  value={filters.durationMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      durationMin: e.target.value
                    }))
                  }
                  placeholder={t("filters.min")}
                  min='1'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'
                />
              </div>
              <span className='text-gray-500 self-center'>-</span>
              <div className='flex-1'>
                <input
                  type='number'
                  value={filters.durationMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      durationMax: e.target.value
                    }))
                  }
                  placeholder={t("filters.max")}
                  min='1'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {t("filters.priceRange")}
            </label>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='number'
                  value={filters.priceMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMin: e.target.value
                    }))
                  }
                  placeholder={t("filters.min")}
                  min='0'
                  step='100'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'
                />
              </div>
              <span className='text-gray-500 self-center'>-</span>
              <div className='flex-1'>
                <input
                  type='number'
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMax: e.target.value
                    }))
                  }
                  placeholder={t("filters.max")}
                  min='0'
                  step='100'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892] focus:border-transparent'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
