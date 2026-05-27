import { sanityClient } from '@/sanity/client'
import { siteSettingsQuery } from '@/sanity/queries'
import OmOssClient from './OmOssClient'

export const revalidate = 60

interface SiteSettings {
  aboutTitle?: string
  aboutText?: string
  aboutStory?: string
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
