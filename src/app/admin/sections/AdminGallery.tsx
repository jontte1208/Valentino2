'use client'

import { useState, useEffect, useRef } from 'react'

interface GalleryImage {
  id: number
  filename: string
  alt: string
  order: number
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [altText, setAltText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadImages()
  }, [])

  async function loadImages() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/gallery')
      setImages(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', altText || file.name)

      const res = await fetch('/api/gallery/upload', { method: 'POST', body: formData })
      if (res.ok) {
        setAltText('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        loadImages()
      }
    } finally {
      setIsUploading(false)
    }
  }

  async function handleDelete(id: number, filename: string) {
    if (!confirm(`Delete image "${filename}"?`)) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    loadImages()
  }

  async function updateAlt(id: number, alt: string) {
    await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt }),
    })
    loadImages()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Gallery Manager</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Upload and manage gallery images</p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="font-inter font-semibold text-gray-900 mb-4">Upload New Image</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Alt text / Description</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
            />
          </div>
          <div className="sm:self-end">
            <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Image file</label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleUpload}
                disabled={isUploading}
                className="w-full text-sm font-inter text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#C0623A] file:text-white hover:file:bg-[#D4795A] file:cursor-pointer disabled:opacity-60"
              />
            </div>
          </div>
        </div>
        {isUploading && (
          <p className="font-inter text-xs text-[#C0623A] mt-3">Uploading...</p>
        )}
      </div>

      {/* Images grid */}
      {isLoading ? (
        <p className="font-inter text-gray-500 text-center py-12">Loading...</p>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="font-inter text-gray-400">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
              <div className="h-32 bg-gradient-to-br from-[#C0623A]/20 to-[#1C1C1C]/20 relative flex items-center justify-center">
                <span className="font-inter text-xs text-gray-500">{image.filename}</span>
                <button
                  onClick={() => handleDelete(image.id, image.filename)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  defaultValue={image.alt}
                  onBlur={(e) => {
                    if (e.target.value !== image.alt) updateAlt(image.id, e.target.value)
                  }}
                  className="w-full text-xs font-inter text-gray-600 border-0 border-b border-transparent focus:border-[#C0623A] focus:outline-none py-0.5 bg-transparent"
                  placeholder="Alt text..."
                />
                <p className="font-inter text-xs text-gray-400 mt-1">Order: {image.order}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
