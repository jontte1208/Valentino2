'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import AdminMenu from './sections/AdminMenu'
import AdminLunch from './sections/AdminLunch'
import AdminContent from './sections/AdminContent'
import AdminGallery from './sections/AdminGallery'
import AdminBookings from './sections/AdminBookings'

type Section = 'menu' | 'lunch' | 'content' | 'gallery' | 'bookings'

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: 'menu', label: 'Menu Manager', icon: '🍽️' },
  { id: 'lunch', label: 'Weekly Lunch', icon: '🥗' },
  { id: 'content', label: 'Page Editor', icon: '📝' },
  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('menu')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#1C1C1C] text-[#FAF4EB] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <span className="font-playfair text-2xl font-bold">Valentino</span>
          <span className="font-inter text-sm text-[#FAF4EB]/50">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="font-inter text-sm text-[#FAF4EB]/70 hover:text-[#FAF4EB] transition-colors"
          >
            View site →
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="font-inter text-sm px-4 py-2 border border-[#FAF4EB]/20 rounded hover:bg-[#FAF4EB]/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 font-inter text-sm text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#C0623A]/10 text-[#C0623A] border-r-2 border-[#C0623A] font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeSection === 'menu' && <AdminMenu />}
          {activeSection === 'lunch' && <AdminLunch />}
          {activeSection === 'content' && <AdminContent />}
          {activeSection === 'gallery' && <AdminGallery />}
          {activeSection === 'bookings' && <AdminBookings />}
        </main>
      </div>
    </div>
  )
}
