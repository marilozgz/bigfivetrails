/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { useMemo, useState } from "react"
import {
  formatCurrency,
  sortByKey,
  type SortKey,
  useUniqueByKey
} from "./utils"

/** ---------------- Palette ---------------- */
const COLORS = {
  pink: "var(--secondary-color)",
  beige: "var(--primary-background)",
  dark: "var(--dark-olive-green)",
  gold: "#c6b892",
  green: "#4c692f",
  terracotta: "#c54e2c"
}

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

/** ---------------- Types & Mock ---------------- */
interface Safari {
  id: string
  title: string
  location: string
  durationDays: number
  experienceTypes: ExperienceTypeKey[]
  priceFrom: number
  thumbnail: string
  popular?: boolean
  highlights?: HighlightKey[]
  route?: string[]
}

type ExperienceTypeKey =
  | "lodge"
  | "photographic"
  | "smallGroup"
  | "adventure"
  | "camping"

type HighlightKey =
  | "bigFive"
  | "privateGuide"
  | "greatFirstTimers"
  | "twiceDailyDrives"
  | "maraRiverView"
  | "budgetFriendly"
  | "kiliFoothills"
  | "nightInBush"
  | "customizableCamp"

const SAFARIS: Safari[] = [
  {
    id: "tz-001",
    title: "Serengeti Classic",
    location: "Tanzania",
    durationDays: 7,
    experienceTypes: ["lodge", "photographic"],
    priceFrom: 2450,
    popular: true,
    thumbnail: "/images/safaris/safariclassic.jpg",
    highlights: ["bigFive", "privateGuide", "greatFirstTimers"],
    route: ["Arusha", "Tarangire", "Central Serengeti", "Ngorongoro"]
  },
  {
    id: "ke-002",
    title: "Masai Mara Express",
    location: "Kenya",
    durationDays: 4,
    experienceTypes: ["lodge", "smallGroup"],
    priceFrom: 1190,
    thumbnail: "/images/safaris/masaimara.jpg",
    highlights: ["twiceDailyDrives", "maraRiverView", "budgetFriendly"],
    route: ["Nairobi", "Masai Mara"]
  },
  {
    id: "tz-003",
    title: "Kilimanjaro Adventure + Safari",
    location: "Tanzania",
    durationDays: 10,
    experienceTypes: ["adventure", "camping"],
    priceFrom: 3290,
    thumbnail: "/images/safaris/kilimanjaro.jpg",
    highlights: ["kiliFoothills", "nightInBush", "customizableCamp"],
    route: ["Arusha", "Manyara", "Serengeti", "Ngorongoro"]
  }
]

/** ---------------- i18n helpers (moved utils to ./utils) ---------------- */

