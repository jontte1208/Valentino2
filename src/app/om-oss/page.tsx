import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'
import type { SiteSettings } from '@/sanity/types'
import OmOssClient from './OmOssClient'

// Om oss-innehåll ändras sällan — 1h ISR räcker.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Om oss',
  description:
    'Pizzeria Valentino i Hörby — en familjerestaurang med fokus på goda råvaror, generösa portioner och välkomnande gästvänlighet.',
  alternates: { canonical: '/om-oss' },
  openGraph: { title: 'Om oss', url: '/om-oss' },
}

export default async function OmOssPage() {
  const settings = await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery)

  return (
    <OmOssClient
      aboutTitle={settings?.aboutTitle || 'En familjerestaurang med hjärta och historia'}
      aboutText={
        settings?.aboutText ||
        'Pizzeria Valentino i Hörby serverar pizza, kebab och pasta med fokus på goda råvaror, generösa portioner och välkomnande gästvänlighet.'
      }
      aboutStory={
        settings?.aboutStory ||
        'Vi har varit en del av Hörbys vardag i många år — en plats där grannar, familjer och nya gäster möts över en nybakad pizza.'
      }
    />
  )
}
