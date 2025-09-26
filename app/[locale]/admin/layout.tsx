import { Link as LocaleLink } from "@/navigation"
import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { FiBookOpen, FiHome, FiImage, FiLogOut } from "react-icons/fi"
import UserBar from "./UserBar"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <>
      <meta
        name='robots'
        content='noindex,nofollow'
      />
      <SuccessBanner />
      <div className='pt-24'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6'>
            <aside className='md:sticky md:top-24 h-max rounded-xl border border-[#c6b892]/30 bg-white/90 backdrop-blur shadow-sm overflow-hidden'>
              <div className='p-4 border-b border-[#c6b892]/30 bg-[#f6f3ee]/40'>
                <UserBar />
              </div>
              <nav className='p-2'>
                <AdminNavItem
                  href={`/admin`}
                  icon={<FiHome />}>
                  Panel
                </AdminNavItem>
                <AdminNavItem
                  href={`/admin/safaris`}
                  icon={<FiImage />}>
                  Safaris
                </AdminNavItem>
                <AdminNavItem
                  href={`/admin/travel-tips`}
                  icon={<FiBookOpen />}>
                  Travel Tips
                </AdminNavItem>
                <form
                  action={`/${locale}/admin/login`}
                  className='mt-2'>
                  <button
                    formAction={`/${locale}/admin/login`}
                    className='w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors'>
                    <FiLogOut />
                    <span>Salir</span>
                  </button>
                </form>
              </nav>
            </aside>
            <main className='min-h-dvh'>{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}

function SuccessBanner() {
  // this is a server component; we can't read searchParams directly here.
  // We'll rely on client-side script to read query and inject banner.
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            if (typeof window === 'undefined') return;
            const p = new URLSearchParams(window.location.search);
            const msg = p.get('success');
            if (!msg) return;
            var bar = document.createElement('div');
            bar.textContent = decodeURIComponent(msg);
            bar.style.background = '#e9f7ef';
            bar.style.color = '#256d3d';
            bar.style.padding = '8px 12px';
            bar.style.border = '1px solid #b7e4c7';
            bar.style.margin = '8px';
            bar.style.borderRadius = '8px';
            document.body.prepend(bar);
          })();
        `
      }}
    />
  )
}

function AdminNavItem({
  href,
  icon,
  children
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <LocaleLink
      href={href}
      className='flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50'>
      <span className='text-gray-600'>{icon}</span>
      <span className='font-medium text-gray-800'>{children}</span>
    </LocaleLink>
  )
}
