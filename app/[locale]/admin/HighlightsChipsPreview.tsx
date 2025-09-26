"use client"

import { useEffect, useState } from "react"

export default function HighlightsChipsPreview({
  sourceName = "highlights[]"
}: {
  sourceName?: string
}) {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    const ta = document.querySelector(
      `textarea[name="${sourceName}"]`
    ) as HTMLTextAreaElement | null
    if (!ta) return
    const update = () => {
      const next = (ta.value || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      setItems(next)
    }
    update()
    ta.addEventListener("input", update)
    return () => ta.removeEventListener("input", update)
  }, [sourceName])

  if (items.length === 0) return null
  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      {items.map((it) => (
        <span
          key={it}
          className='inline-flex items-center px-2 py-1 rounded-full bg-[#f6f3ee] border border-[#c6b892]/40 text-xs text-[#1f221b]'>
          {it}
        </span>
      ))}
    </div>
  )
}
