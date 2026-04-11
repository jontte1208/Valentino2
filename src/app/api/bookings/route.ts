import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, date, time, guests, specialRequests } = body

    if (!name || !phone || !email || !date || !time || !guests) {
      return NextResponse.json({ error: 'Alla obligatoriska fält måste fyllas i' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Ogiltig e-postadress' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: { name, phone, email, date, time, guests: parseInt(guests), specialRequests: specialRequests || null },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Kunde inte skapa bokning' }, { status: 500 })
  }
}
