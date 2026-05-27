import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sidan kunde inte hittas',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF4EB] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center">
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
          404
        </span>
        <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#1C1C1C] mt-4 mb-6">
          Sidan finns inte
        </h1>
        <div className="w-12 h-px bg-[#C0623A] mx-auto mb-6" />
        <p className="font-inter text-base text-[#1C1C1C]/60 leading-relaxed mb-10">
          Vi kunde inte hitta sidan du letar efter. Den kan ha flyttats eller tagits bort.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#C0623A] text-white font-inter font-medium text-sm hover:bg-[#D4795A] transition-colors rounded"
        >
          Till startsidan
        </Link>
      </div>
    </main>
  )
}
