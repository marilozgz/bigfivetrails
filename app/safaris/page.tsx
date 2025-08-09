/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { useMemo, useState } from "react"

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
  experienceTypes: string[]
  priceFrom: number
  thumbnail: string
  popular?: boolean
  highlights?: string[]
  route?: string[]
}

const SAFARIS: Safari[] = [
  {
    id: "tz-001",
    title: "Serengeti Classic",
    location: "Tanzania",
    durationDays: 7,
    experienceTypes: ["Lodge", "Photographic"],
    priceFrom: 2450,
    popular: true,
    thumbnail: "/images/safaris/safariclassic.jpg",
    highlights: [
      "Big Five Encounters",
      "Private driver‑guide",
      "Great for first‑timers"
    ],
    route: ["Arusha", "Tarangire", "Central Serengeti", "Ngorongoro"]
  },
  {
    id: "ke-002",
    title: "Masai Mara Express",
    location: "Kenya",
    durationDays: 4,
    experienceTypes: ["Lodge", "Small Group"],
    priceFrom: 1190,
    thumbnail: "/images/safaris/masaimara.jpg",
    highlights: [
      "Game drives twice a day",
      "Mara River view",
      "Budget friendly"
    ],
    route: ["Nairobi", "Masai Mara"]
  },
  {
    id: "tz-003",
    title: "Kilimanjaro Adventure + Safari",
    location: "Tanzania",
    durationDays: 10,
    experienceTypes: ["Adventure", "Camping"],
    priceFrom: 3290,
    thumbnail: "/images/safaris/kilimanjaro.jpg",
    highlights: [
      "Kili foothills hike",
      "Night in the bush",
      "Customizable camp setup"
    ],
    route: ["Arusha", "Manyara", "Serengeti", "Ngorongoro"]
  }
]

/** ---------------- Utils ---------------- */
const currency = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(
    n
  )

function useUnique<T extends keyof Safari>(list: Safari[], key: T) {
  return useMemo(
    () => Array.from(new Set(list.map((s) => String(s[key])))).sort(),
    [list, key]
  )
}

type SortKey =
  | "popularity"
  | "priceAsc"
  | "priceDesc"
  | "durationAsc"
  | "durationDesc"

function sortSafaris(list: Safari[], key: SortKey) {
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
      // popularity => keep original/mock order
      return arr
  }
}

/** ---------------- Page ---------------- */
export default function DestinationsPage() {
  // Filters
  const [query, setQuery] = useState("")
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
  const locations = useUnique(SAFARIS, "location")
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
      const matchesQuery = query
        ? [s.title, s.location, s.experienceTypes.join(" ")]
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
  }, [query, selectedLocations, selectedExperiences, minDays, maxDays])

  const sorted = useMemo(
    () => sortSafaris(filtered, sortKey),
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
      {/* Spacer to avoid fixed header overlap (adjust to your header heights) */}
      <div className='h-16 md:h-[96px]' />

      <section className='mx-auto max-w-7xl '>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* ---------- Left: Refine sidebar (professional look) ---------- */}
          <aside
            className={`w-full md:w-72 bg-transparent md:border-r md:border-[var(--accent-color)]/20 p-0 md:pr-6`}>
            <header className='mb-4 flex items-center justify-between'>
              <h2 className='text-base font-semibold tracking-wide'>
                Refine results
              </h2>
              <button
                className='text-xs underline underline-offset-4 hover:opacity-80 hover:text-[#1f221b]'
                onClick={clearAll}
                aria-label='Clear all filters'>
                Clear all
              </button>
            </header>

            {/* Search */}
            <div className='mb-5'>
              <label className='mb-1 block text-xs font-medium opacity-80'>
                Search
              </label>
              <div className='relative'>
                <input
                  className='w-full rounded-lg border border-[var(--gold)]/50 bg-white px-3 py-2 text-sm placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40'
                  placeholder='Search safaris...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60'>
                  <SearchIcon />
                </div>
              </div>
            </div>

            {/* Locations */}
            <Fieldset title='Location'>
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
            <Fieldset title='Experience'>
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
                      <span>{exp}</span>
                    </label>
                  )
                })}
              </div>
            </Fieldset>

            {/* Duration */}
            <Fieldset title='Duration (days)'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='mb-1 block text-xs opacity-70'>Min</label>
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
                  <label className='mb-1 block text-xs opacity-70'>Max</label>
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
                Active filters
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
                  !query && <span className='text-xs opacity-50'>None</span>}
              </div>
            </div>
          </aside>

          {/* ---------- Right: Results & cards (scroll) ---------- */}
          <main className='flex-1 overflow-visible pr-0 md:pl-6'>
            {/* Top bar */}
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm'>
                <span className='font-semibold'>{sorted.length}</span> results
                {query ? (
                  <>
                    {" "}
                    for <span className='font-semibold'>“{query}”</span>
                  </>
                ) : null}
              </p>

              <label className='flex items-center gap-2 text-sm'>
                <span className='opacity-80'>Sort by:</span>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className={`rounded-md border border-[var(--accent-color)]/50 bg-white px-2 py-1 text-sm ${cormorant.className} hover:text-[#1f221b]`}>
                  <option value='popularity'>Popularity</option>
                  <option value='priceAsc'>Price (low → high)</option>
                  <option value='priceDesc'>Price (high → low)</option>
                  <option value='durationAsc'>Duration (short → long)</option>
                  <option value='durationDesc'>Duration (long → short)</option>
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
                <p className='text-sm opacity-70'>
                  No safaris match your filters.
                </p>
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
  const highlights = safari.highlights ?? [
    "Expert local guide",
    "Daily game drives",
    "Flexible departures"
  ]
  const route = safari.route ?? []

  return (
    <article className='relative overflow-hidden rounded-xl border border-[var(--accent-color)]/50 bg-white shadow-sm h-[400px] text-[#1f221b]/95'>
      <div className='grid grid-cols-1 md:grid-cols-[1.7fr_2.3fr] h-full'>
        {/* Media: ~half of previous height */}
        <div className='relative h-full min-h-[260px]'>
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
              Popular
            </span>
          )}
        </div>

        {/* Content */}
        <div className='relative bg-white h-full p-6 md:p-8 pt-24 md:pt-28 flex flex-col text-[#1f221b]/95'>
          {/* Price badge */}
          <div className='absolute right-0 top-0'>
            <div className='relative translate-x-2 -translate-y-2'>
              <div className='rounded-bl-3xl bg-[var(--terra)] px-6 py-5 text-right text-white shadow-md min-w-[150px]'>
                <div className='text-xs md:text-sm uppercase tracking-widest opacity-90'>
                  From
                </div>
                <div className='text-2xl md:text-3xl font-extrabold leading-none'>
                  {currency(safari.priceFrom)}
                </div>
              </div>
            </div>
          </div>

          <h3
            className={`mb-4 ${cormorant.className} text-2xl md:text-3xl font-semibold tracking-wide text-[#1f221b]`}>
            {safari.durationDays} DAYS • {safari.title.toUpperCase()}
          </h3>

          <ul className='mb-4 list-disc pl-5 text-sm leading-6'>
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
              VIEW THIS TRIP
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
