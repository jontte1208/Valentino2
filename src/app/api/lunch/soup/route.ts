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

    const soup = await prisma.weeklySoup.findFirst({ where: { weekNumber, year } })
    return NextResponse.json(soup)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch soup' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { weekNumber, year, name, description, price } = body

    const existing = await prisma.weeklySoup.findFirst({ where: { weekNumber, year } })

    if (existing) {
      const updated = await prisma.weeklySoup.update({
        where: { id: existing.id },
        data: { name, description, price: parseFloat(price) },
      })
      return NextResponse.json(updated)
    }

    const soup = await prisma.weeklySoup.create({
      data: { weekNumber, year, name, description, price: parseFloat(price) },
    })
    return NextResponse.json(soup, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save soup' }, { status: 500 })
  }
}
