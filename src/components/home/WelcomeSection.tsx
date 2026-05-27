'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface WelcomeSectionProps {
  welcomeText: string
  welcomeImage?: string
}

export default function WelcomeSection({ welcomeText, welcomeImage }: WelcomeSectionProps) {
  return (
    <section className="py-24 bg-[#FAF4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Vår story
            </span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#1C1C1C] mt-4 mb-8 leading-tight">
              En smak av
              <span className="block italic text-[#C0623A]">äkta Italien</span>
            </h2>
            <div className="w-12 h-0.5 bg-[#C0623A] mb-8" />
            <p className="font-inter text-base text-[#1C1C1C]/70 leading-relaxed mb-8">
              {welcomeText}
            </p>
            <Link
              href="/om-oss"
              className="inline-flex items-center font-inter text-sm font-medium text-[#C0623A] hover:text-[#9E4E2E] transition-colors group"
            >
              Läs mer om oss
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

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              {welcomeImage ? (
                <Image
                  src={welcomeImage}
                  alt="Restaurangen"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#C0623A]/20 to-[#1C1C1C]/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-[#C0623A]/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-[#C0623A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-inter text-sm text-[#1C1C1C]/50">Ladda upp en bild i Admin</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Decorative border */}
              <div className="absolute inset-3 border border-[#C0623A]/20 rounded-md pointer-events-none" />
            </div>

            {/* Floating stat card — siffror från RestaurantGuru top-lista för Hörby. */}
            <div className="absolute -bottom-6 -left-6 bg-[#1C1C1C] text-[#FAF4EB] rounded-lg p-6 shadow-2xl">
              <div className="font-playfair text-4xl font-bold text-[#C0623A]">4.7 ★</div>
              <div className="font-inter text-xs text-[#FAF4EB]/70 mt-1">Snittbetyg<br />618 recensioner</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
