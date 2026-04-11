import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getISOWeekNumber } from '@/lib/weekNumber'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weekNumber = Number.parseInt(
      searchParams.get('week') ?? String(getISOWeekNumber()),
      10
    )
    const year = Number.parseInt(
      searchParams.get('year') ?? String(new Date().getFullYear()),
      10
    )
    if (!Number.isFinite(weekNumber) || !Number.isFinite(year)) {
      return NextResponse.json({ error: 'Invalid week/year' }, { status: 400 })
    }

    const days = await prisma.lunchDay.findMany({
      where: { weekNumber, year },
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(days)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lunch' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const body = await request.json()
    const { weekNumber, year, dayOfWeek, dishName, description, price } = body

    if (
      !Number.isFinite(Number(weekNumber)) ||
      !Number.isFinite(Number(year)) ||
      typeof dayOfWeek !== 'string' || !dayOfWeek ||
      typeof dishName !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const priceNum = Number.parseFloat(String(price))
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 100000) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const weekN = Number(weekNumber)
    const yearN = Number(year)

    const existing = await prisma.lunchDay.findFirst({
      where: { weekNumber: weekN, year: yearN, dayOfWeek: dayOfWeek.slice(0, 50) },
    })

    if (existing) {
      const updated = await prisma.lunchDay.update({
        where: { id: existing.id },
        data: {
          dishName: dishName.slice(0, 200),
          description: String(description ?? '').slice(0, 1000),
          price: priceNum,
        },
      })
      return NextResponse.json(updated)
    }

    const day = await prisma.lunchDay.create({
      data: {
        weekNumber: weekN,
        year: yearN,
        dayOfWeek: dayOfWeek.slice(0, 50),
        dishName: dishName.slice(0, 200),
        description: String(description ?? '').slice(0, 1000),
        price: priceNum,
      },
    })
    return NextResponse.json(day, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save lunch day' }, { status: 500 })
  }
}
