import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

type TravelTip = {
  id: string
  country: string
  section: string
  locale: string
  content: string
}

async function requireAdmin() {
  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)
  const { data } = await supabase.auth.getUser()
  return !!data.user
}

export default async function TravelTipsAdmin() {
  const ok = await requireAdmin()
  const locale = await getLocale()
  if (!ok) {
    redirect(`/${locale}/admin/login`)
  }
  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)
  const { data: tips } = await supabase
    .from("travel_tips")
    .select("id,country,section,locale,content")
    .eq("locale", locale)
    .order("country")

  return (
    <div className='min-h-dvh max-w-5xl mx-auto p-4 md:p-6'>
      <h1 className='text-3xl font-semibold tracking-tight text-[#1f221b] mb-4'>
        Travel Tips
      </h1>
      <CreateForm locale={locale} />

      <h2 className='text-xl font-semibold mt-8 mb-3'>
        Entradas ({tips?.length || 0})
      </h2>
      <div className='overflow-hidden rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='text-left p-2'>País</th>
              <th className='text-left p-2'>Sección</th>
              <th className='text-left p-2'>Locale</th>
              <th className='text-left p-2'>Contenido (preview)</th>
              <th className='text-left p-2'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(tips || []).map((t) => (
              <tr
                key={t.id}
                className='border-t'>
                <td className='p-2 capitalize'>{t.country}</td>
                <td className='p-2 capitalize'>{t.section}</td>
                <td className='p-2'>{t.locale}</td>
                <td className='p-2 text-gray-600'>
                  {t.content.slice(0, 120)}
                  {t.content.length > 120 ? "…" : ""}
                </td>
                <td className='p-2'>
                  <Link
                    className='text-[#4c692f] underline'
                    href={`/${locale}/admin/travel-tips/edit/${t.id}`}>
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {(tips || []).length === 0 && (
              <tr>
                <td
                  className='p-3 text-gray-600'
                  colSpan={5}>
                  No hay contenidos todavía para {locale}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function createTip(formData: FormData) {
  "use server"
  const country = String(formData.get("country") || "").trim()
  const section = String(formData.get("section") || "").trim()
  const locale = String(formData.get("locale") || "").trim()
  const content = String(formData.get("content") || "").trim()

  if (!country || !section || !locale || !content) {
    throw new Error("Faltan campos obligatorios")
  }
  const supabase = createSupabaseServerClient()
  await supabase
    .from("travel_tips")
    .upsert(
      { country, section, locale, content },
      { onConflict: "country,section,locale" }
    )
  redirect(
    `/admin/travel-tips?success=${encodeURIComponent("Contenido guardado")}`
  )
}

function CreateForm({ locale }: { locale: string }) {
  return (
    <form
      action={createTip}
      className='bg-white/90 backdrop-blur shadow-sm border border-[#c6b892]/30 rounded-xl p-4 md:p-5 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        <div>
          <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
            País
          </label>
          <select
            name='country'
            className='w-full border border-[#c6b892]/40 focus:border-[#c6b892] focus:ring-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'>
            <option value='tanzania'>Tanzania</option>
            <option value='kenya'>Kenia</option>
          </select>
        </div>
        <div>
          <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
            Sección
          </label>
          <select
            name='section'
            className='w-full border border-[#c6b892]/40 focus:border-[#c6b892] focus:ring-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'>
            <option value='visas'>Visados</option>
            <option value='health'>Salud</option>
            <option value='money'>Dinero</option>
            <option value='luggage'>Equipaje</option>
            <option value='tipping'>Propinas</option>
          </select>
        </div>
        <div>
          <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
            Idioma
          </label>
          <input
            name='locale'
            defaultValue={locale}
            className='w-full border border-[#c6b892]/40 focus:border-[#c6b892] focus:ring-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          />
        </div>
      </div>
      <div>
        <label className='block text-sm mb-1 text-[#1f221b] font-medium'>
          Contenido
        </label>
        <textarea
          name='content'
          rows={6}
          className='w-full border border-[#c6b892]/40 focus:border-[#c6b892] focus:ring-[#c6b892]/40 px-3 py-2 rounded-lg outline-none'
          placeholder='Contenido en texto o HTML simple'
        />
      </div>
      <button className='inline-flex items-center justify-center rounded-lg bg-[#4c692f] hover:bg-[#3f5826] text-white px-4 py-2 font-semibold shadow-sm transition-colors'>
        Guardar
      </button>
    </form>
  )
}
