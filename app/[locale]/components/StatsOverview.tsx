import Link from "next/link"

type SafariSummary = {
  id: string
  code: string
  title: string
  price_from?: number
  duration_days?: number
}

export default function StatsOverview({
  safaris,
  tipsCount
}: {
  safaris: SafariSummary[]
  tipsCount: number
}) {
  const top = safaris.slice(0, 5)
  return (
    <section className='mx-auto max-w-7xl px-4 mt-10'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm p-4'>
          <h3 className='text-lg font-semibold mb-2'>Resumen</h3>
          <div className='text-sm text-gray-700 space-y-1'>
            <div>Total safaris: {safaris.length}</div>
            <div>Recomendaciones: {tipsCount}</div>
          </div>
        </div>
        <div className='md:col-span-2 rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm overflow-hidden'>
          <div className='px-4 py-3 border-b bg-gray-50'>
            <h3 className='text-lg font-semibold'>Safaris destacados</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='text-left p-2'>Código</th>
                  <th className='text-left p-2'>Título</th>
                  <th className='text-left p-2'>Días</th>
                  <th className='text-left p-2'>Desde</th>
                </tr>
              </thead>
              <tbody>
                {top.map((s) => (
                  <tr
                    key={s.id}
                    className='border-t'>
                    <td className='p-2'>{s.code}</td>
                    <td className='p-2'>{s.title}</td>
                    <td className='p-2'>{s.duration_days ?? "-"}</td>
                    <td className='p-2'>
                      {s.price_from ? `$${s.price_from}` : "-"}
                    </td>
                  </tr>
                ))}
                {top.length === 0 && (
                  <tr>
                    <td
                      className='p-3 text-gray-600'
                      colSpan={4}>
                      Aún no hay safaris cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='px-4 py-3 border-t bg-gray-50 text-right'>
            <Link
              href='/safaris'
              className='text-[#4c692f] hover:text-[#3f5826] underline'>
              Ver todos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
