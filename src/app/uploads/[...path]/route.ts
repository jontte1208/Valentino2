import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Prevent path traversal
    const segments = params.path.map((s) => path.basename(s))
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments)
    const file = await readFile(filePath)
    const ext = segments[segments.length - 1].split('.').pop()?.toLowerCase() ?? ''
    const contentType = MIME[ext] ?? 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}
