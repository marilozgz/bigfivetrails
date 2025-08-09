"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Cormorant_Garamond } from "next/font/google"
import {
  LuCompass, // Expert Guides
  LuLifeBuoy, // 24/7 Support
  LuMap, // Tailor-Made
  LuTent // Luxury Camps
} from "react-icons/lu"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function WhyUs() {
  const t = useTranslations("whyUs")

  const icons = [LuCompass, LuMap, LuTent, LuLifeBuoy]
  const items = t.raw("items") as {
    title: string
    text: string
  }[]

  return (
    <section
      id='why-us'
      className='bg-[#E5BDB5] py-20'>
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

        {/* Grid */}
        <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map((it, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className='rounded-xl bg-white/60 border border-[#E5BDB5] p-6 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3 text-[#1f221b]'>
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E5BDB5]'>
                    <Icon size={28} />
                  </span>
                  <h3
                    className={`${cormorant.className} text-xl font-semibold text-[#1f221b]`}>
                    {it.title}
                  </h3>
                </div>
                <p className='mt-3 text-sm leading-relaxed text-[#1f221b]/80'>
                  {it.text}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA subtle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='mt-12 flex justify-center'>
          <a
            href='#quote'
            className='rounded-full bg-[#1f221b] text-[#f6f3ee] px-6 py-3 text-sm font-semibold shadow hover:translate-y-[-1px] hover:shadow-lg transition-all'>
            {t("cta")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
