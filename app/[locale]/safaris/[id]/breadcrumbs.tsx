import Link from "next/link"

export default function Breadcrumbs({
  locale,
  code,
  title
}: {
  locale: string
  code: string
  title: string
}) {
  const items = [
    { href: `/${locale}`, label: "Home" },
    { href: `/${locale}/safaris`, label: "Safaris" },
    { href: `/${locale}/safaris/${code}`, label: title }
  ]
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: it.href
    }))
  }
  return (
    <>
      <nav className='text-sm text-gray-600 mb-4'>
        {items.map((it, i) => (
          <span key={it.href}>
            {i > 0 && <span className='mx-1'>/</span>}
            <Link
              href={it.href}
              className='hover:underline'>
              {it.label}
            </Link>
          </span>
        ))}
      </nav>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  )
}
