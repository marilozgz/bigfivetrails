import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getLocale } from "next-intl/server"
import { redirect } from "next/navigation"

async function updateTip(id: string, formData: FormData) {
  "use server"
  const supabase = createSupabaseServerClient()
  const content = String(formData.get("content") || "").trim()
  if (!content) throw new Error("Contenido requerido")
  await supabase.from("travel_tips").update({ content }).eq("id", id)
  redirect(`/admin/travel-tips?success=${encodeURIComponent("Actualizado")}`)
}

export default async function EditTravelTip({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = await getLocale()
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from("travel_tips")
    .select("id,country,section,locale,content")
    .eq("id", id)
    .single()
  if (!data) redirect(`/${locale}/admin/travel-tips`)
  return (
    <div>
      <h1 className='text-2xl font-semibold mb-4'>Editar Travel Tip</h1>
      <form action={updateTip.bind(null, id)} className='bg-white border rounded p-4 space-y-3'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-sm'>
          <div>
            <div className='text-gray-500'>País</div>
            <div className='font-medium capitalize'>{data.country}</div>
          </div>
          <div>
            <div className='text-gray-500'>Sección</div>
            <div className='font-medium capitalize'>{data.section}</div>
          </div>
          <div>
            <div className='text-gray-500'>Idioma</div>
            <div className='font-medium'>{data.locale}</div>
          </div>
        </div>
        <div>
          <label className='block text-sm mb-1'>Contenido</label>
          <textarea
            name='content'
            defaultValue={data.content || ""}
            rows={10}
            className='w-full border px-3 py-2 rounded'
          />
        </div>
        <button className='inline-flex items-center justify-center rounded bg-[var(--green)] text-white px-4 py-2 font-semibold'>
          Guardar cambios
        </button>
      </form>
    </div>
  )
}


