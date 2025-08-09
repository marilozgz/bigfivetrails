"use client"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp
} from "react-icons/fa"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function Footer() {
  return (
    <footer className='bg-[#1f221b] text-[#f6f3ee] pt-16 pb-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4'>
        {/* Logo + tagline */}
        <div>
          <div className='flex items-center gap-3'>
            <Image
              src='/logo.jpg'
              alt='BigFiveTrails logo'
              width={40}
              height={40}
              className='h-10 w-10 rounded-full ring-1 ring-[#c6b892]/30 bg-[#1f221b] p-1'
            />
            <span className={`${cormorant.className} text-xl font-semibold`}>
              bigfivetrails
            </span>
          </div>
          <p className='mt-4 text-sm text-[#f6f3ee]/80 max-w-xs'>
            Tailor-made safaris across Tanzania — luxury camps, expert guides &
            unforgettable moments.
          </p>
        </div>

        {/* Quick menu */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            Explore
          </h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='#tours'
                className='hover:text-[#e7c6c2] transition'>
                Tours
              </a>
            </li>
            <li>
              <a
                href='#destinations'
                className='hover:text-[#e7c6c2] transition'>
                Destinations
              </a>
            </li>
            <li>
              <a
                href='#why-us'
                className='hover:text-[#e7c6c2] transition'>
                Why Us
              </a>
            </li>
            <li>
              <a
                href='#reviews'
                className='hover:text-[#e7c6c2] transition'>
                Reviews
              </a>
            </li>
            <li>
              <a
                href='#contact'
                className='hover:text-[#e7c6c2] transition'>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            Contact
          </h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='tel:+255000000'
                className='hover:text-[#e7c6c2] transition'>
                +255 000 000
              </a>
            </li>
            <li>
              <a
                href='mailto:info@bigfivetrails.com'
                className='hover:text-[#e7c6c2] transition'>
                info@bigfivetrails.com
              </a>
            </li>
            <li>Arusha, Tanzania</li>
            <li>Mon-Fri: 9am–6pm</li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            Follow us
          </h4>
          <div className='flex gap-3 mb-6'>
            <SocialIcon
              href='https://wa.me/255000000'
              icon={<FaWhatsapp />}
              color='#25D366'
            />
            <SocialIcon
              href='https://instagram.com/bigfivetrails'
              icon={<FaInstagram />}
              color='#E4405F'
            />
            <SocialIcon
              href='https://t.me/username'
              icon={<FaTelegramPlane />}
              color='#0088cc'
            />
            <SocialIcon
              href='https://facebook.com/bigfivetrails'
              icon={<FaFacebookF />}
              color='#1877F2'
            />
          </div>
          {/* Newsletter */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex bg-[#f6f3ee]/10 rounded-full overflow-hidden'>
            <input
              type='email'
              placeholder='Your email'
              className='flex-1 px-4 py-2 bg-transparent text-sm placeholder-[#f6f3ee]/60 focus:outline-none'
            />
            <button
              type='submit'
              className='bg-[#e7c6c2] text-[#1f221b] px-4 py-2 text-sm font-semibold hover:bg-[#c6b892] transition'>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='mt-12 pt-6 border-t border-[#c6b892]/30 text-center text-xs text-[#f6f3ee]/60'>
        © {new Date().getFullYear()} BigFiveTrails. All rights reserved. |
        Privacy Policy
      </div>
    </footer>
  )
}

function SocialIcon({
  href,
  icon,
  color
}: {
  href: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='h-9 w-9 flex items-center justify-center rounded-full bg-[#f6f3ee]/10 hover:scale-110 transition'
      style={{ color }}>
      {icon}
    </a>
  )
}
