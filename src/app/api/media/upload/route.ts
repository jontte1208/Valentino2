import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200 MB

// Only allow alphanumeric, dash, and underscore in content keys to avoid
// writing to arbitrary disk locations.
const SAFE_KEY = /^[a-zA-Z0-9_-]+$/

function extensionFor(type: string): string {
  switch (type) {
    case 'image/jpeg': return 'jpg'
    case 'image/png': return 'png'
    case 'image/webp': return 'webp'
    case 'image/avif': return 'avif'
    case 'image/gif': return 'gif'
    case 'video/mp4': return 'mp4'
    case 'video/webm': return 'webm'
    case 'video/ogg': return 'ogv'
    default: return 'bin'
  }
}

export async function POST(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const contentKey = formData.get('contentKey') as string | null

    if (!file || !contentKey) {
      return NextResponse.json({ error: 'Missing file or contentKey' }, { status: 400 })
    }

    if (!SAFE_KEY.test(contentKey) || contentKey.length > 64) {
      return NextResponse.json({ error: 'Invalid contentKey' }, { status: 400 })
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

    // Derive extension from the MIME type, NOT from the uploaded filename,
    // so a malicious "photo.jpg.php" can't pass through.
    const ext = extensionFor(file.type)
    const safeName = `${contentKey.replace(/_/g, '-')}-${Date.now()}.${ext}`

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, safeName)

    // Final sanity: filePath must still live under uploadsDir
    if (!filePath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/${safeName}`

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
