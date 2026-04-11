'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  pizzaType: string | null
}

interface MenuClientProps {
  menuItems: MenuItem[]
}

const categories = ['Alla', 'Förrätter', 'Huvudrätter', 'Pizzor', 'Desserter', 'Drycker']

export default function MenuClient({ menuItems }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState('Alla')

  const filtered =
    activeCategory === 'Alla'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
      <section className="relative py-32 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Vår meny
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-6">
              La Carta
            </h1>
            <div className="w-16 h-px bg-[#C0623A] mx-auto mb-6" />
            <p className="font-inter text-base text-[#FAF4EB]/60 max-w-xl mx-auto">
              Tillagat med kärlek, serverat med stolthet. Varje rätt är ett äkta uttryck för det italienska köket.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 lg:top-20 z-30 bg-[#FAF4EB] border-b border-[#E8DDD0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#C0623A] text-white shadow-md'
                    : 'bg-white text-[#1C1C1C]/70 hover:bg-[#C0623A]/10 hover:text-[#C0623A] border border-[#E8DDD0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeCategory === 'Alla' ? (
                // Group by category when showing all
                categories
                  .filter((c) => c !== 'Alla')
                  .map((category) => {
                    const items = menuItems.filter((item) => item.category === category)
                    if (items.length === 0) return null
                    return (
                      <div key={category} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                          <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C]">{category}</h2>
                          <div className="flex-1 h-px bg-[#E8DDD0]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {items.map((item, i) => (
                            <MenuCard key={item.id} item={item} index={i} />
                          ))}
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-playfair text-3xl font-bold text-[#1C1C1C]">{activeCategory}</h2>
                    <div className="flex-1 h-px bg-[#E8DDD0]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item, i) => (
                      <MenuCard key={item.id} item={item} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white rounded-lg p-6 border border-[#E8DDD0] hover:border-[#C0623A]/40 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="font-playfair text-lg font-bold text-[#1C1C1C] group-hover:text-[#C0623A] transition-colors leading-tight">
          {item.name}
        </h3>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="font-inter font-semibold text-[#C0623A] text-lg">{item.price} kr</span>
          {item.pizzaType && (
            <span
              className={`font-inter text-xs px-2 py-0.5 rounded-full ${
                item.pizzaType === 'family'
                  ? 'bg-[#C0623A]/10 text-[#C0623A]'
                  : 'bg-[#1C1C1C]/10 text-[#1C1C1C]/70'
              }`}
            >
              {item.pizzaType === 'family' ? 'Familjepizza' : 'Vanlig pizza'}
            </span>
          )}
        </div>
      </div>
      <p className="font-inter text-sm text-[#1C1C1C]/60 leading-relaxed">{item.description}</p>
    </motion.div>
  )
}