/** ---------------- Page ---------------- */
export default function DestinationsPage() {
  const t = useTranslations("safaris")
  // Filters
  const [query, setQuery] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(
    new Set()
  )
  const [selectedExperiences, setSelectedExperiences] = useState<Set<string>>(
    new Set()
  )
  const durations = SAFARIS.map((s) => s.durationDays)
  const minDuration = Math.min(...durations)
  const maxDuration = Math.max(...durations)
  const [minDays, setMinDays] = useState(minDuration)
  const [maxDays, setMaxDays] = useState(maxDuration)

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>("popularity")

  // Options
  const locations = useUniqueByKey(SAFARIS, "location")
  const experiences = useMemo(
    () => Array.from(new Set(SAFARIS.flatMap((s) => s.experienceTypes))).sort(),
    []
  )

  // Counts per location (for nicer sidebar)
  const locationCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of SAFARIS) m.set(s.location, (m.get(s.location) || 0) + 1)
    return m
  }, [])

  // Filter logic
  const filtered = useMemo(() => {
    return SAFARIS.filter((s) => {
      const expLabels = s.experienceTypes
        .map((k) => t(`catalog.experienceTypes.${k}`))
        .join(" ")
      const matchesQuery = query
        ? [s.title, s.location, expLabels]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true

      const matchesLocation = selectedLocations.size
        ? selectedLocations.has(s.location)
        : true
      const matchesExperience = selectedExperiences.size
        ? s.experienceTypes.some((t) => selectedExperiences.has(t))
        : true
      const matchesDuration =
        s.durationDays >= minDays && s.durationDays <= maxDays

      return (
        matchesQuery && matchesLocation && matchesExperience && matchesDuration
      )
    })
  }, [query, selectedLocations, selectedExperiences, minDays, maxDays, t])

  const sorted = useMemo(
    () => sortByKey(filtered, sortKey),
    [filtered, sortKey]
  )

  // Helpers
  const clearAll = () => {
    setQuery("")
    setSelectedLocations(new Set())
    setSelectedExperiences(new Set())
    setMinDays(minDuration)
    setMaxDays(maxDuration)
    setSortKey("popularity")
  }

  const removeChip = (type: "location" | "experience", value: string) => {
    if (type === "location") {
      const next = new Set(selectedLocations)
      next.delete(value)
      setSelectedLocations(next)
    } else {
      const next = new Set(selectedExperiences)
      next.delete(value)
      setSelectedExperiences(next)
    }
  }

  return (
    <div
      className={`min-h-dvh bg-[var(--primary-background)] text-[#1f221b]/95 ${cormorant.className}`}
      style={{
        // expose palette as CSS vars so we can use via var() in className strings if needed
        // without tailwind config changes
        ["--pink" as any]: COLORS.pink,
        ["--beige" as any]: COLORS.beige,
        ["--dark" as any]: COLORS.dark,
        ["--gold" as any]: COLORS.gold,
        ["--green" as any]: COLORS.green,
        ["--terra" as any]: COLORS.terracotta
      }}>
      {/* Mini-hero ya maneja el espacio bajo el header en layout */}

      <section className='mx-auto max-w-7xl '>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* ---------- Left: Refine sidebar (professional look) ---------- */}
          {/* Mobile toggle */}
          <div className='md:hidden mb-2 flex items-center justify-between px-4'>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className='rounded-md border border-[var(--gold)]/50 px-3 py-2 text-sm font-semibold text-[#1f221b] bg-white'>
              {t("filters.title")}
            </button>
            <button
              onClick={clearAll}
              className='text-xs underline underline-offset-4'>
              {t("filters.clear")}
            </button>
          </div>

          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } md:block w-full md:w-72 bg-transparent md:border-r md:border-[var(--accent-color)]/20 px-4 md:px-0 md:pr-6`}>
            <header className='mb-4 flex items-center justify-between'>
              <h2 className='text-base font-semibold tracking-wide'>
                {t("filters.title")}
              </h2>
              <button
                className='text-xs underline underline-offset-4 hover:opacity-80 hover:text-[#1f221b]'
                onClick={clearAll}
                aria-label='Clear all filters'>
                {t("filters.clear")}
              </button>
            </header>

            {/* Search */}
            <div className='mb-5'>
              <label className='mb-1 block text-xs font-medium opacity-80'>
                {t("filters.search.label")}
              </label>
              <div className='relative'>
                <input
                  className='w-full rounded-lg border border-[var(--gold)]/50 bg-white px-3 py-2 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40'
                  placeholder={t("filters.search.placeholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60'>
                  <SearchIcon />
                </div>
              </div>
            </div>

            {/* Locations */}
            <Fieldset title={t("filters.location")}>
              <div className='space-y-2'>
                {locations.map((loc) => {
                  const checked = selectedLocations.has(loc)
                  return (
                    <label
                      key={loc}
                      className='flex items-center justify-between gap-2 text-sm'>
                      <span className='inline-flex items-center gap-2'>
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-[var(--gold)]/60 text-[var(--dark)] accent-[var(--gold)]'
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(selectedLocations)
                            if (e.target.checked) {
                              next.add(loc)
                            } else {
                              next.delete(loc)
                            }
                            setSelectedLocations(next)
                          }}
                        />
                        <span>{loc}</span>
                      </span>
                      <span className='text-xs opacity-60'>
                        {locationCounts.get(loc) ?? 0}
                      </span>
                    </label>
                  )
                })}
              </div>
            </Fieldset>

            {/* Experience */}
            <Fieldset title={t("filters.experience")}>
              <div className='space-y-2'>
                {experiences.map((exp) => {
                  const checked = selectedExperiences.has(exp)
                  return (
                    <label
                      key={exp}
                      className='flex items-center gap-2 text-sm'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 rounded border-[var(--gold)]/60 accent-[var(--gold)]'
                        checked={checked}
                        onChange={(e) => {
                          const next = new Set(selectedExperiences)
                          if (e.target.checked) {
                            next.add(exp)
                          } else {
                            next.delete(exp)
                          }
                          setSelectedExperiences(next)
                        }}
                      />
                      <span>{t(`catalog.experienceTypes.${exp}`)}</span>
                    </label>
                  )
                })}
              </div>
            </Fieldset>

            {/* Duration */}
            <Fieldset title={t("filters.duration")}>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='mb-1 block text-xs opacity-70'>
                    {t("filters.min")}
                  </label>
                  <input
                    type='number'
                    className='w-full rounded-lg border border-[var(--gold)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40'
                    min={minDuration}
                    max={maxDays}
                    value={minDays}
                    onChange={(e) => {
                      const v = Number(e.target.value || minDuration)
                      setMinDays(Math.min(Math.max(v, minDuration), maxDays))
                    }}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-xs opacity-70'>
                    {t("filters.max")}
                  </label>
                  <input
                    type='number'
                    className='w-full rounded-lg border border-[var(--gold)]/50 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40'
                    min={minDays}
                    max={maxDuration}
                    value={maxDays}
                    onChange={(e) => {
                      const v = Number(e.target.value || maxDuration)
                      setMaxDays(Math.max(Math.min(v, maxDuration), minDays))
                    }}
                  />
                </div>
              </div>
            </Fieldset>

            {/* Active chips */}
            <div className='mt-4'>
              <p className='text-xs font-medium opacity-80 mb-2'>
                {t("filters.active")}
              </p>
              <div className='flex flex-wrap gap-2'>
                {Array.from(selectedLocations).map((loc) => (
                  <Chip
                    key={`loc-${loc}`}
                    onRemove={() => removeChip("location", loc)}>
                    {loc}
                  </Chip>
                ))}
                {Array.from(selectedExperiences).map((exp) => (
                  <Chip
                    key={`exp-${exp}`}
                    onRemove={() => removeChip("experience", exp)}>
                    {exp}
                  </Chip>
                ))}
                {!selectedLocations.size &&
                  !selectedExperiences.size &&
                  !query && (
                    <span className='text-xs opacity-50'>
                      {t("filters.none")}
                    </span>
                  )}
              </div>
            </div>
          </aside>

          {/* ---------- Right: Results & cards (scroll) ---------- */}
          <main className='flex-1 overflow-visible px-4 md:px-0 md:pl-6'>
            {/* Top bar */}
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm'>
                {query ? (
                  <>
                    {t("results.countFor", {
                      count: sorted.length,
                      query
                    })}
                  </>
                ) : (
                  t("results.count", { count: sorted.length })
                )}
              </p>

              <label className='flex items-center gap-2 text-sm'>
                <span className='opacity-80'>{t("sort.label")}</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className={`rounded-md border border-[var(--accent-color)]/50 bg-white px-2 py-1 text-sm ${cormorant.className} hover:text-[#1f221b]`}>
                  <option value='popularity'>{t("sort.popularity")}</option>
                  <option value='priceAsc'>{t("sort.priceAsc")}</option>
                  <option value='priceDesc'>{t("sort.priceDesc")}</option>
                  <option value='durationAsc'>{t("sort.durationAsc")}</option>
                  <option value='durationDesc'>{t("sort.durationDesc")}</option>
                </select>
              </label>
            </div>

            {/* Cards */}
            <div className='grid grid-cols-1 gap-5'>
              {sorted.map((s) => (
                <SafariCardRow
                  key={s.id}
                  safari={s}
                />
              ))}
              {sorted.length === 0 && (
                <p className='text-sm opacity-70'>{t("results.empty")}</p>
              )}
            </div>

            <div className='h-6' />
          </main>
        </div>
      </section>
    </div>
  )
}

