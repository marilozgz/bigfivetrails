"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserBar() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [supabase])

  return (
    <div className='flex items-center justify-between gap-3 rounded-lg border border-[#c6b892]/30 bg-white/90 backdrop-blur p-3'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='h-8 w-8 flex-shrink-0 rounded-full bg-[#1f221b] text-white flex items-center justify-center text-xs'>
          {email ? email[0]?.toUpperCase() : "?"}
        </div>
        <div className='leading-tight min-w-0'>
          <div className='text-sm text-[#1f221b] font-medium truncate max-w-[180px] md:max-w-[260px] lg:max-w-[320px]'>
            {email || "Sin sesión"}
          </div>
          <div className='text-xs text-gray-500'>Conectado</div>
        </div>
      </div>
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.replace("/admin/login")
        }}
        className='px-3 py-1 flex-shrink-0 rounded-md border hover:bg-red-50 text-red-600 text-sm'>
        Salir
      </button>
    </div>
  )
}
