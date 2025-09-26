/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from "@supabase/ssr"

export function createSupabaseServerClient(cookieStore?: {
  get?: (name: string) => string | { value?: string } | undefined
  set?: (...args: any[]) => void
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey)
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY")

  const adapter = cookieStore
    ? {
        get(name: string) {
          const v = cookieStore.get?.(name) as unknown as
            | string
            | { value?: string }
            | undefined
          return typeof v === "string" ? v : v?.value
        },
        set(name: string, value: string, options: any) {
          if (!cookieStore || typeof cookieStore.set !== "function") return
          try {
            // Preferimos la forma objeto
            try {
              cookieStore.set({ name, value, ...options })
            } catch {
              // Alternativa (name, value, options)
              cookieStore.set(name, value, options)
            }
          } catch {
            // En entornos donde Next.js no permite mutar cookies (fuera de Server Actions/Route Handlers)
            // silenciamos el intento de escritura para evitar fallos en tiempo de ejecución.
          }
        },
        remove(name: string, options: any) {
          if (!cookieStore || typeof cookieStore.set !== "function") return
          try {
            try {
              cookieStore.set({ name, value: "", ...options, maxAge: 0 })
            } catch {
              cookieStore.set(name, "", { ...(options || {}), maxAge: 0 })
            }
          } catch {
            // Igual que en set, ignoramos cuando la mutación no está permitida
          }
        }
      }
    : {
        get() {
          return undefined as unknown as string
        },
        set() {},
        remove() {}
      }

  return createServerClient(url, anonKey, { cookies: adapter })
}
