'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  bgVideo?: string
  bgImage?: string
  title?: string
  subtitle?: string
  tagline?: string
}

export default function HeroSection({
  bgVideo,
  bgImage,
  title = 'Valentino',
  subtitle = 'Hörbys mest omtyckta pizzeria & restaurang',
  tagline = 'Pizza, kebab, pasta och mycket mer — lagat med kärlek och de bästa råvarorna. Öppet alla dagar i veckan',
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1C1C1C]">
        {/* Video background */}
        {bgVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={bgImage || undefined}
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        )}

        {/* Image background (shown if no video, or as poster) */}
        {!bgVideo && bgImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgImage}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark overlay — heavier on video so text stays readable */}
        <div
          className={`absolute inset-0 ${
            bgVideo
              ? 'bg-[#1C1C1C]/60'
              : 'bg-gradient-to-br from-[#2A1810]/80 via-[#1C1C1C]/60 to-[#1C1C1C]/90'
          }`}
        />

        {/* Warm glow orbs (only shown without video) */}
        {!bgVideo && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C0623A]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#C0623A]/8 rounded-full blur-3xl" />
          </>
        )}

        {/* Texture pattern (only shown without video) */}
        {!bgVideo && (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #FAF4EB 0, #FAF4EB 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
            Pizzeria &amp; Restaurang — Hörby, Skåne
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-playfair text-7xl sm:text-8xl lg:text-9xl font-bold text-[#FAF4EB] mb-6 leading-none tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-24 h-px bg-[#C0623A] mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-playfair text-xl sm:text-2xl text-[#FAF4EB]/80 italic mb-4 font-light"
        >
          {subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-inter text-base text-[#FAF4EB]/60 mb-12 max-w-lg mx-auto"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/meny"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#C0623A] text-white font-inter font-medium text-sm tracking-wide hover:bg-[#D4795A] transition-all duration-300 rounded group"
          >
            Se menyn
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/boka-bord"
            className="inline-flex items-center justify-center px-8 py-4 border border-[#FAF4EB]/30 text-[#FAF4EB] font-inter font-medium text-sm tracking-wide hover:bg-[#FAF4EB]/10 hover:border-[#FAF4EB]/60 transition-all duration-300 rounded"
          >
            Boka bord
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
