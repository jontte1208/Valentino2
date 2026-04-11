'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const teaserImages = [
  {
    gradient: 'from-[#8B4513] to-[#C0623A]',
    label: 'Restaurangen',
    icon: '🏛️',
  },
  {
    gradient: 'from-[#C0623A] to-[#D4795A]',
    label: 'Pasta & Rätter',
    icon: '🍝',
  },
  {
    gradient: 'from-[#2A1810] to-[#8B4513]',
    label: 'Viner',
    icon: '🍷',
  },
  {
    gradient: 'from-[#D4795A] to-[#FAF4EB]',
    label: 'Desserter',
    icon: '🍮',
  },
]

export default function GalleryTeaser() {
  return (
    <section className="py-24 bg-[#FAF4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
            Bilder från oss
          </span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#1C1C1C] mt-4 leading-tight">
            Galleri
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {teaserImages.map((img, index) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${index === 0 ? 'row-span-2' : ''} group cursor-pointer overflow-hidden rounded-lg`}
            >
              <div
                className={`w-full bg-gradient-to-br ${img.gradient} ${
                  index === 0 ? 'h-64 lg:h-full min-h-[200px]' : 'h-32 lg:h-44'
                } flex items-center justify-center transition-all duration-500 group-hover:scale-105`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{img.icon}</div>
                  <span className="font-inter text-sm font-medium text-white/80">{img.label}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#1C1C1C]/0 group-hover:bg-[#1C1C1C]/20 transition-all duration-300 rounded-lg" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/galleri"
            className="inline-flex items-center px-8 py-4 border-2 border-[#C0623A] text-[#C0623A] font-inter font-medium text-sm hover:bg-[#C0623A] hover:text-white transition-all duration-300 rounded group"
          >
            Se alla bilder
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
