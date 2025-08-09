"use client"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import NavMenu from "./NavMenu"
import TailorQuoteModal from "./TailorQuoteModal"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function Header() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const transparentPages = ["/", "/destinations"]
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isTransparent = transparentPages.includes(pathname)
  const solid = !isTransparent || scrolled

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all " +
        (solid ? "backdrop-blur bg-[#1f221b]/70 shadow-sm" : "bg-transparent")
      }>
      {/* Microbar */}
      <div
        className={`hidden md:flex items-center justify-center gap-6 text-sm py-2 text-[#e7c6c2] bg-[#1f221b] ${cormorant.className}`}>
        <span className='opacity-90'>{t("microbar.tagline")}</span>
        <span className='h-3 w-px bg-[#c6b892]/40' />
        <a
          href={`tel:${t("microbar.phoneRaw")}`}
          className='hover:underline'>
          {t("microbar.phone")}
        </a>
      </div>

      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Brand */}
          <Link
            href='/'
            className={`flex items-center gap-3 group ${cormorant.className}`}>
            <Image
              width={32}
              height={32}
              src='/logo.png'
              alt='BigFiveTrails logo'
              className='h-8 w-8 rounded-full ring-1 ring-[#c6b892]/30 bg-[#1f221b] p-1'
            />
            <div className='leading-tight'>
              <span className='block text-lg font-semibold tracking-wide text-[#e7c6c2]'>
                {t("brand.title")}
              </span>
              <span className='block text-[11px] uppercase tracking-[0.2em] text-[#c6b892]/80'>
                {t("brand.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop menu */}
          <NavMenu fontClass={cormorant.className} />

          {/* Desktop actions */}
          <div className='hidden lg:flex items-center gap-4'>
            <a
              href='https://wa.me/255000000'
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-500 text-2xl transition-transform transform hover:scale-110 hover:text-green-400'
              aria-label={t("actions.whatsapp")}>
              <FaWhatsapp />
            </a>

            <select
              value={locale}
              onChange={(e) => {
                const nextLocale = e.target.value
                const segments = pathname.split("/")
                segments[1] = nextLocale
                router.replace(segments.join("/"))
              }}
              className={`bg-transparent border border-[#c6b892]/40 text-[#f6f3ee] rounded-full px-2 py-1 text-sm ${cormorant.className}`}>
              <option value='en'>EN</option>
              <option value='es'>ES</option>
              <option value='de'>DE</option>
            </select>

            <a
              href='#quote'
              onClick={() => setQuoteModalOpen(true)}
              className={`inline-flex items-center rounded-full border border-[#c6b892]/40 bg-[#e7c6c2] px-4 py-2 text-sm font-medium text-[#1f221b] shadow-sm hover:translate-y-[-1px] hover:shadow transition-all ${cormorant.className}`}>
              {t("actions.requestQuote")}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label='Open menu'
            onClick={() => setOpen(true)}
            className='lg:hidden inline-flex items-center justify-center rounded-md border border-[#c6b892]/30 p-2 text-[#e7c6c2] hover:bg-[#1f221b]/60'>
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={
          "fixed inset-0 z-40 lg:hidden transition " +
          (open ? "pointer-events-auto" : "pointer-events-none")
        }>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={
            "absolute inset-0 bg-black/40 transition-opacity " +
            (open ? "opacity-100" : "opacity-0")
          }
        />

        {/* Panel */}
        <aside
          className={
            "absolute right-0 top-0 h-full w-80 max-w-[85%] bg-[#1f221b] text-[#e7c6c2] shadow-xl transition-transform " +
            (open ? "translate-x-0" : "translate-x-full")
          }>
          <div className='flex items-center justify-between p-4 border-b border-[#c6b892]/20'>
            <Link
              href='/'
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 ${cormorant.className}`}>
              <Image
                width={28}
                height={28}
                src='/logo.png'
                alt='logo'
                className='h-7 w-7 rounded-full ring-1 ring-[#c6b892]/30 bg-[#1f221b] p-1'
              />
              <span className='font-semibold'>{t("brand.title")}</span>
            </Link>
            <button
              aria-label='Close menu'
              onClick={() => setOpen(false)}
              className='rounded-md border border-[#c6b892]/30 px-2 py-1 hover:bg-[#c6b892]/10'>
              Close
            </button>
          </div>

          <div className={`p-4 space-y-1 ${cormorant.className}`}>
            <MobileLink
              onClick={() => setOpen(false)}
              href='#tours'>
              {t("nav.tours")}
            </MobileLink>
            <MobileLink
              onClick={() => setOpen(false)}
              href='#destinations'>
              {t("nav.destinations")}
            </MobileLink>
            <MobileLink
              onClick={() => setOpen(false)}
              href='#why-us'>
              {t("nav.whyUs")}
            </MobileLink>
            <MobileLink
              onClick={() => setOpen(false)}
              href='#reviews'>
              {t("nav.reviews")}
            </MobileLink>
            <MobileLink
              onClick={() => setOpen(false)}
              href='#contact'>
              {t("nav.contact")}
            </MobileLink>
            <div className='flex gap-3 pt-4'>
              <a
                href='https://wa.me/255000000'
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 rounded-full bg-green-500/90 px-3 py-2 text-white text-sm font-semibold text-center'>
                {t("actions.whatsapp")}
              </a>
              <a
                href='https://t.me/username'
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 rounded-full bg-blue-500/90 px-3 py-2 text-white text-sm font-semibold text-center'>
                Telegram
              </a>
            </div>
            <select
              value={locale}
              onChange={(e) => {
                const nextLocale = e.target.value
                const segments = pathname.split("/")
                segments[1] = nextLocale
                router.replace(segments.join("/"))
              }}
              className={`mt-4 w-full bg-transparent border border-[#c6b892]/40 text-[#f6f3ee] rounded-full px-2 py-1 text-sm ${cormorant.className}`}>
              <option value='en'>EN</option>
              <option value='es'>ES</option>
              <option value='de'>DE</option>
            </select>
          </div>

          <div className='p-4'>
            <a
              href='#quote'
              onClick={() => setOpen(false)}
              className={`block w-full text-center rounded-full border border-[#c6b892]/40 bg-[#e7c6c2] px-4 py-2 text-sm font-medium text-[#1f221b] shadow-sm hover:translate-y-[-1px] hover:shadow transition-all ${cormorant.className}`}>
              {t("actions.requestQuote")}
            </a>
          </div>
        </aside>
      </div>
      <TailorQuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </header>
  )
}

function MobileLink({
  href,
  children,
  onClick
}: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className='block rounded-md px-3 py-3 text-base font-medium text-[#f6f3ee] hover:bg-[#c6b892]/10'>
      {children}
    </a>
  )
}

function BurgerIcon() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M4 7h16M4 12h16M4 17h16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}
