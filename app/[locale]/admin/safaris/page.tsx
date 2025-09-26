import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import ConfirmSubmit from "../ConfirmSubmit"
import GalleryUploader from "../GalleryUploader"
import HighlightsChipsPreview from "../HighlightsChipsPreview"
import ItineraryEditor from "../ItineraryEditor"
import SeoGenerator from "../SeoGenerator"
import Tabs from "../Tabs"
import ThumbnailUploader from "../ThumbnailUploader"

async function requireSession() {
  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export default async function SafarisAdmin({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; page?: string; mode?: string }>
}) {
  const user = await requireSession()
  const locale = await getLocale()
  if (!user) redirect(`/${locale}/admin/login`)

  const params = ((await (searchParams ?? Promise.resolve(undefined))) ??
    {}) as {
    q?: string
    page?: string
    mode?: string
  }
  const { q = "", page = "1", mode } = params
  const currentPage = Math.max(1, parseInt(page || "1"))
  const pageSize = 10
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let safaris: any[] | null = null
  let count: number | null = null
  if (mode !== "new") {
    let query = supabase
      .from("safaris")
      .select(
        "id, code, title_es, price_from, duration_days, thumbnail, thumbnail_thumb",
        { count: "exact" }
      )
      .order("inserted_at", { ascending: false })
      .range(from, to)
    if (q) query = query.ilike("title_es", `%${q}%`)
    const res = await query
    safaris = res.data
    count = res.count
  }

  return (
    <div className='min-h-dvh max-w-5xl mx-auto p-4 md:p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-3xl font-semibold tracking-tight text-[#1f221b]'>
          Safaris
        </h1>
        {mode === "new" ? (
          <Link
            href={`/admin/safaris${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className='px-4 py-2 rounded-lg border hover:bg-gray-50'>
            Cancelar
          </Link>
        ) : (
          <Link
            href={`/admin/safaris?mode=new${
              q ? `&q=${encodeURIComponent(q)}` : ""
            }`}
            className='px-4 py-2 rounded-lg bg-[#4c692f] hover:bg-[#3f5826] text-white'>
            Añadir safari
          </Link>
        )}
      </div>

      {mode === "new" ? (
        <AddSafariForm />
      ) : (
        <>
          <SearchBar q={q} />
          <h2 className='text-xl font-semibold mt-6 mb-3'>Listado</h2>
          <div className='divide-y border rounded-xl bg-white/90 backdrop-blur shadow-sm'>
            {(safaris || []).map((s) => (
              <SafariRow
                key={s.id}
                safari={s}
              />
            ))}
            {(!safaris || safaris.length === 0) && (
              <div className='p-4 text-sm text-gray-600'>
                Aún no hay safaris.
              </div>
            )}
          </div>
          <Pagination
            total={count || 0}
            pageSize={pageSize}
            currentPage={currentPage}
            q={q}
          />
        </>
      )}
    </div>
  )
}

async function addSafari(formData: FormData) {
  "use server"
  const supabase = createSupabaseServerClient()
  const title_es = String(formData.get("title_es") || "").trim()
  const title_en = String(formData.get("title_en") || "").trim()
  const title_fr = String(formData.get("title_fr") || "").trim()
  const title_it = String(formData.get("title_it") || "").trim()
  const title_de = String(formData.get("title_de") || "").trim()
  const description_es = String(formData.get("description_es") || "").trim()
  const description_en = String(formData.get("description_en") || "").trim()
  const description_fr = String(formData.get("description_fr") || "").trim()
  const description_it = String(formData.get("description_it") || "").trim()
  const description_de = String(formData.get("description_de") || "").trim()
  const duration_daysRaw = formData.get("duration_days")
  const price_fromRaw = formData.get("price_from")
  const maxGroupSizeRaw = formData.get("maxGroupSize")
  const difficulty = String(formData.get("difficulty") || "").trim()
  const bestTime = String(formData.get("bestTime") || "").trim()
  const transportation = String(formData.get("transportation") || "").trim()
  const accommodation = String(formData.get("accommodation") || "").trim()
  const seo_title = String(formData.get("seo_title") || "").trim()
  const seo_description = String(formData.get("seo_description") || "").trim()

  const thumbnailRaw = String(formData.get("thumbnail") || "").trim()
  const thumbnail_thumbRaw = String(
    formData.get("thumbnail_thumb") || ""
  ).trim()
  const thumbnail_alt = String(formData.get("thumbnail_alt") || "").trim()
  const og_image = String(formData.get("og_image") || "").trim()
  const location = String(formData.get("location") || "").trim()
  const images = (formData.getAll("images[]") || []).map(String).filter(Boolean)
  const highlights = (formData.getAll("highlights[]") || [])
    .map(String)
    .filter(Boolean)
  const itineraryJson = String(formData.get("itinerary") || "[]")

  const duration_days = duration_daysRaw ? Number(duration_daysRaw) : undefined
  const price_from = price_fromRaw ? Number(price_fromRaw) : undefined
  const maxGroupSize = maxGroupSizeRaw ? Number(maxGroupSizeRaw) : undefined

  // Generar código único automáticamente a partir del título (preferencia ES)
  function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60)
  }

  const baseTitle =
    title_es ||
    title_en ||
    title_fr ||
    title_it ||
    title_de ||
    location ||
    "safari"
  let candidate = slugify(baseTitle) || `safari-${Date.now()}`
  // Asegurar unicidad: si existe, añadir sufijo incremental
  let suffix = 1
  while (true) {
    const { data: existing, error: existErr } = await supabase
      .from("safaris")
      .select("id")
      .eq("code", candidate)
      .limit(1)
    if (existErr) break
    if (!existing || existing.length === 0) break
    suffix += 1
    candidate = `${slugify(baseTitle)}-${suffix}`
  }
  const code = candidate

  await supabase.from("safaris").insert({
    code,
    title_es,
    title_en: title_en || undefined,
    title_fr: title_fr || undefined,
    title_it: title_it || undefined,
    title_de: title_de || undefined,
    description_es: description_es || undefined,
    description_en: description_en || undefined,
    description_fr: description_fr || undefined,
    description_it: description_it || undefined,
    description_de: description_de || undefined,
    duration_days,
    price_from,
    maxGroupSize,
    difficulty: difficulty || undefined,
    bestTime: bestTime || undefined,
    transportation: transportation || undefined,
    accommodation: accommodation || undefined,
    seo_title: seo_title || undefined,
    seo_description: seo_description || undefined,
    thumbnail: thumbnailRaw || undefined,
    thumbnail_thumb: thumbnail_thumbRaw || undefined,
    thumbnail_alt: thumbnail_alt || undefined,
    og_image: og_image || undefined,
    location,
    images,
    highlights: highlights.length ? highlights : undefined,
    itinerary: itineraryJson
      ? (JSON.parse(itineraryJson) as unknown)
      : undefined
  })
  redirect(
    `/admin/safaris?success=${encodeURIComponent(
      "Safari creado correctamente"
    )}`
  )
}

function Section({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='rounded-lg border border-[#c6b892]/30'>
      <div className='px-3 py-2 bg-gray-50 font-medium text-[#1f221b] rounded-t-lg'>
        {title}
      </div>
      <div className='p-3 space-y-4'>{children}</div>
    </div>
  )
}

function AddSafariForm() {
  return (
    <form
      action={addSafari}
      className='bg-white/90 backdrop-blur shadow-sm border border-[#c6b892]/30 rounded-xl p-4 md:p-5 space-y-5'>
      <Section title='Datos básicos'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
              Ubicación
            </label>
            <input
              name='location'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
              Duración (días)
            </label>
            <input
              name='duration_days'
              type='number'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
              Desde (USD)
            </label>
            <input
              name='price_from'
              type='number'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
        </div>
      </Section>

      <Section title='Contenido'>
        <Tabs
          items={[
            {
              key: "es",
              label: "Español",
              content: (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm mb-1'>Título (ES)</label>
                    <input
                      name='title_es'
                      required
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>
                      Descripción (ES)
                    </label>
                    <textarea
                      name='description_es'
                      rows={4}
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                </div>
              )
            },
            {
              key: "en",
              label: "English",
              content: (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm mb-1'>Title (EN)</label>
                    <input
                      name='title_en'
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>
                      Description (EN)
                    </label>
                    <textarea
                      name='description_en'
                      rows={4}
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                </div>
              )
            },
            {
              key: "fr",
              label: "Français",
              content: (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm mb-1'>Titre (FR)</label>
                    <input
                      name='title_fr'
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>
                      Description (FR)
                    </label>
                    <textarea
                      name='description_fr'
                      rows={4}
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                </div>
              )
            },
            {
              key: "it",
              label: "Italiano",
              content: (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm mb-1'>Titolo (IT)</label>
                    <input
                      name='title_it'
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>
                      Descrizione (IT)
                    </label>
                    <textarea
                      name='description_it'
                      rows={4}
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                </div>
              )
            },
            {
              key: "de",
              label: "Deutsch",
              content: (
                <div className='space-y-3'>
                  <div>
                    <label className='block text-sm mb-1'>Titel (DE)</label>
                    <input
                      name='title_de'
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>
                      Beschreibung (DE)
                    </label>
                    <textarea
                      name='description_de'
                      rows={4}
                      className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
                    />
                  </div>
                </div>
              )
            }
          ]}
        />
      </Section>

      <Section title='Medios'>
        <div>
          <label className='block text-sm mb-1'>Thumbnail (URL)</label>
          <input
            name='thumbnail'
            className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          />
          <input
            type='hidden'
            name='thumbnail_thumb'
          />
          <div className='mt-2'>
            <ThumbnailUploader
              targetInputName='thumbnail'
              targetThumbInputName='thumbnail_thumb'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm mb-1'>Alt del thumbnail</label>
          <input
            name='thumbnail_alt'
            className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          />
        </div>
        <div>
          <label className='block text-sm mb-2'>Galería (URLs)</label>
          <input
            name='images[]'
            className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg mb-2 outline-none'
            placeholder='URL de imagen'
          />
          <div className='mt-2'>
            <GalleryUploader targetName='images[]' />
          </div>
        </div>
        <div>
          <label className='block text-sm mb-1'>
            OG Image (URL para redes)
          </label>
          <input
            name='og_image'
            className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          />
        </div>
      </Section>

      <Section title='Detalles'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <div>
            <label className='block text-sm mb-1'>Capacidad (max)</label>
            <input
              name='maxGroupSize'
              type='number'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Dificultad</label>
            <input
              name='difficulty'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Mejor época</label>
            <input
              name='bestTime'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm mb-1'>Transporte</label>
            <input
              name='transportation'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>Alojamiento</label>
            <input
              name='accommodation'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm mb-1'>
            Highlights (uno por línea)
          </label>
          <textarea
            name='highlights[]'
            rows={3}
            placeholder={"Punto fuerte 1\nPunto fuerte 2"}
            className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          />
          <HighlightsChipsPreview />
        </div>
      </Section>

      <Section title='Itinerario'>
        <ItineraryEditor targetName='itinerary' />
      </Section>

      <Section title='SEO'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm mb-1'>SEO title</label>
            <input
              name='seo_title'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>SEO description</label>
            <input
              name='seo_description'
              className='w-full border border-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
            />
          </div>
        </div>
        <SeoGenerator />
      </Section>

      <button className='inline-flex items-center justify-center rounded-lg bg-[#4c692f] hover:bg-[#3f5826] text-white px-4 py-2 font-semibold shadow-sm transition-colors'>
        Guardar
      </button>
    </form>
  )
}

function SearchBar({ q }: { q: string }) {
  return (
    <form
      className='mb-4 flex gap-2'
      action='/admin/safaris'
      method='get'>
      <input
        name='q'
        defaultValue={q}
        placeholder='Buscar…'
        className='border border-[#c6b892]/40 focus:border-[#c6b892] focus:ring-[#c6b892]/40 px-3 py-2 rounded-lg w-full outline-none'
      />
      <button className='px-4 py-2 rounded-lg bg-[#1f221b] hover:bg-[#33362f] text-white transition-colors'>
        Buscar
      </button>
    </form>
  )
}

function Pagination({
  total,
  pageSize,
  currentPage,
  q
}: {
  total: number
  pageSize: number
  currentPage: number
  q: string
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageLink = (p: number) =>
    q ? `?page=${p}&q=${encodeURIComponent(q)}` : `?page=${p}`
  return (
    <div className='flex items-center gap-2 mt-4'>
      <Link
        href={pageLink(Math.max(1, currentPage - 1))}
        className='px-3 py-1 border rounded'>
        Anterior
      </Link>
      <span className='text-sm'>
        Página {currentPage} de {totalPages}
      </span>
      <Link
        href={pageLink(Math.min(totalPages, currentPage + 1))}
        className='px-3 py-1 border rounded'>
        Siguiente
      </Link>
    </div>
  )
}

type SafariListItem = {
  id: string
  code: string
  title_es?: string
  price_from?: number
  duration_days?: number
  thumbnail?: string
  thumbnail_thumb?: string
}

function SafariRow({ safari }: { safari: SafariListItem }) {
  return (
    <div className='flex items-center gap-3 p-3 hover:bg-[#f6f3ee]/50 transition-colors'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={safari.thumbnail_thumb || safari.thumbnail || ""}
        alt={safari.title_es || safari.code}
        className='w-12 h-12 object-cover rounded ring-1 ring-[#c6b892]/30'
      />
      <div className='flex-1'>
        <div className='font-medium text-[#1f221b]'>
          {safari.title_es || safari.code}
        </div>
        <div className='text-xs text-gray-500'>
          {safari.duration_days} días · ${safari.price_from}
        </div>
      </div>
      <Link
        href={`/admin/edit/${safari.id}`}
        className='text-sm text-[#4c692f] hover:text-[#3f5826] underline'>
        Editar
      </Link>
      <form action={deleteSafari.bind(null, safari.id)}>
        <ConfirmSubmit>Borrar</ConfirmSubmit>
      </form>
    </div>
  )
}

async function deleteSafari(id: string) {
  "use server"
  const supabase = createSupabaseServerClient()
  await supabase.from("safaris").delete().eq("id", id)
  redirect(`/admin/safaris?success=${encodeURIComponent("Safari borrado")}`)
}
