"use client"

import { useTranslations } from "next-intl"

export default function TravelRecommendations() {
  const t = useTranslations("travelRecommendations")

  const items = [
    { key: "tanzania", icon: "🌍" },
    { key: "kenya", icon: "🦒" }
  ] as const

  return (
    <section
      id='travel-recommendations'
      className='max-w-7xl mx-auto px-4 py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-semibold'>{t("title")}</h2>
        <p className='text-gray-600 mt-2'>{t("subtitle")}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {items.map(({ key, icon }) => {
          const link = t.raw(`${key}.link`) as
            | undefined
            | {
                label: string
                href: string
              }
          return (
            <article
              key={key}
              className='bg-white rounded-xl border border-[#c6b892]/30 p-6 shadow-sm'>
              <div className='flex items-center gap-3 mb-3'>
                <span
                  className='text-2xl'
                  aria-hidden>
                  {icon}
                </span>
                <h3 className='text-xl font-semibold'>{t(`${key}.title`)}</h3>
              </div>
              <p className='text-gray-700 mb-4'>{t(`${key}.intro`)}</p>
              <ul className='list-disc pl-5 space-y-1 text-gray-700'>
                {(t.raw(`${key}.tips`) as string[]).map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
              {link && link.href && link.label && (
                <div className='mt-4'>
                  <a
                    href={link.href}
                    className='inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md border border-[#c6b892] text-[#c6b892] hover:bg-[#c6b892] hover:text-white'>
                    {link.label}
                  </a>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
