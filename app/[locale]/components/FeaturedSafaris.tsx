"use client"

import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function FeaturedSafaris() {
  const t = useTranslations("featuredSafaris")

  const safaris = t.raw("items") as {
    title: string
    tagline: string
    img: string
    badge: string
    link: string
  }[]

  return (
    <section
      id='featured'
      className='bg-[#1f221b] py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Heading */}
        <div className='text-center mb-12'>
          <h2
            className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f6f3ee]`}>
            {t("title")}
          </h2>
          <p className='mt-3 text-[#f6f3ee]/80 text-lg max-w-2xl mx-auto'>
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {safaris.map((safari) => (
            <a
              key={safari.title}
              href={safari.link}
              className='group relative overflow-hidden rounded-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl'>
              {/* Image */}
              <div className='relative h-80 w-full'>
                <Image
                  src={safari.img}
                  alt={safari.title}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
                {/* Badge */}
                <span className='absolute top-4 left-4 bg-[#e7c6c2] text-[#1f221b] px-3 py-1 rounded-full text-xs font-semibold'>
                  {safari.badge}
                </span>
              </div>
              {/* Text */}
              <div className='absolute bottom-0 p-4'>
                <h3
                  className={`${cormorant.className} text-xl font-semibold text-[#f6f3ee]`}>
                  {safari.title}
                </h3>
                <p className='text-[#f6f3ee]/90 text-sm'>{safari.tagline}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
