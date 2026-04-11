import { prisma } from '@/lib/prisma'
import { getISOWeekNumber } from '@/lib/weekNumber'
import VeckansLunchClient from './VeckansLunchClient'

export const dynamic = 'force-dynamic'

async function getLunchData() {
  const weekNumber = getISOWeekNumber()
  const year = new Date().getFullYear()

  try {
    const [lunchDays, soup] = await Promise.all([
      prisma.lunchDay.findMany({
        where: { weekNumber, year },
        orderBy: { id: 'asc' },
      }),
      prisma.weeklySoup.findFirst({
        where: { weekNumber, year },
      }),
    ])
    return { lunchDays, soup, weekNumber }
  } catch {
    return { lunchDays: [], soup: null, weekNumber }
  }
}

export default async function VeckansLunchPage() {
  const { lunchDays, soup, weekNumber } = await getLunchData()
  return <VeckansLunchClient lunchDays={lunchDays} soup={soup} weekNumber={weekNumber} />
}
