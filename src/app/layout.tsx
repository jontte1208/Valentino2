import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { sanityClient } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Valentino — Autentisk Italiensk Restaurang i Stockholm',
  description:
    'Valentino — Autentisk italiensk restaurang i Stockholm. Njut av färsk pasta, pizza och traditionella rätter i en varm och välkomnande miljö sedan 1998.',
  keywords: 'italiensk restaurang, pizza, pasta, Stockholm, Valentino, lunch, middag',
}

interface SiteSettings {
  footerTagline?: string
  address?: string
  phone?: string
  email?: string
  facebookUrl?: string
  instagramUrl?: string
  openingHours?: { day: string; hours: string }[]
  lunchHours?: string
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = (await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery)) ?? {}

  return (
    <html lang="sv">
      <body className="antialiased">
        <ConditionalLayout
          navbar={<Navbar />}
          footer={
            <Footer
              footerTagline={settings.footerTagline}
              address={settings.address}
              phone={settings.phone}
              email={settings.email}
              facebookUrl={settings.facebookUrl}
              instagramUrl={settings.instagramUrl}
              openingHours={settings.openingHours}
              lunchHours={settings.lunchHours}
            />
          }
        >
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
