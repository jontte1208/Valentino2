import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

function parseId(raw: string): number | null {
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const id = parseId(params.id)
    if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const body = await request.json()
    const { name, description, price, category, pizzaType, order } = body

    const priceNum = Number.parseFloat(String(price))
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 100000) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        name: typeof name === 'string' ? name.slice(0, 200) : '',
        description: typeof description === 'string' ? description.slice(0, 1000) : '',
        price: priceNum,
        category: typeof category === 'string' ? category.slice(0, 100) : '',
        pizzaType: typeof pizzaType === 'string' && pizzaType ? pizzaType.slice(0, 100) : null,
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
      },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const id = parseId(params.id)
    if (id === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    await prisma.menuItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
