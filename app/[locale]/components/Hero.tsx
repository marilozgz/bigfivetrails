"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export default function Hero() {
  const t = useTranslations("hero")

  return (
    <section
      id='hero'
      className='relative min-h-[92vh] w-full overflow-hidden bg-[#1f221b]'>
      {/* Background media */}
      <div className='absolute inset-0 z-0'>
        <video
          className='h-full w-full object-cover opacity-100'
          autoPlay
          muted
          loop
          playsInline
          poster='/images/serengeti.jpg'>
          <source
            src='/videos/serengeti.mp4'
            type='video/mp4'
          />
        </video>
        <div className='absolute inset-0 bg-gradient-to-t from-[#1f221b] via-[#1f221b]/40 to-transparent' />
      </div>

      {/* Decorative overlay */}
      <div className='pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40 [background-image:radial-gradient(40rem_40rem_at_10%_10%,rgba(198,184,146,0.18),transparent),radial-gradient(30rem_30rem_at_90%_80%,rgba(231,198,194,0.18),transparent)]' />

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-28 md:pt-48 md:pb-36'>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='inline-flex items-center gap-2 rounded-full border border-[#c6b892]/30 bg-black/20 px-3 py-1 text-[12px] uppercase tracking-[0.18em] text-[#f6f3ee]/90 backdrop-blur'>
          {t("eyebrow")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className='mt-5 text-4xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] text-[#f6f3ee]'>
          {t.rich("headline", {
            strong: (chunks) => (
              <span className='relative inline-block'>
                <span className='relative z-[1] '>{chunks}</span>
                <span className='absolute inset-x-0 top-8 h-3 bg-[#e7c6c2]/70 -skew-x-6 rounded' />
              </span>
            )
          })}
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className='mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[#f6f3ee]/85'>
          {t("subcopy")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='mt-8 flex flex-wrap items-center gap-3'>
          <a
            href='#tours'
            className='rounded-full bg-[#e7c6c2] px-6 py-3 text-sm font-semibold text-[#1f221b] shadow hover:translate-y-[-2px] hover:shadow-lg transition-all'>
            {t("cta.explore")}
          </a>
          <a
            href='#quote'
            className='rounded-full border border-[#c6b892]/50 px-6 py-3 text-sm font-semibold text-[#f6f3ee] hover:bg-[#c6b892]/10'>
            {t("cta.quote")}
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className='mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[#f6f3ee]/80'>
          <div className='flex items-center gap-2 text-sm'>
            <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#c6b892]/20 text-[#c6b892]'>
              ★
            </span>
            {t("trust.rating")}
          </div>
          <div className='hidden h-4 w-px bg-[#c6b892]/30 sm:block' />
          <div className='text-sm'>{t("trust.badge")}</div>
        </motion.div>
      </div>

      <ScrollCue label={t("scroll")} />

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); opacity: 0.12; }
          20% { opacity: 0.22; }
          50% { transform: scale(1.06) translate(1%, 1%); opacity: 0.22; }
          100% { transform: scale(1.1) translate(2%, 2%); opacity: 0.22; }
        }
      `}</style>
    </section>
  )
}

function ScrollCue({ label }: { label: string }) {
  return (
    <div className='pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2'>
      <div className='flex flex-col items-center text-[#f6f3ee]/80 text-xs'>
        <div className='mb-2'>{label}</div>
        <div className='h-10 w-6 rounded-full border border-[#c6b892]/50 flex items-start justify-center p-1'>
          <span className='block h-2 w-1 rounded bg-[#e7c6c2] animate-bounce' />
        </div>
      </div>
    </div>
  )
}
