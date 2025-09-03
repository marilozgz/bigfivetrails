"use client"

import { Safari } from "@/lib/types/safari"
import { useTranslations } from "next-intl"
import { useState } from "react"
import SafariCardRow from "./SafariCardRow"
import SafariFilters from "./SafariFilters"

interface SafariFiltersWrapperProps {
  safaris: Safari[]
}

export default function SafariFiltersWrapper({
  safaris
}: SafariFiltersWrapperProps) {
  const t = useTranslations("safaris")
  const [filteredSafaris, setFilteredSafaris] = useState<Safari[]>(safaris)

  return (
    <div className='flex flex-col lg:flex-row gap-8'>
      {/* Sidebar con filtros */}
      <div className='lg:w-80 flex-shrink-0'>
        <SafariFilters
          safaris={safaris}
          onFilteredSafaris={setFilteredSafaris}
        />
      </div>

      {/* Contenido principal */}
      <div className='flex-1'>
        {/* Top bar */}
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm'>
            {t("results.count", { count: filteredSafaris.length })}
          </p>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 gap-5'>
          {filteredSafaris.map((s) => (
            <SafariCardRow
              key={s.id}
              safari={s}
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
