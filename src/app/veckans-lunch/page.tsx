import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { lunchWeekQuery } from '@/sanity/queries'
import { getISOWeekNumber } from '@/lib/weekNumber'
import VeckansLunchClient from './VeckansLunchClient'

// ISR: revalideras varje minut. När måndag slår över byts veckan automatiskt
// inom kort efter att tiden passerat 00:00.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Veckans lunch',
  description:
    'Veckans lunch på Pizzeria Valentino i Hörby — dagens rätt måndag till fredag, inklusive sallad, saft, kaffe och kaka.',
  alternates: { canonical: '/veckans-lunch' },
  openGraph: { title: 'Veckans lunch', url: '/veckans-lunch' },
}

interface LunchWeek {
  weekNumber: number
  year: number
  days?: Array<{
    dayOfWeek: string
    dishName: string
    description: string
    price: number
  }>
  soup?: { name: string; description: string; price: number } | null
}

async function getLunchData() {
  const weekNumber = getISOWeekNumber()
  const year = new Date().getFullYear()

  const data = await sanityClient.fetch<LunchWeek | null>(lunchWeekQuery, {
    weekNumber,
    year,
  })

  // Anpassa till befintligt VeckansLunchClient-API (lunchDays-array + soup)
  const lunchDays = (data?.days ?? []).map((d, i) => ({
    id: i + 1,
    dayOfWeek: d.dayOfWeek,
    dishName: d.dishName,
    description: d.description,
    price: d.price,
  }))

  const soup = data?.soup
    ? {
        id: 1,
        name: data.soup.name,
        description: data.soup.description,
        price: data.soup.price,
      }
    : null

  return { lunchDays, soup, weekNumber }
}

export default async function VeckansLunchPage() {
  const { lunchDays, soup, weekNumber } = await getLunchData()
  return (
    <VeckansLunchClient
      lunchDays={lunchDays}
      soup={soup}
      weekNumber={weekNumber}
    />
  )
}
