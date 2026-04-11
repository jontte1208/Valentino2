import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const content = await prisma.pageContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
