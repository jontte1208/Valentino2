'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Hem' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/meny', label: 'Meny' },
  { href: '/veckans-lunch', label: 'Veckans lunch' },
  { href: '/boka-bord', label: 'Boka bord' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/galleri', label: 'Galleri' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isHomePage = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage || isMobileMenuOpen
          ? 'bg-[#1C1C1C]/98 shadow-lg backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-2xl font-bold text-[#FAF4EB] hover:text-[#C0623A] transition-colors duration-300 tracking-wide"
          >
            Valentino
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium font-inter transition-all duration-300 rounded-sm ${
                  pathname === link.href
                    ? 'text-[#C0623A]'
                    : 'text-[#FAF4EB]/90 hover:text-[#FAF4EB]'
                } ${
                  link.href === '/boka-bord'
                    ? 'ml-2 bg-[#C0623A] text-white hover:bg-[#D4795A] px-5 py-2 rounded'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#FAF4EB] hover:text-[#C0623A] transition-colors"
            aria-label="Öppna meny"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#FAF4EB]/10">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-inter font-medium rounded transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-[#C0623A] bg-[#C0623A]/10'
                      : 'text-[#FAF4EB]/90 hover:text-[#FAF4EB] hover:bg-[#FAF4EB]/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
