"use client"
import { motion } from "framer-motion"
import { Cormorant_Garamond } from "next/font/google"
import {
  LuCompass, // Luxury Camps
  LuLifeBuoy, // 24/7 Support // Expert Guides
  LuMap, // Tailor‑Made
  LuTent
} from "react-icons/lu"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

const items = [
  {
    icon: <LuCompass size={28} />,
    title: "Expert Guides",
    text: "Hand‑picked naturalists and trackers who know every hidden corner of the bush."
  },
  {
    icon: <LuMap size={28} />,
    title: "Tailor‑Made Itineraries",
    text: "Your pace, your style. We craft each route around seasons, interests and budget."
  },
  {
    icon: <LuTent size={28} />,
    title: "Luxury Camps & Lodges",
    text: "From elegant tented camps to boutique lodges—comfort without losing the wild."
  },
  {
    icon: <LuLifeBuoy size={28} />,
    title: "24/7 On‑Ground Support",
    text: "Local team in Tanzania, real humans on call—before, during and after your trip."
  }
]

export default function WhyUs() {
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
            Why Travel With Us
          </h2>
          <p className='mt-3 text-[#1f221b]/80 text-lg max-w-2xl mx-auto'>
            Honest expertise, thoughtful design and seamless execution—so you
            can focus on the magic of Tanzania.
          </p>
        </motion.div>

        {/* Grid */}
        <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className='rounded-xl bg-white/60 border border-[#E5BDB5] p-6 shadow-sm hover:shadow-md transition-shadow'>
              <div className='flex items-center gap-3 text-[#1f221b]'>
                <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E5BDB5]'>
                  {it.icon}
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
          ))}
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
            Get My Tailor‑Made Quote
          </a>
        </motion.div>
      </div>
    </section>
  )
}
