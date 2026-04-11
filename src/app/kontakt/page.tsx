'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function KontaktPage() {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSuccess(true)
    setIsSubmitting(false)
    setForm(initialForm)
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Adress',
      value: 'Nygatan 38, 242 31 Hörby, Skåne',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Telefon',
      value: '0415-100 39',
      href: 'tel:0415-10039',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'E-post',
      value: 'pizzeria-valentino@hotmail.com',
      href: 'mailto:pizzeria-valentino@hotmail.com',
    },
  ]

  const hours = [
    { day: 'Måndag', hours: '11:30 – 22:00' },
    { day: 'Tisdag', hours: '11:00 – 22:00' },
    { day: 'Onsdag', hours: '11:30 – 22:00' },
    { day: 'Torsdag', hours: '11:30 – 22:00' },
    { day: 'Fredag', hours: '11:30 – 23:00' },
    { day: 'Lördag', hours: '12:00 – 23:00' },
    { day: 'Söndag', hours: '13:00 – 21:00' },
  ]

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C] mb-8">
                Hitta oss
              </h2>

              <div className="space-y-6 mb-10">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C0623A]/10 flex items-center justify-center text-[#C0623A]">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-inter text-xs uppercase tracking-widest text-[#1C1C1C]/50 font-medium mb-1">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-inter text-base text-[#1C1C1C] hover:text-[#C0623A] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-inter text-base text-[#1C1C1C]">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="bg-[#1C1C1C] rounded-xl p-6 text-[#FAF4EB]">
                <h3 className="font-playfair text-xl font-bold mb-4">Öppettider</h3>
                <div className="space-y-3">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between items-center">
                      <span className="font-inter text-sm text-[#FAF4EB]/70">{h.day}</span>
                      <span className="font-inter text-sm font-medium text-[#FAF4EB]">{h.hours}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-[#FAF4EB]/10">
                    <p className="font-inter text-xs text-[#FAF4EB]/50">
                      Lunch: Måndag–Fredag 11:00–14:30
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-xl overflow-hidden border border-[#E8DDD0]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2271.3!2d13.6597595!3d55.850975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46542b3e3a3a3a3a%3A0x0!2sNygatan%2038%2C%20242%2031%20H%C3%B6rby!5e0!3m2!1ssv!2sse!4v1700000000000"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Valentino Restaurang karta"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C] mb-8">
                Skicka ett meddelande
              </h2>

              {isSuccess ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#E8DDD0]">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-[#1C1C1C] mb-3">Tack!</h3>
                  <p className="font-inter text-[#1C1C1C]/60 mb-6">
                    Vi återkommer till dig så snart som möjligt.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2 bg-[#C0623A] text-white font-inter text-sm rounded hover:bg-[#D4795A] transition-colors"
                  >
                    Skicka nytt meddelande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        Namn <span className="text-[#C0623A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        E-post <span className="text-[#C0623A]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                      Ämne
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                      Meddelande <span className="text-[#C0623A]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#C0623A] text-white font-inter font-semibold rounded-lg hover:bg-[#D4795A] disabled:opacity-60 transition-all duration-300"
                  >
                    {isSubmitting ? 'Skickar...' : 'Skicka meddelande'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
