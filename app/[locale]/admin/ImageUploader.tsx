"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import imageCompression from "browser-image-compression"
import { useRef, useState } from "react"

interface ImageUploaderProps {
  bucket?: string
  onUploaded: (publicUrl: string, meta?: { thumbUrl?: string }) => void
  label?: string
  multiple?: boolean
  maxSizeMB?: number
  allowedTypes?: string[]
}

export default function ImageUploader({
  bucket = "safaris",
  onUploaded,
  label = "Subir imagen",
  multiple = false,
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"]
}: ImageUploaderProps) {
  const supabase = createSupabaseBrowserClient()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        if (!allowedTypes.includes(file.type)) {
          setError("Formato no permitido. Usa JPG, PNG o WEBP.")
          continue
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`Imagen demasiado grande. Máximo ${maxSizeMB} MB.`)
          continue
        }
        const localUrl = URL.createObjectURL(file)
        setPreviews((p) => [localUrl, ...p])
        const fileExt = file.name.split(".").pop()
        // compress main image
        const compressed = await imageCompression(file, {
          maxSizeMB: Math.min(maxSizeMB, 2),
          maxWidthOrHeight: 1920,
          useWebWorker: true
        })
        // create thumbnail (smaller)
        const thumbBlob = await imageCompression(file, {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 400,
          useWebWorker: true
        })
        const filePath = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, compressed, {
            upsert: false,
            cacheControl: "3600"
          })
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
        let thumbUrl: string | undefined
        const thumbPath = filePath.replace(`.${fileExt}`, `.thumb.${fileExt}`)
        const { error: thumbError } = await supabase.storage
          .from(bucket)
          .upload(thumbPath, thumbBlob, { upsert: true, cacheControl: "3600" })
        if (!thumbError) {
          thumbUrl = supabase.storage.from(bucket).getPublicUrl(thumbPath)
            .data.publicUrl
        }
        onUploaded(data.publicUrl, { thumbUrl })
        if (!multiple) break
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ""
    }
  }

  return (
    <div className='space-y-2'>
      <label className='text-sm text-gray-700'>{label}</label>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className='px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-60'>
          {uploading
            ? "Subiendo…"
            : multiple
            ? "Seleccionar imágenes"
            : "Seleccionar imagen"}
        </button>
        <input
          ref={inputRef}
          type='file'
          accept='.jpg,.jpeg,.png,.webp'
          multiple={multiple}
          onChange={handleChange}
          className='hidden'
        />
      </div>
      {error && <div className='text-sm text-red-600'>{error}</div>}
      {previews.length > 0 && (
        <div className='flex gap-2 flex-wrap mt-1'>
          {previews.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt='preview'
              className='w-16 h-16 object-cover rounded border'
            />
          ))}
        </div>
      )}
    </div>
  )
}
