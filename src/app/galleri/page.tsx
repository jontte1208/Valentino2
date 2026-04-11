'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
interface GalleryImage {
  id: number
  filename: string
  alt: string
  order: number
}

const colorPlaceholders = [
  'from-[#C0623A] to-[#8B4513]',
  'from-[#1C1C1C] to-[#2A1810]',
  'from-[#8B4513] to-[#C0623A]',
  'from-[#2A1810] to-[#C0623A]',
  'from-[#D4795A] to-[#FAF4EB]',
  'from-[#FAF4EB] to-[#D4795A]',
]

const icons = ['🍝', '🍕', '🍷', '🫒', '🍮', '🏛️', '🌿', '🍋']

export default function GalleriPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then(setImages)
      .catch(() => {})
  }, [])

  function openLightbox(index: number) {
    setLightboxIndex(index)
  }

  function closeLightbox() {
    setLightboxIndex(null)
  }

  function prevImage() {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
  }

  function nextImage() {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))
  }

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Bilder och stämning
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-6">
              Galleri
            </h1>
            <div className="w-16 h-px bg-[#C0623A] mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <p className="font-inter text-center text-[#1C1C1C]/50 py-16">
              Inga bilder tillgängliga för tillfället.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.button
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (index % 8) * 0.08 }}
                  onClick={() => openLightbox(index)}
                  className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                    index % 5 === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <div
                    className={`w-full bg-gradient-to-br ${colorPlaceholders[index % colorPlaceholders.length]} ${
                      index % 5 === 0 ? 'h-64' : 'h-40'
                    } flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{icons[index % icons.length]}</div>
                      <p className="font-inter text-xs text-white/70">{image.alt}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[#1C1C1C]/0 group-hover:bg-[#1C1C1C]/30 transition-all duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C1C1C]/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors z-10"
              aria-label="Stäng"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors"
              aria-label="Föregående"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-full h-96 bg-gradient-to-br ${colorPlaceholders[lightboxIndex % colorPlaceholders.length]} rounded-lg flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{icons[lightboxIndex % icons.length]}</div>
                  <p className="font-playfair text-xl text-white italic">
                    {images[lightboxIndex]?.alt}
                  </p>
                </div>
              </div>
              <p className="font-inter text-sm text-[#FAF4EB]/60 text-center mt-4">
                {lightboxIndex + 1} / {images.length}
              </p>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors"
              aria-label="Nästa"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
