import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'
import KontaktClient from './KontaktClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Hitta hit, boka bord eller ring Pizzeria Valentino i Hörby. Adress, telefon, öppettider och karta.',
  alternates: { canonical: '/kontakt' },
  openGraph: { title: 'Kontakt', url: '/kontakt' },
}

const DEFAULTS = {
  address: 'Nygatan 38, 242 31 Hörby, Skåne',
  phone: '0415-100 39',
  email: 'pizzeria-valentino@hotmail.com',
  openingHours: [
    { day: 'Måndag', hours: '13:00–21:00' },
    { day: 'Tisdag', hours: '11:30–22:00' },
    { day: 'Onsdag', hours: '11:00–22:00' },
    { day: 'Torsdag', hours: '11:30–22:00' },
    { day: 'Fredag', hours: '11:30–22:00' },
    { day: 'Lördag', hours: '11:30–23:00' },
    { day: 'Söndag', hours: '12:00–23:00' },
  ],
  lunchHours: 'Tisdag–Fredag: 11:30–14:00',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2271.3!2d13.6597595!3d55.850975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46542b3e3a3a3a3a%3A0x0!2sNygatan%2038%2C%20242%2031%20H%C3%B6rby!5e0!3m2!1ssv!2sse!4v1700000000000',
}

interface SiteSettings {
  address?: string
  phone?: string
  email?: string
  openingHours?: { day: string; hours: string }[]
  lunchHours?: string
  mapEmbedUrl?: string
}

export default async function KontaktPage() {
  const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery)

  return (
    <KontaktClient
      address={settings?.address || DEFAULTS.address}
      phone={settings?.phone || DEFAULTS.phone}
      email={settings?.email || DEFAULTS.email}
      openingHours={
        settings?.openingHours && settings.openingHours.length > 0
          ? settings.openingHours
          : DEFAULTS.openingHours
      }
      lunchHours={settings?.lunchHours || DEFAULTS.lunchHours}
      mapEmbedUrl={settings?.mapEmbedUrl || DEFAULTS.mapEmbedUrl}
    />
  )
}
