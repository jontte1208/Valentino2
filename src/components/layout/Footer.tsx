import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-[#FAF4EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-playfair text-3xl font-bold text-[#FAF4EB] mb-4">
              Valentino
            </h3>
            <p className="font-inter text-sm text-[#FAF4EB]/60 leading-relaxed mb-6">
              Pizzeria &amp; Restaurang i Hörby, Skåne. Pizza, kebab, pasta och mer — öppet alla dagar i veckan.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/Restaurang.valentino/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#C0623A]/40 flex items-center justify-center text-[#C0623A] hover:bg-[#C0623A] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/Restaurang.valentino/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#C0623A]/40 flex items-center justify-center text-[#C0623A] hover:bg-[#C0623A] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-inter font-semibold text-sm uppercase tracking-widest text-[#C0623A] mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Hem' },
                { href: '/om-oss', label: 'Om oss' },
                { href: '/meny', label: 'Meny' },
                { href: '/veckans-lunch', label: 'Veckans lunch' },
                { href: '/galleri', label: 'Galleri' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter font-semibold text-sm uppercase tracking-widest text-[#C0623A] mb-5">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="block">Nygatan 38</span>
                <span className="block">242 31 Hörby, Skåne</span>
              </li>
              <li>
                <a
                  href="tel:0415-10039"
                  className="font-inter text-sm text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors"
                >
                  0415-100 39
                </a>
              </li>
              <li>
                <a
                  href="mailto:pizzeria-valentino@hotmail.com"
                  className="font-inter text-sm text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors"
                >
                  pizzeria-valentino@hotmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-inter font-semibold text-sm uppercase tracking-widest text-[#C0623A] mb-5">
              Öppettider
            </h4>
            <ul className="space-y-2">
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Mån</span>
                <span className="block text-xs mt-0.5">11:30 – 22:00</span>
              </li>
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Tis</span>
                <span className="block text-xs mt-0.5">11:00 – 22:00</span>
              </li>
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Ons–Tor</span>
                <span className="block text-xs mt-0.5">11:30 – 22:00</span>
              </li>
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Fredag</span>
                <span className="block text-xs mt-0.5">11:30 – 23:00</span>
              </li>
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Lördag</span>
                <span className="block text-xs mt-0.5">12:00 – 23:00</span>
              </li>
              <li className="font-inter text-sm text-[#FAF4EB]/70">
                <span className="text-[#FAF4EB]/90 font-medium">Söndag</span>
                <span className="block text-xs mt-0.5">13:00 – 21:00</span>
              </li>
              <li className="pt-2 border-t border-[#FAF4EB]/10 font-inter text-xs text-[#FAF4EB]/50">
                Lunch serveras mån–fre 11:00–14:30
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FAF4EB]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-inter text-sm text-[#FAF4EB]/40">
            © {new Date().getFullYear()} Valentino Ristorante. Alla rättigheter förbehållna.
          </p>
          <Link
            href="/kontakt"
            className="font-inter text-sm text-[#FAF4EB]/40 hover:text-[#FAF4EB]/70 transition-colors"
          >
            Kontakta oss
          </Link>
        </div>
      </div>
    </footer>
  )
}
