"use client"
import { Cormorant_Garamond } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import NavMenu from "./NavMenu"
import TailorQuoteModal from "./TailorQuoteModal"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function Header() {
  const pathname = usePathname()
  const isLanding = pathname === "/" // transparente solo en home
  const [scrolled, setScrolled] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Variante sólida si NO es landing, o si en landing ya hay scroll
  const solid = !isLanding || scrolled

  // Paleta
  const bgSolid = "bg-[#f6f3ee]"
  const borderSolid = "border-b border-[#c6b892]/40"
  const textSolid = "text-[#1f221b]"
  const brandSolid = "text-[#1f221b]" // marca en oscuro en internas

  const bgTransparent = "bg-transparent"
  const overlay = "backdrop-blur bg-[#1f221b]/70 shadow-sm" // cuando hace scroll en landing

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all " +
        (solid ? `${bgSolid} ${borderSolid}` : `${bgTransparent}`) +
        (isLanding && scrolled ? ` ${overlay}` : "")
      }>
      {/* Microbar: solo en landing */}
      {isLanding && (
        <div
          className={`hidden md:flex items-center justify-center gap-6 text-sm py-2 text-[#e7c6c2] bg-[#1f221b] ${cormorant.className}`}>
          <span className='opacity-90'>Tanzania Safaris • Tailor‑Made</span>
          <span className='h-3 w-px bg-[#c6b892]/40' />
          <a
            href='tel:+255000000'
            className='hover:underline'>
            +255 000 000
          </a>
        </div>
      )}

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
              className={
                "h-8 w-8 rounded-full ring-1 ring-[#c6b892]/30 bg-[#1f221b] p-1"
              }
            />
            <div className='leading-tight'>
              <span
                className={`block text-lg font-semibold tracking-wide ${
                  solid ? brandSolid : "text-[#e7c6c2]"
                }`}>
                bigfivetrails
              </span>
              <span
                className={
                  "block text-[11px] uppercase tracking-[0.2em] " +
                  (solid ? "text-[#1f221b]/70" : "text-[#c6b892]/80")
                }>
                Safari Experiences
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
              className={
                "text-green-600 text-2xl transition-transform transform hover:scale-110 " +
                (solid ? "" : "hover:text-green-400")
              }
              aria-label='WhatsApp'>
              <FaWhatsapp />
            </a>

            <select
              className={`bg-transparent border ${
                solid
                  ? "border-[#c6b892]/60 " + textSolid
                  : "border-[#c6b892]/40 text-[#f6f3ee]"
              } rounded-full px-2 py-1 text-sm ${cormorant.className}`}>
              <option value='en'>EN</option>
              <option value='es'>ES</option>
            </select>

            <a
              href='#quote'
              onClick={() => setQuoteModalOpen(true)}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium shadow-sm hover:translate-y-[-1px] hover:shadow transition-all ${
                cormorant.className
              } ${
                solid
                  ? "border-[#c6b892]/60 bg-[#1f221b] text-white"
                  : "border-[#c6b892]/40 bg-[#e7c6c2] text-[#1f221b]"
              }`}>
              Request a Quote
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label='Open menu'
            onClick={() => setOpen(true)}
            className={
              "lg:hidden inline-flex items-center justify-center rounded-md border p-2 " +
              (solid
                ? "border-[#c6b892]/60 text-[#1f221b]"
                : "border-[#c6b892]/30 text-[#e7c6c2]")
            }>
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile drawer igual que el tuyo (sin cambios de lógica) */}
      {/* ... (omito por brevedad si no necesitas tocarlo visualmente) ... */}

      <TailorQuoteModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </header>
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
