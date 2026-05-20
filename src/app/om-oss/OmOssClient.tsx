'use client'

import { motion } from 'framer-motion'

const teamMembers = [
  {
    name: 'Köksteamet',
    role: 'Kock & Pizzabagare',
    description:
      'Vårt erfarna köksteam skapar varje dag handgjorda pizzor och smakrika rätter med de bästa råvarorna. Snabb service utan att kompromissa på kvaliteten.',
  },
  {
    name: 'Servicepersonalen',
    role: 'Serveringspersonal',
    description:
      'Välutbildad och vänlig personal som välkomnar alla gäster med ett leende. Vi ser till att din upplevelse på Valentino alltid är trevlig och minnesvärd.',
  },
  {
    name: 'Leverans & Avhämtning',
    role: 'Avhämtning & Take Away',
    description:
      'Beställ per telefon och hämta din mat när det passar dig. Vi förbereder din beställning snabbt och noggrant så att maten är varm och god när du hämtar den.',
  },
]

const values = [
  {
    icon: '🌿',
    title: 'Kvalitet',
    description: 'Vi kompromissar aldrig på råvarornas kvalitet. Varje ingrediens är noggrant utvald.',
  },
  {
    icon: '❤️',
    title: 'Passion',
    description: 'Matlagning är en konstform för oss. Varje rätt tillagas med kärlek och stolthet.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Gemenskap',
    description: 'Vi skapar en plats där familjer och vänner kan samlas och skapa minnen.',
  },
  {
    icon: '🌱',
    title: 'Hållbarhet',
    description: 'Vi prioriterar lokala och säsongsbetonade råvaror för en mer hållbar framtid.',
  },
]

interface OmOssClientProps {
  aboutTitle: string
  aboutText: string
  aboutStory: string
}

export default function OmOssClient({ aboutTitle, aboutText, aboutStory }: OmOssClientProps) {
  // Dela "En familjerestaurang med hjärta och historia" på "med " om möjligt
  // så vi behåller den stiliserade två-raders-rubriken med kursiv andra rad.
  const [titleStart, titleEnd] = (() => {
    const idx = aboutTitle.toLowerCase().indexOf(' med ')
    if (idx > 0) {
      return [aboutTitle.slice(0, idx), aboutTitle.slice(idx + 1)]
    }
    return [aboutTitle, '']
  })()
  return (
    <div className="bg-[#FAF4EB]">
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Vår historia
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-6">
              Om oss
            </h1>
            <div className="w-16 h-px bg-[#C0623A] mx-auto" />
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
                Nygatan 38, Hörby
              </span>
              <h2 className="font-playfair text-4xl font-bold text-[#1C1C1C] mt-4 mb-6 leading-tight">
                {titleStart}
                {titleEnd && (
                  <span className="block italic text-[#C0623A]">{titleEnd}</span>
                )}
              </h2>
              <div className="w-12 h-0.5 bg-[#C0623A] mb-8" />
              <p className="font-inter text-base text-[#1C1C1C]/70 leading-relaxed mb-6">
                {aboutText}
              </p>
              <p className="font-inter text-base text-[#1C1C1C]/70 leading-relaxed">
                {aboutStory}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: '4.1', label: 'Google-betyg (421 recensioner)' },
                { number: '#5', label: 'Av 34 restauranger i Hörby' },
                { number: '7', label: 'Dagar i veckan öppet' },
                { number: '615', label: 'Recensioner på RestaurantGuru' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#E8DDD0]"
                >
                  <div className="font-playfair text-4xl font-bold text-[#C0623A] mb-2">
                    {stat.number}
                  </div>
                  <div className="font-inter text-xs text-[#1C1C1C]/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1C1C1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="font-playfair text-4xl font-bold text-[#FAF4EB]">Våra värderingar</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FAF4EB]/5 border border-[#FAF4EB]/10 rounded-lg p-6 text-center hover:border-[#C0623A]/40 transition-colors"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-playfair text-xl font-bold text-[#FAF4EB] mb-3">{value.title}</h3>
                <p className="font-inter text-sm text-[#FAF4EB]/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Familjen bakom
            </span>
            <h2 className="font-playfair text-4xl font-bold text-[#1C1C1C] mt-4">Vårt team</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#E8DDD0] hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#C0623A]/20 to-[#1C1C1C]/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#C0623A]/20 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#C0623A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-bold text-[#1C1C1C] mb-1">{member.name}</h3>
                  <p className="font-inter text-sm text-[#C0623A] font-medium mb-4">{member.role}</p>
                  <p className="font-inter text-sm text-[#1C1C1C]/60 leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
