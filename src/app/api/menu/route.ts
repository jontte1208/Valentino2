import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const body = await request.json()
    const { name, description, price, category, pizzaType, order } = body

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof description !== 'string' ||
      typeof category !== 'string' || !category.trim() ||
      price === undefined || price === null
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const priceNum = Number.parseFloat(String(price))
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 100000) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const item = await prisma.menuItem.create({
      data: {
        name: name.slice(0, 200),
        description: description.slice(0, 1000),
        price: priceNum,
        category: category.slice(0, 100),
        pizzaType: typeof pizzaType === 'string' && pizzaType ? pizzaType.slice(0, 100) : null,
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}
