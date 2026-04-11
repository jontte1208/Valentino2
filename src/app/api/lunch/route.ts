import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getISOWeekNumber } from '@/lib/weekNumber'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const weekNumber = parseInt(searchParams.get('week') ?? String(getISOWeekNumber()))
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

    const days = await prisma.lunchDay.findMany({
      where: { weekNumber, year },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(days)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lunch' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { weekNumber, year, dayOfWeek, dishName, description, price } = body

    const existing = await prisma.lunchDay.findFirst({
      where: { weekNumber, year, dayOfWeek },
    })

    if (existing) {
      const updated = await prisma.lunchDay.update({
        where: { id: existing.id },
        data: { dishName, description, price: parseFloat(price) },
      })
      return NextResponse.json(updated)
    }

    const day = await prisma.lunchDay.create({
      data: { weekNumber, year, dayOfWeek, dishName, description, price: parseFloat(price) },
    })
    return NextResponse.json(day, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save lunch day' }, { status: 500 })
  }
}
