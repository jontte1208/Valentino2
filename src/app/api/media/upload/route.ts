import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const contentKey = formData.get('contentKey') as string | null

    if (!file || !contentKey) {
      return NextResponse.json({ error: 'Missing file or contentKey' }, { status: 400 })
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)

    if (!isVideo && !isImage) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? '200' : '10'} MB.` },
        { status: 400 }
      )
    }

    // Save to /public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop() ?? (isVideo ? 'mp4' : 'jpg')
    const safeName = `${contentKey.replace(/_/g, '-')}-${Date.now()}.${ext}`
    const filePath = path.join(uploadsDir, safeName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/${safeName}`

    // Upsert the content key in DB
    await prisma.pageContent.upsert({
      where: { key: contentKey },
      update: { value: publicPath },
      create: { key: contentKey, value: publicPath },
    })

    return NextResponse.json({ path: publicPath })
  } catch (err) {
    console.error('Media upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
