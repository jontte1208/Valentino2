import { sanityClient } from '@/sanity/client'
import { lunchWeekQuery, siteSettingsQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { getISOWeekNumber } from '@/lib/weekNumber'
import HeroSection from '@/components/home/HeroSection'
import BenefitsBar from '@/components/home/BenefitsBar'
import WelcomeSection from '@/components/home/WelcomeSection'
import LunchPreview from '@/components/home/LunchPreview'
import GalleryTeaser from '@/components/home/GalleryTeaser'

export const revalidate = 60

interface SiteSettings {
  heroLabel?: string
  heroTitle?: string
  heroSubtitle?: string
  heroTagline?: string
  heroImage?: unknown
  aboutTitle?: string
  aboutBody?: unknown
  aboutImage?: unknown
}

interface LunchWeekData {
  days?: Array<{
    dayOfWeek: string
    dishName: string
    description: string
    price: number
  }>
}

async function getHomeData() {
  const weekNumber = getISOWeekNumber()
  const year = new Date().getFullYear()

  const [settings, lunch] = await Promise.all([
    sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
    sanityClient.fetch<LunchWeekData | null>(lunchWeekQuery, { weekNumber, year }),
  ])

  const heroImage = settings?.heroImage
    ? urlFor(settings.heroImage as never).width(1920).url()
    : ''
  const welcomeImage = settings?.aboutImage
    ? urlFor(settings.aboutImage as never).width(1200).url()
    : ''

  const lunchDays = (lunch?.days ?? []).map((d) => ({
    dayOfWeek: d.dayOfWeek,
    dishName: d.dishName,
    price: d.price,
  }))

  return {
    heroLabel: settings?.heroLabel ?? 'Pizzeria & Restaurang — Hörby, Skåne',
    heroTitle: settings?.heroTitle ?? 'Valentino',
    heroSubtitle:
      settings?.heroSubtitle ?? 'Pizzeria & Restaurang i hjärtat av Hörby',
    heroTagline:
      settings?.heroTagline ??
      'Pizza, kebab, pasta och mycket mer — lagat med kärlek och de bästa råvarorna. Öppet alla dagar i veckan',
    welcomeText: '',
    heroBgVideo: '/uploads/pizza.mp4',
    heroBgImage: heroImage,
    welcomeImage,
    lunchDays,
    weekNumber,
  }
}

export default async function HomePage() {
  const {
    heroLabel,
    heroTitle,
    heroSubtitle,
    heroTagline,
    welcomeText,
    heroBgVideo,
    heroBgImage,
    welcomeImage,
    lunchDays,
    weekNumber,
  } = await getHomeData()

  return (
    <>
      <HeroSection
        bgVideo={heroBgVideo}
        bgImage={heroBgImage}
        label={heroLabel}
        title={heroTitle}
        subtitle={heroSubtitle}
        tagline={heroTagline}
      />
      <BenefitsBar />
      <WelcomeSection welcomeText={welcomeText} welcomeImage={welcomeImage} />
      <LunchPreview weekNumber={weekNumber} lunchDays={lunchDays} />
      <GalleryTeaser />
    </>
  )
}
