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

export default function VeckansLunchClient({ lunchDays, soup, weekNumber }: VeckansLunchClientProps) {
  const sortedDays = [...lunchDays].sort(
    (a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
  )

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Page header — light, centered, elegant */}
      <section className="pt-20 pb-14 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-4xl mb-5">🗓</div>
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#1C1C1C] mb-4 leading-tight">
            Veckans Lunch
          </h1>
          {/* Week pill badge */}
          <span className="inline-block bg-[#C0623A]/15 text-[#C0623A] font-inter text-sm font-semibold px-5 py-1.5 rounded-full mb-6 tracking-wide">
            Vecka {weekNumber}
          </span>
          <div className="w-12 h-px bg-[#C0623A] mx-auto mb-6" />
          <p className="font-inter text-sm text-[#1C1C1C]/55 leading-relaxed">
            Serveras måndag–fredag 11:30–15:00
            <span className="mx-2 text-[#C0623A]/40">·</span>
            Alla luncher inkluderar sallad, saft, kaffe och kaka
          </p>
        </motion.div>
      </section>

      {/* Lunch day cards */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {sortedDays.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[#EDE3D7] p-12 text-center shadow-sm"
            >
              <div className="text-3xl mb-4">🍽️</div>
              <p className="font-playfair text-xl text-[#1C1C1C]/50 italic">
                Lunchmenyn för vecka {weekNumber} är inte publicerad än.
              </p>
              <p className="font-inter text-sm text-[#1C1C1C]/40 mt-2">
                Återkom snart eller ring oss för mer info.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {sortedDays.map((day, index) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="bg-white rounded-2xl border border-[#EDE3D7] shadow-sm overflow-hidden"
                >
                  <div className="flex items-stretch">
                    {/* Day label strip */}
                    <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center bg-[#FAF0E6] border-r border-[#EDE3D7] py-5 px-3">
                      <span className="font-playfair text-sm font-bold text-[#C0623A] text-center leading-tight">
                        {dayLabels[day.dayOfWeek]}
                      </span>
                    </div>

                    {/* Dish info */}
                    <div className="flex-1 px-6 py-5 flex flex-col justify-center gap-1">
                      <h2 className="font-playfair text-xl font-bold text-[#1C1C1C] leading-snug">
                        {day.dishName}
                      </h2>
                      {day.description && (
                        <p className="font-inter text-sm text-[#1C1C1C]/55 leading-relaxed">
                          {day.description}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center pr-6 pl-4 border-l border-[#EDE3D7]">
                      <span className="font-playfair text-2xl font-bold text-[#C0623A]">
                        {day.price}
                      </span>
                      <span className="font-inter text-xs text-[#1C1C1C]/45 mt-0.5">kr</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Weekly soup */}
          {soup && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-5 bg-[#1C1C1C] rounded-2xl overflow-hidden shadow-md"
            >
              <div className="flex items-stretch">
                <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center bg-[#2A2A2A] border-r border-white/10 py-5 px-3">
                  <span className="text-2xl mb-1">🍵</span>
                  <span className="font-inter text-[10px] uppercase tracking-widest text-[#C0623A] font-medium text-center leading-tight">
                    Soppa
                  </span>
                </div>

                <div className="flex-1 px-6 py-5 flex flex-col justify-center gap-1">
                  <span className="font-inter text-[10px] uppercase tracking-widest text-[#C0623A]/80 font-medium">
                    Hela veckan
                  </span>
                  <h3 className="font-playfair text-xl font-bold text-[#FAF4EB]">{soup.name}</h3>
                  {soup.description && (
                    <p className="font-inter text-sm text-[#FAF4EB]/50 leading-relaxed">{soup.description}</p>
                  )}
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center pr-6 pl-4 border-l border-white/10">
                  <span className="font-playfair text-2xl font-bold text-[#C0623A]">{soup.price}</span>
                  <span className="font-inter text-xs text-[#FAF4EB]/35 mt-0.5">kr</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 bg-white rounded-2xl border border-[#EDE3D7] px-6 py-5 text-center shadow-sm"
          >
            <p className="font-inter text-sm text-[#1C1C1C]/50 leading-relaxed">
              <span className="text-[#C0623A] font-medium">Lunchen inkluderar</span>
              {' '}sallad, saft, kaffe och kaka.
              <br className="hidden sm:block" />
              {' '}Välkommen in till oss på{' '}
              {/* Adress hårdkodad för enkelhet — håll synkad med siteSettings.address i Sanity. */}
              <span className="text-[#1C1C1C]/70">Nygatan 38, Hörby</span>.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
