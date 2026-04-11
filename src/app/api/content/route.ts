import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

// Only allow alphanumeric, dash, and underscore for content keys.
const SAFE_KEY = /^[a-zA-Z0-9_-]+$/

export async function GET() {
  try {
    const content = await prisma.pageContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const body = await request.json()
    const key = typeof body.key === 'string' ? body.key : ''
    const value = typeof body.value === 'string' ? body.value : ''

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    }
    if (!SAFE_KEY.test(key) || key.length > 64) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }
    if (value.length > 10000) {
      return NextResponse.json({ error: 'Value too long' }, { status: 400 })
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
