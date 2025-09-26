"use client"

import { useState } from "react"
import Tabs from "./Tabs"

export type ItineraryDay = {
  day: number
  title_es: string
  description_es: string
  title_en?: string
  description_en?: string
  title_fr?: string
  description_fr?: string
  title_it?: string
  description_it?: string
  title_de?: string
  description_de?: string
}

export default function ItineraryEditor({
  targetName
}: {
  targetName: string
}) {
  const [days, setDays] = useState<ItineraryDay[]>([])

  const addDay = () => {
    setDays((d) => [
      ...d,
      {
        day: d.length + 1,
        title_es: "",
        description_es: "",
        title_en: "",
        description_en: "",
        title_fr: "",
        description_fr: "",
        title_it: "",
        description_it: "",
        title_de: "",
        description_de: ""
      }
    ])
  }

  const removeDay = (idx: number) => {
    setDays((d) =>
      d.filter((_, i) => i !== idx).map((x, i) => ({ ...x, day: i + 1 }))
    )
  }

  const move = (from: number, to: number) => {
    setDays((d) => {
      const copy = [...d]
      const [item] = copy.splice(from, 1)
      copy.splice(to, 0, item)
      return copy.map((x, i) => ({ ...x, day: i + 1 }))
    })
  }

  const update = (idx: number, field: keyof ItineraryDay, value: string) => {
    setDays((d) => d.map((x, i) => (i === idx ? { ...x, [field]: value } : x)))
  }

  return (
    <div className='rounded-xl border border-[#c6b892]/30 overflow-hidden'>
      <div className='flex items-center justify-between px-4 py-3 bg-gray-50'>
        <div className='font-medium text-[#1f221b]'>Itinerario</div>
        <button
          type='button'
          onClick={addDay}
          className='px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 text-sm'>
          Añadir día
        </button>
      </div>
      <div className='p-4 space-y-4'>
        {days.map((d, i) => (
          <div
            key={i}
            className='rounded-lg border border-[#c6b892]/30 bg-white p-4'>
            <div className='flex flex-wrap items-center justify-between gap-2 mb-3'>
              <div className='text-sm text-gray-700 font-medium'>
                Día {d.day}
              </div>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => move(i, Math.max(0, i - 1))}
                  className='px-2 py-1 rounded-md border text-sm hover:bg-gray-50'>
                  ↑
                </button>
                <button
                  type='button'
                  onClick={() => move(i, Math.min(days.length - 1, i + 1))}
                  className='px-2 py-1 rounded-md border text-sm hover:bg-gray-50'>
                  ↓
                </button>
                <button
                  type='button'
                  onClick={() => removeDay(i)}
                  className='px-2 py-1 rounded-md border text-sm hover:bg-red-50 text-red-600'>
                  Eliminar
                </button>
              </div>
            </div>

            <Tabs
              items={[
                {
                  key: "es",
                  label: "ES",
                  content: (
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm mb-1'>
                          Título (ES)
                        </label>
                        <input
                          value={d.title_es}
                          onChange={(e) =>
                            update(i, "title_es", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Descripción (ES)
                        </label>
                        <textarea
                          rows={4}
                          value={d.description_es}
                          onChange={(e) =>
                            update(i, "description_es", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                    </div>
                  )
                },
                {
                  key: "en",
                  label: "EN",
                  content: (
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm mb-1'>Title (EN)</label>
                        <input
                          value={d.title_en || ""}
                          onChange={(e) =>
                            update(i, "title_en", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Description (EN)
                        </label>
                        <textarea
                          rows={4}
                          value={d.description_en || ""}
                          onChange={(e) =>
                            update(i, "description_en", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                    </div>
                  )
                },
                {
                  key: "fr",
                  label: "FR",
                  content: (
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm mb-1'>Titre (FR)</label>
                        <input
                          value={d.title_fr || ""}
                          onChange={(e) =>
                            update(i, "title_fr", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Description (FR)
                        </label>
                        <textarea
                          rows={4}
                          value={d.description_fr || ""}
                          onChange={(e) =>
                            update(i, "description_fr", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                    </div>
                  )
                },
                {
                  key: "it",
                  label: "IT",
                  content: (
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm mb-1'>
                          Titolo (IT)
                        </label>
                        <input
                          value={d.title_it || ""}
                          onChange={(e) =>
                            update(i, "title_it", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Descrizione (IT)
                        </label>
                        <textarea
                          rows={4}
                          value={d.description_it || ""}
                          onChange={(e) =>
                            update(i, "description_it", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                    </div>
                  )
                },
                {
                  key: "de",
                  label: "DE",
                  content: (
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm mb-1'>Titel (DE)</label>
                        <input
                          value={d.title_de || ""}
                          onChange={(e) =>
                            update(i, "title_de", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>
                          Beschreibung (DE)
                        </label>
                        <textarea
                          rows={4}
                          value={d.description_de || ""}
                          onChange={(e) =>
                            update(i, "description_de", e.target.value)
                          }
                          className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                        />
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        ))}
        {days.length === 0 && (
          <div className='text-sm text-gray-600'>Aún no hay días añadidos.</div>
        )}
      </div>
      <input
        type='hidden'
        name={targetName}
        value={JSON.stringify(days)}
      />
    </div>
  )
}
