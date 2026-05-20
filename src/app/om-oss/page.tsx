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
      aboutText={
        settings?.aboutText ||
        'Valentino grundades av familjen Rossi med en dröm om att ge Stockholmarna en genuin smak av Italien.'
      }
      aboutStory={
        settings?.aboutStory ||
        'Restaurangens inredning speglar det autentiska italienska levnadssättet.'
      }
    />
  )
}
