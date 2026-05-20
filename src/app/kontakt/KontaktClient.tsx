'use client'

import { motion } from 'framer-motion'

const DAY_NAMES = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']

interface KontaktClientProps {
  address: string
  phone: string
  email: string
  openingHours: { day: string; hours: string }[]
  lunchHours: string
  mapEmbedUrl: string
}

export default function KontaktClient({
  address,
  phone,
  email,
  openingHours,
  lunchHours,
  mapEmbedUrl,
}: KontaktClientProps) {
  const todayName = DAY_NAMES[new Date().getDay()]

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Adress',
      value: address,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Telefon',
      value: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'E-post',
      value: email,
      href: `mailto:${email}`,
    },
  ]

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Kom i kontakt
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-6">
              Kontakt
            </h1>
            <div className="w-16 h-px bg-[#C0623A] mx-auto" />
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C] mb-6">
              Hitta oss
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-[#E8DDD0] divide-y divide-[#E8DDD0]">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 px-5 py-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C0623A]/10 flex items-center justify-center text-[#C0623A]">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-inter text-[10px] uppercase tracking-widest text-[#1C1C1C]/40 font-medium leading-none mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-inter text-sm text-[#1C1C1C] hover:text-[#C0623A] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-inter text-sm text-[#1C1C1C]">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1C1C1C] rounded-2xl p-6 text-[#FAF4EB] flex flex-col">
                <h3 className="font-playfair text-lg font-bold mb-4">Öppettider</h3>
                <div className="flex-1 space-y-2">
                  {openingHours.map((h) => {
                    const isToday = h.day === todayName
                    return (
                      <div key={h.day} className="flex justify-between items-center">
                        <span
                          className={`font-inter text-sm ${
                            isToday ? 'text-[#C0623A] font-semibold' : 'text-[#FAF4EB]/60'
                          }`}
                        >
                          {h.day}
                        </span>
                        <span
                          className={`font-inter text-sm ${
                            isToday ? 'text-[#C0623A] font-semibold' : 'text-[#FAF4EB]/90'
                          }`}
                        >
                          {h.hours}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-[#FAF4EB]/10">
                  <p className="font-inter text-xs text-[#FAF4EB]/40">Lunch: {lunchHours}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E8DDD0]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Valentino Restaurang karta"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
