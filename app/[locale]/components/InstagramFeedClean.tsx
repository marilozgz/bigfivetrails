"use client"

import { useEffect } from "react"

// --- Componente principal del Feed ---
export default function InstagramTailwindFeed() {
  // Hook para cargar el script de Elfsight
  useEffect(() => {
    // Cargar Elfsight script
    const existingScript = document.querySelector(
      'script[src="https://elfsightcdn.com/platform.js"]'
    )
    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "https://elfsightcdn.com/platform.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <section className='py-[120px] px-[5%]'>
      <div className='mx-auto max-w-7xl'>
        {/* Elfsight Instagram Feed */}
        <div
          className='elfsight-app-ed506b97-357e-490f-9cf7-25ae764c1f90'
          data-elfsight-app-lazy
        />
      </div>
    </section>
  )
}
