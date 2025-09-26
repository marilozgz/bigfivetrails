"use client"

import { useState } from "react"

export type TabItem = {
  key: string
  label: string
  content: React.ReactNode
}

export default function Tabs({
  items,
  initialKey
}: {
  items: TabItem[]
  initialKey?: string
}) {
  const [active, setActive] = useState<string>(initialKey || items[0]?.key)
  return (
    <div className='rounded-lg border border-[#c6b892]/30'>
      <div className='flex gap-2 p-2 bg-gray-50 rounded-t-lg overflow-x-auto'>
        {items.map((it) => (
          <button
            key={it.key}
            type='button'
            onClick={() => setActive(it.key)}
            className={
              "px-3 py-1 rounded-md text-sm whitespace-nowrap " +
              (active === it.key
                ? "bg-white border border-[#c6b892]/40"
                : "hover:bg-white/60 border border-transparent")
            }>
            {it.label}
          </button>
        ))}
      </div>
      <div className='p-3'>
        {items.find((it) => it.key === active)?.content}
      </div>
    </div>
  )
}
