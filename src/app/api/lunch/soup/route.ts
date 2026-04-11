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

    const soup = await prisma.weeklySoup.findFirst({ where: { weekNumber, year } })
    return NextResponse.json(soup)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch soup' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const body = await request.json()
    const { weekNumber, year, name, description, price } = body

    if (
      !Number.isFinite(Number(weekNumber)) ||
      !Number.isFinite(Number(year)) ||
      typeof name !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const priceNum = Number.parseFloat(String(price))
    if (!Number.isFinite(priceNum) || priceNum < 0 || priceNum > 100000) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const weekN = Number(weekNumber)
    const yearN = Number(year)

    const existing = await prisma.weeklySoup.findFirst({ where: { weekNumber: weekN, year: yearN } })

    if (existing) {
      const updated = await prisma.weeklySoup.update({
        where: { id: existing.id },
        data: {
          name: name.slice(0, 200),
          description: String(description ?? '').slice(0, 1000),
          price: priceNum,
        },
      })
      return NextResponse.json(updated)
    }

    const soup = await prisma.weeklySoup.create({
      data: {
        weekNumber: weekN,
        year: yearN,
        name: name.slice(0, 200),
        description: String(description ?? '').slice(0, 1000),
        price: priceNum,
      },
    })
    return NextResponse.json(soup, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save soup' }, { status: 500 })
  }
}
