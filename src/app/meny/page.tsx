import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { menuItemsQuery } from '@/sanity/queries'
import MenuClient from './MenuClient'

// Meny ändras sällan — 1h ISR räcker.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Meny',
  description:
    'Hela menyn på Pizzeria Valentino i Hörby — pizza, pasta, kebab, sallader och mer. Färska råvaror, generösa portioner.',
  alternates: { canonical: '/meny' },
  openGraph: { title: 'Meny', url: '/meny' },
}

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  pizzaType?: string
  order: number
}

async function getMenuItems(): Promise<MenuItem[]> {
  return sanityClient.fetch<MenuItem[]>(menuItemsQuery)
}

export default async function MenyPage() {
  const items = await getMenuItems()

  // Anpassa till MenuClient som förväntar sig { id: number }.
  // Sanity ger oss _id (string) — vi mappar för bakåtkompatibilitet.
  const menuItems = items.map((it, i) => ({
    id: i + 1,
    name: it.name,
    description: it.description,
    price: it.price,
    category: it.category,
    pizzaType: it.pizzaType ?? null,
  }))

  return <MenuClient menuItems={menuItems} />
}
