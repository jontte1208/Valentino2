import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const id = Number.parseInt(params.id, 10)
    if (!Number.isFinite(id) || id < 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const image = await prisma.galleryImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Prevent path traversal via stored filename
    const safeName = path.basename(image.filename)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filePath = path.join(uploadDir, safeName)
    if (filePath.startsWith(uploadDir + path.sep)) {
      await unlink(filePath).catch(() => {})
    }

    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const id = Number.parseInt(params.id, 10)
    if (!Number.isFinite(id) || id < 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const body = await request.json()
    const alt = typeof body.alt === 'string' ? body.alt.slice(0, 200) : undefined
    const order = typeof body.order === 'number' && Number.isFinite(body.order)
      ? body.order
      : undefined

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(order !== undefined && { order }),
      },
    })
    return NextResponse.json(image)
  } catch {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}
