'use client'

import { useState, useEffect, useRef } from 'react'

interface MediaSlot {
  key: string
  label: string
  description: string
  accept: string
  type: 'image' | 'video'
  currentValue?: string
}

const MEDIA_SLOTS: MediaSlot[] = [
  {
    key: 'hero_bg_video',
    label: 'Hero Background Video',
    description: 'Full-screen video on the homepage hero. Recommended: MP4, max 200 MB.',
    accept: 'video/mp4,video/webm',
    type: 'video',
  },
  {
    key: 'hero_bg_image',
    label: 'Hero Background Image',
    description: 'Fallback image shown when video is not supported. Recommended: 1920×1080 JPG/WebP.',
    accept: 'image/jpeg,image/png,image/webp,image/avif',
    type: 'image',
  },
  {
    key: 'welcome_image',
    label: 'Welcome Section Image',
    description: 'Image shown next to the welcome text on the homepage. Recommended: portrait 800×1000.',
    accept: 'image/jpeg,image/png,image/webp,image/avif',
    type: 'image',
  },
  {
    key: 'about_image',
    label: 'About Page Image',
    description: 'Image shown on the Om oss page. Recommended: landscape 1200×800.',
    accept: 'image/jpeg,image/png,image/webp,image/avif',
    type: 'image',
  },
]

export default function AdminMedia() {
  const [slots, setSlots] = useState<MediaSlot[]>(MEDIA_SLOTS)
  const [uploading, setUploading] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((items: { key: string; value: string }[]) => {
        const map: Record<string, string> = {}
        items.forEach((i) => { map[i.key] = i.value })
        setSlots((prev) =>
          prev.map((slot) => ({ ...slot, currentValue: map[slot.key] ?? '' }))
        )
      })
      .catch(() => {})
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(key)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contentKey', key)

      const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Upload failed')
        return
      }

      setSlots((prev) =>
        prev.map((s) => (s.key === key ? { ...s, currentValue: data.path } : s))
      )
      setSaved(key)
      setTimeout(() => setSaved(null), 3000)

      // Reset file input
      if (inputRefs.current[key]) inputRefs.current[key]!.value = ''
    } finally {
      setUploading(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Media & Backgrounds</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">
          Upload images and videos used as backgrounds and section visuals
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="font-inter text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {slots.map((slot) => {
          const isUploading = uploading === slot.key
          const isSaved = saved === slot.key
          const hasMedia = !!slot.currentValue

          return (
            <div
              key={slot.key}
              className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-colors ${
                isSaved ? 'border-green-300' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <span className="font-inter text-sm font-semibold text-gray-900">{slot.label}</span>
                  <span className="font-inter text-xs text-gray-400 ml-2">{slot.key}</span>
                </div>
                {isSaved && (
                  <span className="font-inter text-xs text-green-600 font-medium">✓ Uploaded</span>
                )}
              </div>

              <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                {/* Preview */}
                <div className="flex-shrink-0 w-full sm:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                  {slot.type === 'video' && slot.currentValue ? (
                    <video
                      src={slot.currentValue}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : slot.type === 'image' && slot.currentValue ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slot.currentValue}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                      {slot.type === 'video' ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.876v6.249a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="font-inter text-xs">No file yet</span>
                    </div>
                  )}
                </div>

                {/* Info + upload */}
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-gray-600 mb-3">{slot.description}</p>

                  {hasMedia && (
                    <p className="font-inter text-xs text-gray-400 mb-3 truncate">
                      Current: <span className="text-[#C0623A]">{slot.currentValue}</span>
                    </p>
                  )}

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded font-inter text-sm font-medium transition-all ${
                        isUploading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#C0623A] text-white hover:bg-[#D4795A]'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {hasMedia ? 'Replace file' : 'Upload file'}
                        </>
                      )}
                    </span>
                    <input
                      ref={(el) => { inputRefs.current[slot.key] = el }}
                      type="file"
                      accept={slot.accept}
                      disabled={isUploading}
                      onChange={(e) => handleUpload(e, slot.key)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
