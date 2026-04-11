import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = formData.get('alt') as string || 'Bild från Valentino'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await writeFile(path.join(uploadDir, filename), buffer)

    const lastImage = await prisma.galleryImage.findFirst({ orderBy: { order: 'desc' } })
    const nextOrder = (lastImage?.order ?? 0) + 1

    const image = await prisma.galleryImage.create({
      data: { filename, alt, order: nextOrder },
    })
    return NextResponse.json(image, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
