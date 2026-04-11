'use client'

import { motion } from 'framer-motion'

interface LunchDay {
  id: number
  dayOfWeek: string
  dishName: string
  description: string
  price: number
}

interface WeeklySoup {
  id: number
  name: string
  description: string
  price: number
}

interface VeckansLunchClientProps {
  lunchDays: LunchDay[]
  soup: WeeklySoup | null
  weekNumber: number
}

const dayLabels: Record<string, string> = {
  monday: 'Måndag',
  tuesday: 'Tisdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export default function VeckansLunchClient({ lunchDays, soup, weekNumber }: VeckansLunchClientProps) {
  const sortedDays = [...lunchDays].sort(
    (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
  )

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Måndag–Fredag 11:00–14:30
            </span>
            <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-[#FAF4EB] mt-4 mb-4">
              Veckans lunch
            </h1>
            <p className="font-playfair text-xl italic text-[#C0623A]">Vecka {weekNumber}</p>
            <div className="w-16 h-px bg-[#C0623A] mx-auto mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Lunch note */}
      <section className="py-10 bg-[#C0623A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-inter text-white font-medium">
            Alla luncher serveras med sallad, bröd och smör. Kaffe ingår. Välkommen!
          </p>
        </div>
      </section>

      {/* Lunch Days */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedDays.length === 0 ? (
            <p className="font-inter text-center text-[#1C1C1C]/60 py-16">
              Ingen lunchmeny tillgänglig för denna vecka ännu. Återkom snart!
            </p>
          ) : (
            <div className="space-y-4">
              {sortedDays.map((day, index) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 lg:p-8 border border-[#E8DDD0] hover:border-[#C0623A]/40 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C0623A]/10 flex items-center justify-center">
                        <span className="font-playfair text-sm font-bold text-[#C0623A]">
                          {dayLabels[day.dayOfWeek]?.slice(0, 3)}
                        </span>
                      </div>
                      <div>
                        <span className="font-inter text-xs uppercase tracking-widest text-[#C0623A] font-medium">
                          {dayLabels[day.dayOfWeek]}
                        </span>
                        <h2 className="font-playfair text-2xl font-bold text-[#1C1C1C] mt-1 mb-2 group-hover:text-[#C0623A] transition-colors">
                          {day.dishName}
                        </h2>
                        <p className="font-inter text-sm text-[#1C1C1C]/60 leading-relaxed max-w-xl">
                          {day.description}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right flex-shrink-0">
                      <span className="font-inter text-2xl font-bold text-[#C0623A]">{day.price} kr</span>
                      <p className="font-inter text-xs text-[#1C1C1C]/50 mt-1">inkl. kaffe</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Soup */}
          {soup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 bg-[#1C1C1C] rounded-xl p-8 text-[#FAF4EB]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C0623A]/20 flex items-center justify-center">
                  <span className="text-lg">🍵</span>
                </div>
                <span className="font-inter text-xs uppercase tracking-widest text-[#C0623A] font-medium">
                  Veckans soppa — hela veckan
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#FAF4EB] mb-2">{soup.name}</h3>
                  <p className="font-inter text-sm text-[#FAF4EB]/60 leading-relaxed max-w-xl">
                    {soup.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="font-inter text-2xl font-bold text-[#C0623A]">{soup.price} kr</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