/** ---------------- Reusable bits ---------------- */
function Fieldset({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='mb-5'>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>{title}</h3>
        <span className='h-px flex-1 ml-3 bg-[var(--gold)]/40' />
      </div>
      {children}
    </div>
  )
}

function Chip({
  children,
  onRemove
}: {
  children: React.ReactNode
  onRemove: () => void
}) {
  return (
    <span className='inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/60 bg-white/80 px-3 py-1 text-xs'>
      {children}
      <button
        aria-label='Remove filter'
        className='rounded-full border border-[var(--gold)]/50 p-0.5 hover:bg-[var(--gold)]/20'
        onClick={onRemove}>
        <CloseIcon />
      </button>
    </span>
  )
}

function SafariCardRow({ safari }: { safari: Safari }) {
  const t = useTranslations("safaris")
  const highlightKeys =
    safari.highlights ??
    ([
      "bigFive",
      "twiceDailyDrives",
      "customizableCamp"
    ] as unknown as HighlightKey[])
  const highlights = highlightKeys.map((key) => t(`catalog.highlights.${key}`))
  const route = safari.route ?? []

  return (
    <article className='relative overflow-hidden rounded-xl border border-[var(--accent-color)]/50 bg-white shadow-sm md:h-[400px] text-[#1f221b]/95'>
      <div className='grid grid-cols-1 md:grid-cols-[1.7fr_2.3fr] h-full'>
        {/* Media: ~half of previous height */}
        <div className='relative min-h-[220px] md:h-full'>
          <Image
            fill
            sizes='(min-width: 1024px) 40vw, 100vw'
            src={safari.thumbnail}
            alt={safari.title}
            className='object-cover'
            loading='lazy'
          />
          {safari.popular && (
            <span className='absolute left-3 top-3 rounded-md bg-[#e9f0e4] px-2 py-1 text-xs font-semibold text-[#2e4e1f] shadow'>
              {t("card.popular")}
            </span>
          )}
          {/* Price badge overlay (mobile) */}
          <div className='absolute right-0 top-0 md:hidden'>
            <div className='rounded-bl-3xl bg-[var(--terra)] px-4 py-2 text-right text-white shadow-md'>
              <div className='text-xs uppercase tracking-widest opacity-90'>
                {t("card.from")}
              </div>
              <div className='text-xl font-extrabold leading-none'>
                {formatCurrency(safari.priceFrom)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='relative bg-white h-full p-6 md:p-8 pt-4 md:pt-24 flex flex-col text-[#1f221b]/95'>
          {/* Price badge (desktop only) */}
          <div className='hidden md:block md:absolute md:right-0 md:top-0'>
            <div className='relative md:translate-x-2 md:-translate-y-2'>
              <div className='rounded-bl-3xl bg-[var(--terra)] px-6 py-5 text-right text-white shadow-md min-w-[150px]'>
                <div className='text-sm uppercase tracking-widest opacity-90'>
                  {t("card.from")}
                </div>
                <div className='text-3xl font-extrabold leading-none'>
                  {formatCurrency(safari.priceFrom)}
                </div>
              </div>
            </div>
          </div>

          <h3
            className={`mb-2 ${cormorant.className} text-lg md:text-3xl font-semibold tracking-wide text-[#1f221b] line-clamp-2 md:line-clamp-none`}>
            {safari.durationDays} {t("card.days")} •{" "}
            {safari.title.toUpperCase()}
          </h3>

          <ul className='mb-3 list-disc pl-5 text-sm leading-6 md:mb-4'>
            {highlights.slice(0, 3).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {route.length > 0 && (
            <p className='mb-5 text-sm'>
              {route.map((r, i) => (
                <span
                  key={r}
                  className='inline-flex items-center'>
                  {r}
                  {i < route.length - 1 && <ChevronRight />}
                </span>
              ))}
            </p>
          )}

          <div className='mt-auto'>
            <button className='inline-flex w-full items-center justify-center rounded-md bg-[var(--green)] px-4 py-3 text-sm font-extrabold tracking-wide text-white hover:brightness-110'>
              {t("card.viewTrip")}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** ---------------- Tiny inline icons ---------------- */
function SearchIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden>
      <circle
        cx='11'
        cy='11'
        r='7'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M20 20l-3.5-3.5'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden>
      <path
        d='M6 6l12 12M18 6l-12 12'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      className='mx-2'
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden>
      <path
        d='M9 6l6 6-6 6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
