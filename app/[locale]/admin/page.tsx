import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getLocale } from "next-intl/server"
import { cookies } from "next/headers"
import Link from "next/link"

async function requireSession() {
  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return null
  return user
}

export default async function AdminDashboard() {
  const user = await requireSession()
  const locale = await getLocale()
  const jar = await cookies()
  const supabase = createSupabaseServerClient(jar)

  if (!user) {
    return (
      <div className='min-h-dvh flex items-center justify-center'>
        <div className='bg-white p-6 rounded shadow border'>
          <p className='mb-4'>Debes iniciar sesión.</p>
          <Link
            href={`/${locale}/admin/login`}
            className='text-[#4c692f] underline'>
            Ir a login
          </Link>
        </div>
      </div>
    )
  }

  const [{ count: safarisCount }, { count: tipsCount }] = await Promise.all([
    supabase.from("safaris").select("id", { count: "exact", head: true }),
    supabase
      .from("travel_tips")
      .select("id", { count: "exact", head: true })
      .eq("locale", locale)
  ])

  return (
    <div className='min-h-dvh max-w-5xl mx-auto p-4 md:p-6'>
      <h1 className='text-3xl font-semibold tracking-tight text-[#1f221b] mb-6'>
        Panel
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          title='Safaris'
          value={safarisCount || 0}
          href='/admin/safaris'
        />
        <StatCard
          title='Travel Tips'
          value={tipsCount || 0}
          href='/admin/travel-tips'
        />
        <QuickLinks />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  href
}: {
  title: string
  value: number
  href: string
}) {
  return (
    <Link
      href={href}
      className='block rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm p-4 hover:bg-[#f6f3ee]/50 transition-colors'>
      <div className='text-sm text-gray-600'>{title}</div>
      <div className='text-3xl font-semibold text-[#1f221b]'>{value}</div>
      <div className='mt-2 text-[#4c692f] underline text-sm'>
        Ir a gestionar
      </div>
    </Link>
  )
}

function QuickLinks() {
  return (
    <div className='rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm p-4'>
      <div className='text-sm text-gray-600 mb-2'>Accesos rápidos</div>
      <div className='flex flex-wrap gap-2'>
        <Link
          href='/admin/safaris'
          className='px-3 py-2 rounded-lg border hover:bg-gray-50'>
          Safaris
        </Link>
        <Link
          href='/admin/travel-tips'
          className='px-3 py-2 rounded-lg border hover:bg-gray-50'>
          Travel Tips
        </Link>
      </div>
    </div>
  )
}
