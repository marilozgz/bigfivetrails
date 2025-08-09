"use client"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

export default function NavMenu({ fontClass }: { fontClass?: string }) {
  const t = useTranslations("nav")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections = [
    { id: "tours", label: t("tours") },
    { id: "destinations", label: t("destinations") },
    { id: "why-us", label: t("whyUs") },
    { id: "reviews", label: t("reviews") },
    { id: "contact", label: t("contact") }
  ]

  const [active, setActive] = useState("")

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
  }, [sections])

  return (
    <div className={`hidden lg:flex items-center gap-8 ${fontClass}`}>
      <ToursDropdown active={active === "tours"} />
      {sections.slice(1).map((s) => (
        <a
          key={s.id}
          href={s.id === "destinations" ? `/safaris` : `#${s.id}`}
          className={`relative text-sm font-medium text-[#c6b892]/95 hover:text-[#c6b892] transition
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
  const t = useTranslations("nav.packages")
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
    { name: t("serengetiLuxury"), href: "#serengeti" },
    { name: t("ngorongoro"), href: "#ngorongoro" },
    { name: t("migration"), href: "#migration" },
    { name: t("tarangire"), href: "#tarangire" },
    { name: t("zanzibar"), href: "#zanzibar" }
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
        className={`relative text-sm font-medium text-[#c6b892]/95 hover:text-[#c6b892] transition
          after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#c6b892]
          after:transition-all after:duration-300
          ${active ? "after:w-full" : "after:w-0 hover:after:w-full"}`}>
        {t("tours", { scope: ".." })}
      </button>

      <div
        className={`absolute left-0 top-full pt-2 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}>
        <div
          className={
            "w-64 rounded-lg bg-[#1f221b] border border-[#c6b892]/30 shadow-lg " +
            (open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none")
          }
          role='menu'
          aria-label='Tours'
          aria-hidden={!open}
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
