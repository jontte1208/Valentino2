'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface BookingFormData {
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: string
  specialRequests: string
}

const initialForm: BookingFormData = {
  name: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  guests: '2',
  specialRequests: '',
}

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
]

export default function BokaBordPage() {
  const [form, setForm] = useState<BookingFormData>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: parseInt(form.guests) }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Något gick fel')
      }

      setIsSuccess(true)
      setForm(initialForm)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Något gick fel. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Reservera ditt bord
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-6">
              Boka bord
            </h1>
            <div className="w-16 h-px bg-[#C0623A] mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C] mb-4">
                Tack för din bokning!
              </h2>
              <p className="font-inter text-[#1C1C1C]/60 mb-8">
                Vi bekräftar din bokning via e-post inom kort. Vi ser fram emot att välkomna dig till Valentino!
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-[#C0623A] text-white font-inter font-medium rounded hover:bg-[#D4795A] transition-colors"
              >
                Gör en ny bokning
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden">
                <div className="bg-[#C0623A] px-8 py-6">
                  <h2 className="font-playfair text-2xl font-bold text-white">
                    Reservationsformulär
                  </h2>
                  <p className="font-inter text-white/80 text-sm mt-1">
                    Fyll i dina uppgifter nedan för att boka bord
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="font-inter text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        placeholder="Ditt fullständiga namn"
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        Telefon <span className="text-[#C0623A]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="07X-XXX XX XX"
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                      E-postadress <span className="text-[#C0623A]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="din@email.se"
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-1">
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        Datum <span className="text-[#C0623A]">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        min={today}
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        Tid <span className="text-[#C0623A]">*</span>
                      </label>
                      <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors bg-white"
                      >
                        <option value="">Välj tid</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                        Antal gäster <span className="text-[#C0623A]">*</span>
                      </label>
                      <select
                        name="guests"
                        value={form.guests}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors bg-white"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'gäst' : 'gäster'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                      Önskemål eller allergier
                    </label>
                    <textarea
                      name="specialRequests"
                      value={form.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Meddela oss om du har särskilda önskemål, allergier eller firar något speciellt..."
                      className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#C0623A] text-white font-inter font-semibold text-base rounded-lg hover:bg-[#D4795A] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Bokar...
                      </>
                    ) : (
                      'Boka bord'
                    )}
                  </button>

                  <p className="font-inter text-xs text-[#1C1C1C]/50 text-center">
                    Vi bekräftar din bokning via e-post. För sällskap om fler än 10 personer, vänligen ring oss på 08-641 22 33.
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
