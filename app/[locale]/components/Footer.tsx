/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useTranslations } from "next-intl"
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
  const t = useTranslations("footer")

  return (
    <footer className='bg-[#1f221b] text-[#f6f3ee] pt-16 pb-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4'>
        {/* Logo + tagline */}
        <div>
          <div className='flex items-center gap-3'>
            <Image
              src='/logo.png'
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
            {t("tagline")}
          </p>
        </div>

        {/* Quick menu */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            {t("explore.title")}
          </h4>
          <ul className='space-y-2 text-sm'>
            {t.raw("explore.items").map((item: any) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className='hover:text-[#e7c6c2] transition'>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            {t("contact.title")}
          </h4>
          <ul className='space-y-2 text-sm'>
            {t.raw("contact.items").map((item: any, i: number) => (
              <li key={i}>
                {item.href ? (
                  <a
                    href={item.href}
                    className='hover:text-[#e7c6c2] transition'>
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h4 className={`${cormorant.className} text-lg font-semibold mb-4`}>
            {t("follow.title")}
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
              placeholder={t("newsletter.placeholder")}
              className='flex-1 px-4 py-2 bg-transparent text-sm placeholder-[#f6f3ee]/60 focus:outline-none'
            />
            <button
              type='submit'
              className='bg-[#e7c6c2] text-[#1f221b] px-4 py-2 text-sm font-semibold hover:bg-[#c6b892] transition'>
              {t("newsletter.button")}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='mt-12 pt-6 border-t border-[#c6b892]/30 text-center text-xs text-[#f6f3ee]/60'>
        © {new Date().getFullYear()} {t("bottom.text")}
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
