"use client"

import { useEffect, useRef, useState } from "react"
import ImageUploader from "./ImageUploader"

export default function GalleryUploader({
  targetName
}: {
  targetName: string
}) {
  const [urls, setUrls] = useState<string[]>([])
  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    const inputs = Array.from(
      document.querySelectorAll(`input[name="${targetName}"]`)
    ) as HTMLInputElement[]
    setUrls(inputs.map((i) => i.value))
  }, [targetName])

  const onUploaded = (url: string) => {
    const form = document.querySelector("form")
    if (!form) return
    const input = document.createElement("input")
    input.name = targetName
    input.value = url
    input.className = "w-full border px-3 py-2 rounded mb-2"
    const submit = form.querySelector("button[type=submit]")
    form.insertBefore(input, submit || null)
    setUrls((u) => [...u, url])
  }

  const syncInputs = (next: string[]) => {
    const inputs = Array.from(
      document.querySelectorAll(`input[name="${targetName}"]`)
    ) as HTMLInputElement[]
    // Ajustar cantidad de inputs si fuese necesario
    if (inputs.length !== next.length) return setUrls(next)
    inputs.forEach((i, n) => (i.value = next[n]))
  }

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...urls]
    const to = Math.min(Math.max(0, idx + dir), next.length - 1)
    const [item] = next.splice(idx, 1)
    next.splice(to, 0, item)
    setUrls(next)
    syncInputs(next)
  }

  const remove = (idx: number) => {
    const inputs = Array.from(
      document.querySelectorAll(`input[name="${targetName}"]`)
    ) as HTMLInputElement[]
    if (inputs[idx]) inputs[idx].remove()
    const next = urls.filter((_, i) => i !== idx)
    setUrls(next)
  }

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndex.current = index
    e.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = (index: number) => {
    void index
    return (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
    }
  }

  const onDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === index) return
    const next = [...urls]
    const [item] = next.splice(from, 1)
    next.splice(index, 0, item)
    setUrls(next)
    syncInputs(next)
  }

  return (
    <div className='space-y-2'>
      <ImageUploader
        label='Subir imágenes (múltiples)'
        multiple
        onUploaded={onUploaded}
      />
      <div className='text-xs text-gray-600'>
        Imágenes: {urls.length} (arrastra para reordenar)
      </div>
      {urls.length > 0 && (
        <ul className='space-y-1'>
          {urls.map((u, i) => (
            <li
              key={u}
              draggable
              onDragStart={onDragStart(i)}
              onDragOver={onDragOver(i)}
              onDrop={onDrop(i)}
              className='flex items-center gap-2 text-xs rounded border border-transparent hover:border-gray-200 p-1'>
              <span className='cursor-grab select-none'>⋮⋮</span>
              <span className='truncate flex-1'>{u}</span>
              <button
                type='button'
                onClick={() => move(i, -1)}
                className='px-2 py-1 border rounded hover:bg-gray-50'>
                ↑
              </button>
              <button
                type='button'
                onClick={() => move(i, 1)}
                className='px-2 py-1 border rounded hover:bg-gray-50'>
                ↓
              </button>
              <button
                type='button'
                onClick={() => remove(i)}
                className='px-2 py-1 border rounded hover:bg-red-50 text-red-600'>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
