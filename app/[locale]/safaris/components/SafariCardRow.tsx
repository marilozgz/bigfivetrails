"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { formatCurrency, getShimmerDataURL } from "../utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

interface SafariCardRowProps {
  safari: any
}

export default function SafariCardRow({ safari }: SafariCardRowProps) {
  const t = useTranslations("safaris")
  const highlightKeys =
    safari.highlights ??
    (["bigFive", "twiceDailyDrives", "customizableCamp"] as unknown as any[])
  const highlights = highlightKeys.map((key: any) => {
    const highlightKey = typeof key === "object" ? key.name || key : key
    return t(`catalog.highlights.${highlightKey}`)
  })
  const route = safari.route ?? []

  return (
    <article className='relative overflow-hidden rounded-xl border border-[var(--accent-color)]/50 bg-white shadow-sm md:h-[400px] text-[#1f221b]/95'>
      <div className='grid grid-cols-1 md:grid-cols-[1.7fr_2.3fr] h-full'>
        {/* Media: ~half of previous height */}
        <div className='relative min-h-[220px] md:h-full'>
          <Image
            fill
            sizes='(min-width: 1024px) 40vw, 100vw'
            src={safari.thumbnail_thumb || safari.thumbnail}
            alt={safari.thumbnail_alt || safari.title}
            className='object-cover'
            loading='lazy'
            placeholder='blur'
            blurDataURL={getShimmerDataURL(800, 600)}
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
            {highlights.slice(0, 3).map((h: string) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {route.length > 0 && (
            <p className='mb-5 text-sm'>
              {route.map((r: string, i: number) => (
                <span
                  key={`${r}-${i}`}
                  className='inline-flex items-center'>
                  {r}
                  {i < route.length - 1 && <ChevronRight />}
                </span>
              ))}
            </p>
          )}

          <div className='mt-auto'>
            <a
              href={`/safaris/${safari.code}`}
              className='inline-flex w-full items-center justify-center rounded-md bg-[var(--green)] px-4 py-3 text-sm font-extrabold tracking-wide text-white hover:brightness-110 transition-colors'>
              {t("card.viewTrip")}
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

/** ---------------- Tiny inline icons ---------------- */
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
