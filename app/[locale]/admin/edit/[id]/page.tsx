/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSupabaseServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import ImageUploader from "../../ImageUploader"

export default async function EditSafariPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createSupabaseServerClient()
  // Guard de rol admin
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  const meta: Record<string, unknown> =
    (user as any)?.user_metadata || (user as any)?.app_metadata || {}
  const role = (meta as { role?: string }).role
  if (!user || (role && role !== "admin")) {
    return (
      <div className='min-h-dvh flex items-center justify-center'>
        <div className='bg-white p-6 rounded shadow border'>
          Acceso restringido
        </div>
      </div>
    )
  }
  const { data } = await supabase
    .from("safaris")
    .select(
      "id, code, title_es, duration_days, price_from, thumbnail, thumbnail_thumb, location, images"
    )
    .eq("id", id)
    .single()

  if (!data) {
    return (
      <div className='min-h-dvh flex items-center justify-center'>
        <div className='bg-white p-6 rounded shadow border'>No encontrado</div>
      </div>
    )
  }

  return (
    <div className='min-h-dvh max-w-3xl mx-auto p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>Editar Safari</h1>
        <Link
          href='/admin'
          className='text-sm underline'>
          Volver
        </Link>
      </div>
      <EditForm safari={data} />
    </div>
  )
}

async function updateSafari(formData: FormData) {
  "use server"
  const supabase = createSupabaseServerClient()
  const id = String(formData.get("id"))

  const title_es = String(formData.get("title_es") || "").trim()
  const duration_daysRaw = formData.get("duration_days")
  const price_fromRaw = formData.get("price_from")
  const thumbnailRaw = String(formData.get("thumbnail") || "").trim()
  const thumbnail_thumbRaw = String(
    formData.get("thumbnail_thumb") || ""
  ).trim()
  const location = String(formData.get("location") || "").trim()
  const images = (formData.getAll("images[]") || []).map(String).filter(Boolean)

  if (title_es.length < 2 || title_es.length > 200)
    throw new Error("Título inválido")
  const duration_days = duration_daysRaw ? Number(duration_daysRaw) : undefined
  const price_from = price_fromRaw ? Number(price_fromRaw) : undefined
  if (
    duration_days !== undefined &&
    (!Number.isInteger(duration_days) ||
      duration_days < 1 ||
      duration_days > 60)
  ) {
    throw new Error("Duración inválida")
  }
  if (
    price_from !== undefined &&
    (!Number.isInteger(price_from) || price_from < 0 || price_from > 999999)
  ) {
    throw new Error("Precio inválido")
  }
  const thumbnail = thumbnailRaw === "" ? undefined : thumbnailRaw
  const thumbnail_thumb =
    thumbnail_thumbRaw === "" ? undefined : thumbnail_thumbRaw

  await supabase
    .from("safaris")
    .update({
      title_es,
      duration_days,
      price_from,
      thumbnail,
      thumbnail_thumb,
      location,
      images
    })
    .eq("id", id)
  redirect(
    `/admin/edit/${id}?success=` + encodeURIComponent("Cambios guardados")
  )
}

function EditForm({ safari }: { safari: any }) {
  return (
    <form
      action={updateSafari}
      className='bg-white border rounded p-4 space-y-3'>
      <input
        type='hidden'
        name='id'
        defaultValue={safari.id}
      />
      <div>
        <label className='block text-sm mb-1'>Título (ES)</label>
        <input
          name='title_es'
          defaultValue={safari.title_es}
          className='w-full border px-3 py-2 rounded'
        />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='block text-sm mb-1'>Duración (días)</label>
          <input
            name='duration_days'
            type='number'
            defaultValue={safari.duration_days}
            className='w-full border px-3 py-2 rounded'
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>Desde (USD)</label>
          <input
            name='price_from'
            type='number'
            defaultValue={safari.price_from}
            className='w-full border px-3 py-2 rounded'
          />
        </div>
      </div>
      <div>
        <label className='block text-sm mb-1'>Thumbnail (URL)</label>
        <input
          name='thumbnail'
          defaultValue={safari.thumbnail}
          className='w-full border px-3 py-2 rounded'
        />
        <input
          type='hidden'
          name='thumbnail_thumb'
          defaultValue={safari.thumbnail_thumb || ""}
        />
        <div className='mt-2'>
          <ImageUploader
            label='Subir thumbnail'
            onUploaded={(url, meta) => {
              const input = document.querySelector(
                "input[name=thumbnail]"
              ) as HTMLInputElement | null
              if (input) input.value = url
              const inputThumb = document.querySelector(
                "input[name=thumbnail_thumb]"
              ) as HTMLInputElement | null
              if (inputThumb && meta?.thumbUrl) inputThumb.value = meta.thumbUrl
            }}
          />
        </div>
      </div>
      <div>
        <label className='block text-sm mb-1'>Ubicación</label>
        <input
          name='location'
          defaultValue={safari.location}
          className='w-full border px-3 py-2 rounded'
        />
      </div>
      <div>
        <label className='block text-sm mb-1'>Galería (URLs)</label>
        {(safari.images || []).map((url: string, idx: number) => (
          <input
            key={idx}
            name='images[]'
            defaultValue={url}
            className='w-full border px-3 py-2 rounded mb-2'
          />
        ))}
        <div className='mt-2'>
          <ImageUploader
            label='Subir imágenes (múltiples)'
            multiple
            onUploaded={(url) => {
              const form = document.querySelector("form")
              if (!form) return
              const input = document.createElement("input")
              input.name = "images[]"
              input.value = url
              input.className = "w-full border px-3 py-2 rounded mb-2"
              form.insertBefore(
                input,
                form.querySelector("button[type=submit]")
              )
            }}
          />
        </div>
      </div>
      <button className='inline-flex items-center justify-center rounded bg-[var(--green)] text-white px-4 py-2 font-semibold'>
        Guardar cambios
      </button>
    </form>
  )
}
