import { locales } from "@/i18n"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "../../routing"
import "../globals.css"
import Header from "./components/Header"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
export const metadata: Metadata = {
  title: "Big Five Trails",
  description: "Big Five Trails Best Safari Tours in Tanzania"
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <Header />
          {children}
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
