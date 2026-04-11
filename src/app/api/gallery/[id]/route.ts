import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const image = await prisma.galleryImage.findUnique({ where: { id } })

    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const filePath = path.join(process.cwd(), 'public', 'uploads', image.filename)
    await unlink(filePath).catch(() => {})

    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET ?? 'valentino-secret-change-in-production' })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id)
    const { alt, order } = await request.json()

    const image = await prisma.galleryImage.update({
      where: { id },
      data: { ...(alt !== undefined && { alt }), ...(order !== undefined && { order }) },
    })
    return NextResponse.json(image)
  } catch {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}
