import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const { status } = await request.json()

    const validStatuses = ['pending', 'confirmed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
