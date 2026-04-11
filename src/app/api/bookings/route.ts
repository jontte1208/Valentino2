import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
