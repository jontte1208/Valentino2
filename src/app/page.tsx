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

  const [welcomeContent, lunchDays] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: 'welcome_text' } }),
    prisma.lunchDay.findMany({
      where: { weekNumber, year },
      orderBy: { id: 'asc' },
    }),
  ])

  return {
    welcomeText: welcomeContent?.value ?? 'Välkommen till Valentino.',
    lunchDays,
    weekNumber,
  }
}

export default async function HomePage() {
  const { welcomeText, lunchDays, weekNumber } = await getHomeData()

  return (
    <>
      <HeroSection />
      <BenefitsBar />
      <WelcomeSection welcomeText={welcomeText} />
      <LunchPreview weekNumber={weekNumber} lunchDays={lunchDays} />
      <GalleryTeaser />
    </>
  )
}
