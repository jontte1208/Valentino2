'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

// App-router error boundary. Visas vid unhandled fel under rendering.
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Logga felet — i prod fångas detta av Vercel-loggar.
    // eslint-disable-next-line no-console
    console.error('App error boundary caught:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#FAF4EB] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center">
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
          Något gick fel
        </span>
        <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#1C1C1C] mt-4 mb-6">
          Ett oväntat fel uppstod
        </h1>
        <div className="w-12 h-px bg-[#C0623A] mx-auto mb-6" />
        <p className="font-inter text-base text-[#1C1C1C]/60 leading-relaxed mb-10">
          Försök igen om en stund. Om problemet kvarstår, ring oss på 0415-100 39.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-8 py-4 bg-[#C0623A] text-white font-inter font-medium text-sm hover:bg-[#D4795A] transition-colors rounded"
        >
          Försök igen
        </button>
      </div>
    </main>
  )
}
