import { prisma } from '@/lib/prisma'
import MenuClient from './MenuClient'

export const dynamic = 'force-dynamic'

async function getMenuItems() {
  return prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  })
}

export default async function MenyPage() {
  const menuItems = await getMenuItems()
  return <MenuClient menuItems={menuItems} />
}
