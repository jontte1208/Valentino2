'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface WelcomeSectionProps {
  welcomeText: string
}

export default function WelcomeSection({ welcomeText }: WelcomeSectionProps) {
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

          {/* Image placeholder with warm design */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              {/* Main image area */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C0623A]/20 to-[#1C1C1C]/40 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-[#C0623A]/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-[#C0623A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="font-playfair text-xl italic text-[#1C1C1C]/60">Dal 1998</p>
                  </div>
                </div>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-3 border border-[#C0623A]/20 rounded-md pointer-events-none" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-[#1C1C1C] text-[#FAF4EB] rounded-lg p-6 shadow-2xl">
              <div className="font-playfair text-4xl font-bold text-[#C0623A]">25+</div>
              <div className="font-inter text-xs text-[#FAF4EB]/70 mt-1">År av autentisk<br />italiensk matlagning</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
