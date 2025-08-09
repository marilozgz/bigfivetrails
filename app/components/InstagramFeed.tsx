"use client"
import { motion } from "framer-motion"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import { useEffect, useState } from "react"
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"]
})

type IGItem = {
  id: string
  href: string
  caption: string
  src: string
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
}

export default function InstagramFeed() {
  const [items, setItems] = useState<IGItem[]>([])
  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
  }, [])

  return (
    <section
      id='instagram'
      className='bg-[#1f221b] py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center'>
        <h2
          className={`${cormorant.className} text-3xl sm:text-4xl font-semibold text-[#f6f3ee]`}>
          Moments from our Instagram
        </h2>
        <p className='mt-2 text-[#f6f3ee]/80'>
          Follow{" "}
          <a
            className='text-[#e7c6c2] hover:underline'
            href='https://instagram.com/bigfivetrails'
            target='_blank'>
            @bigfivetrails
          </a>
        </p>

        <div className='mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {items.map((it) => (
            <motion.a
              key={it.id}
              href={it.href}
              target='_blank'
              rel='noopener noreferrer'
              className='relative block overflow-hidden rounded-lg group'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}>
              <Image
                src={it.src}
                alt={it.caption || "Instagram image"}
                width={600}
                height={600}
                className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
            </motion.a>
          ))}
        </div>

        <a
          href='https://instagram.com/bigfivetrails'
          target='_blank'
          className='mt-6 inline-flex items-center rounded-full border border-[#e7c6c2] px-4 py-2 text-sm font-semibold text-[#f6f3ee] hover:bg-[#e7c6c2] hover:text-[#1f221b] transition'>
          See more on Instagram
        </a>
      </div>
    </section>
  )
}
