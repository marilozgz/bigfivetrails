"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function Testimonials() {
  const t = useTranslations("testimonials")
  const testimonials = t.raw("items") as {
    name: string
    trip: string
    text: string
    img: string
  }[]

  return (
    <section
      id='reviews'
      className='bg-[#f6f3ee] py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className='text-center'>
          <h2
            className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1f221b]`}>
            {t("title")}
          </h2>
          <p className='mt-3 text-[#1f221b]/80 text-lg max-w-2xl mx-auto'>
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className='mt-12 grid gap-8 md:grid-cols-3'>
          {testimonials.map((testi, i) => (
            <motion.div
              key={testi.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className='bg-white rounded-xl shadow-md overflow-hidden flex flex-col'>
              <div className='relative h-56 w-full'>
                <Image
                  src={testi.img}
                  alt={testi.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-6 flex flex-col flex-1'>
                <p className='text-[#1f221b]/80 flex-1 italic'>
                  “{testi.text}”
                </p>
                <div className='mt-4'>
                  <p
                    className={`${cormorant.className} text-lg font-semibold text-[#1f221b]`}>
                    {testi.name}
                  </p>
                  <p className='text-sm text-[#1f221b]/70'>{testi.trip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mt-12 flex justify-center'>
          <a
            href={t("cta.link")}
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full bg-[#e7c6c2] text-[#1f221b] px-6 py-3 text-sm font-semibold shadow hover:translate-y-[-1px] hover:shadow-lg transition-all'>
            {t("cta.label")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
