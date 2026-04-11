import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import { requireAuth } from '@/lib/requireAuth'

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

function extensionFor(type: string): string {
  switch (type) {
    case 'image/jpeg': return 'jpg'
    case 'image/png': return 'png'
    case 'image/webp': return 'webp'
    case 'image/avif': return 'avif'
    default: return 'bin'
  }
}

export async function POST(request: NextRequest) {
  const unauth = await requireAuth(request)
  if (unauth) return unauth

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const altRaw = formData.get('alt')
    const alt = typeof altRaw === 'string' ? altRaw.slice(0, 200) : 'Bild från Valentino'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Never trust client-supplied filename or extension.
    const ext = extensionFor(file.type)
    const filename = `${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)

    if (!filePath.startsWith(uploadDir + path.sep)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    await writeFile(filePath, buffer)

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
