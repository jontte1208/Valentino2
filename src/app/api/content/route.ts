import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const content = await prisma.pageContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const content = await prisma.pageContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
