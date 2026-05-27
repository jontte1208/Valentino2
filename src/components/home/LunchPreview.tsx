'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface LunchDay {
  dayOfWeek: string
  dishName: string
  price: number
}

interface LunchPreviewProps {
  weekNumber: number
  lunchDays: LunchDay[]
  lunchHours?: string
}

// Sanity schemat lagrar dayOfWeek som "Måndag"/"Tisdag"/.... Behåll
// engelska nycklar som fallback för bakåtkompatibilitet om gammal data finns.
const dayLabels: Record<string, string> = {
  Måndag: 'Måndag',
  Tisdag: 'Tisdag',
  Onsdag: 'Onsdag',
  Torsdag: 'Torsdag',
  Fredag: 'Fredag',
  monday: 'Måndag',
  tuesday: 'Tisdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
}

const dayOrder = [
  'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
]

export default function LunchPreview({
  weekNumber,
  lunchDays,
  lunchHours = 'Tisdag–Fredag: 11:30–14:00',
}: LunchPreviewProps) {
  const sortedDays = [...lunchDays].sort(
    (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
  )

  return (
    <section className="py-24 bg-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/3 lg:sticky lg:top-24"
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Varje vecka
            </span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#FAF4EB] mt-4 mb-6 leading-tight">
              Veckans
              <span className="block italic text-[#C0623A]">lunch</span>
            </h2>
            <p className="font-inter text-sm text-[#FAF4EB]/60 leading-relaxed mb-8">
              Vecka {weekNumber} — Njut av vår dagliga lunchmeny, tillagad med kärlek och de färskaste råvarorna. Serveras {lunchHours}.
            </p>
            <Link
              href="/veckans-lunch"
              className="inline-flex items-center px-6 py-3 bg-[#C0623A] text-white font-inter font-medium text-sm hover:bg-[#D4795A] transition-colors rounded group"
            >
              Se hela menyn
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

          {/* Lunch cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDays.map((day, index) => (
              <motion.div
                key={day.dayOfWeek}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FAF4EB]/5 border border-[#FAF4EB]/10 rounded-lg p-5 hover:bg-[#FAF4EB]/10 hover:border-[#C0623A]/30 transition-all duration-300"
              >
                <span className="font-inter text-xs uppercase tracking-widest text-[#C0623A] font-medium">
                  {dayLabels[day.dayOfWeek]}
                </span>
                <h3 className="font-playfair text-lg font-semibold text-[#FAF4EB] mt-2 mb-3 leading-tight">
                  {day.dishName}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm font-semibold text-[#FAF4EB]">
                    {day.price} kr
                  </span>
                  <span className="text-[#FAF4EB]/30 text-xs font-inter">inkl. sallad & bröd</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
