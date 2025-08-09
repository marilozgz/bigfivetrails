"use client"
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default function TailorQuoteModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center'>
      {/* Overlay con blur y tono cálido */}
      <div
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-lg bg-[#fdf9f6] text-[#2c2c2c] rounded-xl shadow-2xl p-6 animate-fadeIn ${cormorant.className}`}>
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label='Close'
          className='absolute top-4 right-4 text-[#b3816d] hover:text-[#8f6553] text-xl'>
          ✕
        </button>

        <h2 className='text-2xl font-semibold mb-4 text-center text-[#8f6553]'>
          Get My Tailor-Made Quote
        </h2>
        <p className='text-sm text-[#5c5c5c] text-center mb-6'>
          Fill in your details and our safari experts will get back to you
          within 24 hours.
        </p>

        <form
          className='space-y-4'
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}>
          {/* Número de personas */}
          <div>
            <label className='block mb-1 text-sm text-[#8f6553]'>
              Number of People
            </label>
            <input
              type='number'
              min='1'
              max='20'
              className='w-full rounded-md border border-[#d9c6b4] bg-white px-3 py-2 focus:border-[#d6a77a] focus:ring-1 focus:ring-[#d6a77a] outline-none'
            />
          </div>

          {/* Safari */}
          <div>
            <label className='block mb-1 text-sm text-[#8f6553]'>Safari</label>
            <select className='w-full rounded-md border border-[#d9c6b4] bg-white px-3 py-2 focus:border-[#d6a77a] focus:ring-1 focus:ring-[#d6a77a] outline-none'>
              <option value=''>Select a safari...</option>
              <option value='serengeti'>Serengeti Luxury Escape</option>
              <option value='ngorongoro'>Ngorongoro Crater Adventure</option>
              <option value='tarangire'>Tarangire Flamingo Journey</option>
              <option value='migration'>Great Migration Safari</option>
            </select>
          </div>

          {/* Fechas */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1 text-sm text-[#8f6553]'>
                Start Date
              </label>
              <input
                type='date'
                className='w-full rounded-md border border-[#d9c6b4] bg-white px-3 py-2 focus:border-[#d6a77a] focus:ring-1 focus:ring-[#d6a77a] outline-none'
              />
            </div>
            <div>
              <label className='block mb-1 text-sm text-[#8f6553]'>
                End Date
              </label>
              <input
                type='date'
                className='w-full rounded-md border border-[#d9c6b4] bg-white px-3 py-2 focus:border-[#d6a77a] focus:ring-1 focus:ring-[#d6a77a] outline-none'
              />
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <label className='block mb-1 text-sm text-[#8f6553]'>
              Comments
            </label>
            <textarea
              rows={3}
              placeholder='Tell us more about your dream safari...'
              className='w-full rounded-md border border-[#d9c6b4] bg-white px-3 py-2 focus:border-[#d6a77a] focus:ring-1 focus:ring-[#d6a77a] outline-none'
            />
          </div>

          {/* Botón enviar */}
          <button
            type='submit'
            className='w-full rounded-full bg-[#d6a77a] text-white px-4 py-2 font-semibold shadow hover:bg-[#c19063] transition'>
            Send Request
          </button>
        </form>
      </div>
    </div>
  )
}
