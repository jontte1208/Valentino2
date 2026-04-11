import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, description, price, category, pizzaType, order } = body

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        pizzaType: pizzaType || null,
        order: order ?? 0,
      },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    await prisma.menuItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
