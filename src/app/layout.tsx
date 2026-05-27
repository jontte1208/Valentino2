import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { sanityClient } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'
import { getSiteUrl } from '@/lib/siteUrl'

const SITE_URL = getSiteUrl()
const SITE_NAME = 'Pizzeria Valentino'
const SITE_DESCRIPTION =
  'Pizzeria Valentino i Hörby, Skåne — pizza, kebab, pasta och dagens lunch. Öppet alla dagar i veckan.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pizzeria Valentino — Pizza, Kebab & Pasta i Hörby',
    template: '%s | Pizzeria Valentino',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'pizzeria',
    'pizza',
    'kebab',
    'pasta',
    'restaurang',
    'Hörby',
    'Skåne',
    'Valentino',
    'veckans lunch',
    'dagens lunch',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Pizzeria Valentino — Pizza, Kebab & Pasta i Hörby',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pizzeria Valentino — Pizza, Kebab & Pasta i Hörby',
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
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

// JSON-LD: schema.org Restaurant — improves local SEO and rich results.
const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: SITE_NAME,
  url: SITE_URL,
  servesCuisine: ['Italiensk', 'Pizza', 'Kebab', 'Pasta'],
  priceRange: '$$',
  telephone: '+46-415-100-39',
  email: 'pizzeria-valentino@hotmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Nygatan 38',
    postalCode: '242 31',
    addressLocality: 'Hörby',
    addressRegion: 'Skåne',
    addressCountry: 'SE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 55.850975,
    longitude: 13.659759,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '13:00', closes: '21:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '11:30', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '11:00', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '11:30', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '11:30', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '11:30', closes: '23:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '12:00', closes: '23:00' },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
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
