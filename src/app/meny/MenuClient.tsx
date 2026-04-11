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

const categorySubtitles: Record<string, string> = {
  Pizzor: 'Klassiska svenska pizzor med nummersatta favoriter — handgjord deg, färska råvaror',
  'Special Pizzor': 'Husets egna kreationer med generösa pålägg och karaktärsfulla smakkombinationer',
  'Taco Pizzor': 'Heta pizzor med tex-mex-twist — jalapeño, tacokryddor och kebabsås',
  'Italiensk Pizza': 'Premium-pizzor med mozzarella och lufttorkade delikatesser från Italien',
  Kycklingpizzor: 'Saftiga kycklingpizzor och vår populära husets kebabpizza',
  Sallader: 'Fräscha, generösa sallader med smakrika dressingar — perfekta för en lättare måltid',
  Kebab: 'Grillat nötkött tillagat på traditionellt sätt, serveras på olika vis',
  Falafel: 'Hemlagade falafelbullar — ett välsmakande vegetariskt alternativ',
  Hamburgare: 'Husets hemlagade burgare — 200g grillad nötkött med klassiska tillbehör',
  'À la Carte': 'Husets specialrätter och signaturrätter för den som vill ha något extra',
  Drycker: 'Kalla drycker till din måltid',
}

const categoryAllergens: Record<string, string> = {
  Pizzor: 'Gluten, Laktos, Ägg',
  'Special Pizzor': 'Gluten, Laktos, Ägg',
  'Taco Pizzor': 'Gluten, Laktos',
  'Italiensk Pizza': 'Gluten, Laktos',
  Kycklingpizzor: 'Gluten, Laktos, Selleri',
  Sallader: 'Ägg, Fisk, Skaldjur — fråga personalen',
  Kebab: 'Gluten, Selleri, Sesam',
  Falafel: 'Gluten, Sesam',
  Hamburgare: 'Gluten, Laktos, Ägg, Sesam',
  'À la Carte': 'Varierar — fråga personalen',
  Drycker: '',
}

export default function MenuClient({ menuItems }: MenuClientProps) {
  const availableCategories = Array.from(new Set(menuItems.map((i) => i.category)))
  const allCategories = ['Alla', ...availableCategories]
  const [activeCategory, setActiveCategory] = useState('Alla')

  const filtered =
    activeCategory === 'Alla'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* Header */}
      <section className="relative py-28 bg-[#1C1C1C] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A1810]/60 to-[#1C1C1C]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C0623A]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-[#C0623A] font-medium">
              Vår meny
            </span>
            <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-[#FAF4EB] mt-4 mb-5">
              La Carta
            </h1>
            <div className="w-14 h-px bg-[#C0623A] mx-auto mb-5" />
            <p className="font-inter text-base text-[#FAF4EB]/55 max-w-lg mx-auto leading-relaxed">
              Tillagat med kärlek, serverat med stolthet. Varje rätt är ett äkta uttryck för det italienska köket.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 lg:top-20 z-30 bg-[#FAF4EB]/95 backdrop-blur-sm border-b border-[#E8DDD0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#C0623A] text-white shadow-md'
                    : 'bg-white text-[#1C1C1C]/65 hover:bg-[#C0623A]/10 hover:text-[#C0623A] border border-[#E8DDD0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeCategory === 'Alla' ? (
                availableCategories.map((category) => {
                  const items = menuItems.filter((item) => item.category === category)
                  if (items.length === 0) return null
                  return (
                    <CategorySection
                      key={category}
                      category={category}
                      items={items}
                    />
                  )
                })
              ) : (
                <CategorySection
                  category={activeCategory}
                  items={filtered}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

function CategorySection({ category, items }: { category: string; items: MenuItem[] }) {
  const subtitle = categorySubtitles[category] ?? ''
  const allergens = categoryAllergens[category] ?? ''

  return (
    <div className="mb-16">
      {/* Category heading */}
      <div className="mb-8">
        <div className="flex items-center gap-5 mb-2">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-[#1C1C1C] whitespace-nowrap">
            {category}
          </h2>
          <div className="flex-1 h-px bg-[#D4C5B2]" />
        </div>
        {subtitle && (
          <p className="font-playfair italic text-[#C0623A]/80 text-base mt-1">{subtitle}</p>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} allergens={allergens} />
        ))}
      </div>
    </div>
  )
}

function MenuCard({
  item,
  index,
  allergens,
}: {
  item: MenuItem
  index: number
  allergens: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE3D7] flex flex-col"
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Name + pizza type */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-playfair text-lg font-bold text-[#1C1C1C] leading-snug">
            {item.name}
          </h3>
          {item.pizzaType && (
            <span
              className={`font-inter text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                item.pizzaType === 'family'
                  ? 'bg-[#C0623A]/10 text-[#C0623A]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {item.pizzaType === 'family' ? 'Familj' : 'Normal'}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="font-inter text-sm text-[#1C1C1C]/55 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

        {/* Allergen info box */}
        {allergens && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
            <p className="font-inter text-xs text-amber-800/70 italic">
              <span className="not-italic mr-1">⚠</span>
              Innehåller: {allergens}
            </p>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-end pt-2 border-t border-[#F0E8DF]">
          <span className="font-playfair text-xl font-bold text-[#C0623A]">
            {item.price} <span className="text-base font-normal">kr</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
