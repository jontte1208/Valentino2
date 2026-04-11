export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getISOWeekNumber } from '@/lib/weekNumber'
import HeroSection from '@/components/home/HeroSection'
import BenefitsBar from '@/components/home/BenefitsBar'
import WelcomeSection from '@/components/home/WelcomeSection'
import LunchPreview from '@/components/home/LunchPreview'
import GalleryTeaser from '@/components/home/GalleryTeaser'

async function getHomeData() {
  const weekNumber = getISOWeekNumber()
  const year = new Date().getFullYear()

  const [contentRows, lunchDays] = await Promise.all([
    prisma.pageContent.findMany({
      where: { key: { in: ['welcome_text', 'hero_bg_video', 'hero_bg_image', 'welcome_image'] } },
    }),
    prisma.lunchDay.findMany({
      where: { weekNumber, year },
      orderBy: { id: 'asc' },
    }),
  ])

  const content: Record<string, string> = {}
  contentRows.forEach((r) => { content[r.key] = r.value })

  return {
    welcomeText: content.welcome_text ?? 'Välkommen till Valentino.',
    heroBgVideo: content.hero_bg_video ?? '/uploads/pizza.mp4',
    heroBgImage: content.hero_bg_image ?? '',
    welcomeImage: content.welcome_image ?? '',
    lunchDays,
    weekNumber,
  }
}

export default async function HomePage() {
  const { welcomeText, heroBgVideo, heroBgImage, welcomeImage, lunchDays, weekNumber } =
    await getHomeData()

  return (
    <>
      <HeroSection bgVideo={heroBgVideo} bgImage={heroBgImage} />
      <BenefitsBar />
      <WelcomeSection welcomeText={welcomeText} welcomeImage={welcomeImage} />
      <LunchPreview weekNumber={weekNumber} lunchDays={lunchDays} />
      <GalleryTeaser />
    </>
  )
}
