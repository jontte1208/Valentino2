import { sanityClient } from '@/sanity/client'
import { menuItemsQuery } from '@/sanity/queries'
import MenuClient from './MenuClient'

export const revalidate = 60

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
    order: it.order,
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MenuClient menuItems={menuItems as any} />
}
