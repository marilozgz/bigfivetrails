"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.replace(`/${locale}/admin`)
  }

  return (
    <div className='min-h-dvh flex items-center justify-center bg-[var(--primary-background)] px-4'>
      <form
        onSubmit={onSubmit}
        className='w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4 border border-gray-200'>
        <h1 className='text-xl font-semibold text-gray-900'>Acceso Admin</h1>
        {error && (
          <div className='text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded'>
            {error}
          </div>
        )}
        <div className='space-y-1'>
          <label className='text-sm text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892]'
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm text-gray-700'>Contraseña</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6b892]'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full inline-flex items-center justify-center rounded-md bg-[#4c692f] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60'>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  )
}
