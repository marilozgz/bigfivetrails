"use client"
import { useEffect, useRef, useState } from "react"

export default function NavMenu({ fontClass }: { fontClass?: string }) {
  const sections = [
    { id: "tours", label: "Tours" },
    { id: "destinations", label: "Destinations" },
    { id: "why-us", label: "Why Us" },
    { id: "reviews", label: "Reviews" },
    { id: "contact", label: "Contact" }
  ]

  const [active, setActive] = useState("")

  // Detect active section on scroll
  useEffect(() => {
    const handler = () => {
      let current = ""
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom > 120) {
            current = section.id
            break
          }
        }
      }
      setActive(current)
    }
    window.addEventListener("scroll", handler)
    handler()
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div className={`hidden lg:flex items-center gap-8 ${fontClass}`}>
      <ToursDropdown active={active === "tours"} />
      {sections.slice(1).map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`relative text-sm font-medium text-[#f6f3ee]/95 hover:text-white transition
            after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#c6b892]
            after:transition-all after:duration-300
            ${
              active === s.id ? "after:w-full" : "after:w-0 hover:after:w-full"
            }`}>
          {s.label}
        </a>
      ))}
    </div>
  )
}

function ToursDropdown({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const packages = [
    { name: "Serengeti Luxury Escape", href: "#serengeti" },
    { name: "Ngorongoro Crater Tour", href: "#ngorongoro" },
    { name: "Great Migration Special", href: "#migration" },
    { name: "Tarangire & Lake Manyara", href: "#tarangire" },
    { name: "Zanzibar Beach & Safari", href: "#zanzibar" }
  ]

  return (
    <div
      className='relative'
      onMouseEnter={openNow}
      onMouseLeave={closeWithDelay}>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-haspopup='menu'
        aria-expanded={open}
        className={`relative text-sm font-medium text-[#f6f3ee]/95 hover:text-white transition
          after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#c6b892]
          after:transition-all after:duration-300
          ${active ? "after:w-full" : "after:w-0 hover:after:w-full"}`}>
        Tours
      </button>

      <div className='absolute left-0 top-full pt-2'>
        <div
          className={
            "w-64 rounded-lg bg-[#1f221b] border border-[#c6b892]/30 shadow-lg " +
            (open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none")
          }
          role='menu'
          aria-label='Tours'
          style={{ transition: "opacity 120ms ease, transform 120ms ease" }}>
          <ul className='py-2'>
            {packages.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  role='menuitem'
                  className='block px-4 py-2 text-sm text-[#f6f3ee]/90 hover:bg-[#c6b892]/10 hover:text-white transition'>
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
