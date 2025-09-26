"use client"

import { useState } from "react"

async function generateWithHF(
  prompt: string
): Promise<{ title?: string; description?: string } | null> {
  try {
    const token = process.env.NEXT_PUBLIC_HF_TOKEN
    if (!token) return null
    const res = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const text =
      (Array.isArray(data) ? data[0]?.generated_text : data?.generated_text) ||
      ""
    const [titleLine, ...rest] = text.split("\n")
    const title = (titleLine || "").replace(/^Title:\s*/i, "").slice(0, 60)
    const description = rest
      .join(" ")
      .replace(/^Description:\s*/i, "")
      .slice(0, 160)
    return { title, description }
  } catch {
    return null
  }
}

function heuristic(
  title: string,
  description: string,
  location?: string,
  highlights?: string[]
): { title: string; description: string } {
  const baseTitle = [title, location, "Big Five Trails"]
    .filter(Boolean)
    .join(" | ")
  const clean = description
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
  const highlightsText = (highlights || []).slice(0, 2).join(" · ")
  const desc = [clean.slice(0, 140), highlightsText]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 160)
  return {
    title: baseTitle.slice(0, 60),
    description: desc
  }
}

export default function SeoGenerator() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    const title =
      (
        document.querySelector(
          'input[name="title_es"]'
        ) as HTMLInputElement | null
      )?.value || ""
    const description =
      (
        document.querySelector(
          'textarea[name="description_es"]'
        ) as HTMLTextAreaElement | null
      )?.value || ""
    const location =
      (
        document.querySelector(
          'input[name="location"]'
        ) as HTMLInputElement | null
      )?.value || ""
    const highlightsRaw =
      (
        document.querySelector(
          'textarea[name="highlights[]"]'
        ) as HTMLTextAreaElement | null
      )?.value || ""
    const highlights = highlightsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    const prompt = `Generate SEO tags for a safari. Title max 60 chars; Description 160 chars.\nTitle: ${title}\nLocation: ${location}\nHighlights: ${highlights.join(
      ", "
    )}\nDescription: ${description}`
    const ai = await generateWithHF(prompt)
    const out =
      ai ||
      heuristic(title || "Safari", description || "", location, highlights)

    const seoTitle = document.querySelector(
      'input[name="seo_title"]'
    ) as HTMLInputElement | null
    const seoDesc = document.querySelector(
      'input[name="seo_description"]'
    ) as HTMLInputElement | null
    if (seoTitle) seoTitle.value = out.title
    if (seoDesc) seoDesc.value = out.description
    if (!ai) setError("Usando generación heurística (sin token HF)")
    setLoading(false)
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={handleClick}
        disabled={loading}
        className='px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-60'>
        {loading ? "Generando…" : "Generar SEO"}
      </button>
      {error && <span className='text-xs text-gray-500'>{error}</span>}
    </div>
  )
}
