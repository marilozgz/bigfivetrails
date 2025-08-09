"use client"
import { motion } from "framer-motion"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

const testimonials = [
  {
    name: "Emma & David",
    trip: "Serengeti & Ngorongoro",
    text: "Every day felt like a dream — from the luxury camps to seeing the Big Five up close. The guides were outstanding!",
    img: "/images/testimonial1.jpg"
  },
  {
    name: "Lucas M.",
    trip: "Great Migration Special",
    text: "I never imagined I’d be this close to the migration. The entire trip was perfectly planned and stress-free.",
    img: "/images/testimonial2.jpg"
  },
  {
    name: "Sophie & Claire",
    trip: "Tarangire & Zanzibar",
    text: "The mix of safari adventure and relaxing beaches was exactly what we needed. Highly recommend BigFiveTrails!",
    img: "/images/testimonial3.jpg"
  }
]

export default function Testimonials() {
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
            Guest Testimonials
          </h2>
          <p className='mt-3 text-[#1f221b]/80 text-lg max-w-2xl mx-auto'>
            Real stories from travelers who explored Tanzania with us.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className='mt-12 grid gap-8 md:grid-cols-3'>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className='bg-white rounded-xl shadow-md overflow-hidden flex flex-col'>
              <div className='relative h-56 w-full'>
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-6 flex flex-col flex-1'>
                <p className='text-[#1f221b]/80 flex-1 italic'>“{t.text}”</p>
                <div className='mt-4'>
                  <p
                    className={`${cormorant.className} text-lg font-semibold text-[#1f221b]`}>
                    {t.name}
                  </p>
                  <p className='text-sm text-[#1f221b]/70'>{t.trip}</p>
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
            href='https://www.tripadvisor.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-full bg-[#e7c6c2] text-[#1f221b] px-6 py-3 text-sm font-semibold shadow hover:translate-y-[-1px] hover:shadow-lg transition-all'>
            Read more reviews on TripAdvisor
          </a>
        </motion.div>
      </div>
    </section>
  )
}
