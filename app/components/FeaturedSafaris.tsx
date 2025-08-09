"use client"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

const safaris = [
  {
    title: "Serengeti Luxury Escape",
    tagline: "Witness the Great Migration in style",
    img: "/images/serengetideluxe.jpg",
    badge: "Most Popular",
    link: "#serengeti"
  },
  {
    title: "Ngorongoro Crater Adventure",
    tagline: "Explore the Eden of Africa",
    img: "/images/ngorongoro.jpg",
    badge: "Limited Dates 2025",
    link: "#ngorongoro"
  },
  {
    title: "Tarangire & Lake Manyara",
    tagline: "Elephants, baobabs & flamingos",
    img: "/images/tarangire.jpg",
    badge: "New",
    link: "#tarangire"
  }
]

export default function FeaturedSafaris() {
  return (
    <section
      id='featured'
      className='bg-[#1f221b] py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Heading */}
        <div className='text-center mb-12'>
          <h2
            className={`${cormorant.className} text-3xl sm:text-4xl md:text-5xl font-semibold text-[#f6f3ee]`}>
            Featured Safari Experiences
          </h2>
          <p className='mt-3 text-[#f6f3ee]/80 text-lg max-w-2xl mx-auto'>
            Hand-picked journeys to showcase the best of Tanzania — from vast
            plains to hidden gems.
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
