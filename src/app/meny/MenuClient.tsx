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

// All DB categories that belong to the "Pizzor" group
const PIZZA_CATEGORIES = [
  'Pizzor',
  'Special Pizzor',
  'Inbakade Pizzor',
  'Vegetariska Pizzor',
  'Mexikanska Pizzor',
  'Oxfilé Pizzor',
  'Kebabpizzor',
  'Kycklingpizzor',
]

// Short labels shown in the sub-category pill row
const PIZZA_SUB_LABELS: Record<string, string> = {
  'Pizzor': 'Vanliga',
  'Special Pizzor': 'Special',
  'Inbakade Pizzor': 'Inbakade',
  'Vegetariska Pizzor': 'Vegetariska',
  'Mexikanska Pizzor': 'Mexikanska',
  'Oxfilé Pizzor': 'Oxfilé',
  'Kebabpizzor': 'Kebabpizzor',
  'Kycklingpizzor': 'Kycklingpizzor',
}

// Canonical display order for the top-level filter
const TOP_LEVEL_ORDER = [
  'Förrätter', 'Plankor', 'Varmrätter', 'Barn Meny', 'Pasta',
  '__PIZZOR__',   // placeholder for the grouped pizza button
  'Kebab', 'Bakpotatis', 'Sallader', 'Drycker',
]

const categorySubtitles: Record<string, string> = {
  Förrätter: 'Smakrika aptitretare för att sätta stämningen — perfekta att dela',
  Plankor: 'Husets stolthet — kött och fisk tillagat till perfektion, serverat på planka',
  Varmrätter: 'Klassiska och vällagade huvudrätter med färska råvaror och smakrika såser',
  'Barn Meny': 'Enkla och välsmakande rätter anpassade för de minsta gästerna',
  Pasta: 'Hemlagad pasta med generösa tillbehör och riven parmesan',
  Pizzor: 'Klassiska pizzor på handgjord deg med färska råvaror — en sann Valentino-tradition',
  'Special Pizzor': 'Husets signaturskapelser med generösa pålägg och karaktärsfulla kombinationer',
  'Inbakade Pizzor': 'Handvikta pizzor med fyllningen inbakad — krispiga och smakrika',
  'Vegetariska Pizzor': 'Färska grönsaker och delikatesser — fullt av smak utan kött',
  'Mexikanska Pizzor': 'Heta pizzor med tex-mex-twist — jalapeño, tacosås och fräscha smaker',
  'Oxfilé Pizzor': 'Premium-pizzor med mört oxfilékött och bearnaisesås',
  Kebabpizzor: 'Kryddigt kebabkött möter krispig pizzabotten — ett mäktigt val',
  Kycklingpizzor: 'Saftigt kycklingkött med feferoni och husets milda sås',
  Kebab: 'Grillat kött tillagat på traditionellt sätt — välj din favorit',
  Bakpotatis: 'Ugnsgräddat med smakrika tillbehör. Välj valfri sås/dressing',
  Sallader: 'Fräscha, generösa sallader — serveras med hembakat bröd och valfri dressing',
  Drycker: 'Kalla drycker till din måltid',
}

const categoryAllergens: Record<string, string> = {
  Förrätter: 'Gluten, Laktos, Fisk, Skaldjur — fråga personalen',
  Plankor: 'Laktos, Fisk, Skaldjur — fråga personalen',
  Varmrätter: 'Gluten, Laktos, Fisk, Skaldjur — fråga personalen',
  'Barn Meny': 'Gluten, Laktos, Ägg — fråga personalen',
  Pasta: 'Gluten, Laktos, Fisk — fråga personalen',
  Pizzor: 'Gluten, Laktos',
  'Special Pizzor': 'Gluten, Laktos, Fisk, Skaldjur — fråga personalen',
  'Inbakade Pizzor': 'Gluten, Laktos',
  'Vegetariska Pizzor': 'Gluten, Laktos',
  'Mexikanska Pizzor': 'Gluten, Laktos',
  'Oxfilé Pizzor': 'Gluten, Laktos',
  Kebabpizzor: 'Gluten, Laktos, Selleri',
  Kycklingpizzor: 'Gluten, Laktos, Selleri',
  Kebab: 'Gluten, Selleri, Sesam',
  Bakpotatis: 'Fisk, Skaldjur, Laktos — fråga personalen',
  Sallader: 'Ägg, Fisk, Skaldjur — fråga personalen',
  Drycker: '',
}

export default function MenuClient({ menuItems }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState('Alla')
  // null = show all pizza subcategories, or a specific pizza cat name
  const [activePizzaSub, setActivePizzaSub] = useState<string | null>(null)

  const dbCategoriesArr = Array.from(new Set(menuItems.map((i) => i.category)))
  const dbCategories = new Set(dbCategoriesArr)

  // Build ordered top-level filter list from items in the DB
  const topLevelFilter: string[] = ['Alla']
  for (const entry of TOP_LEVEL_ORDER) {
    if (entry === '__PIZZOR__') {
      if (PIZZA_CATEGORIES.some((c) => dbCategories.has(c))) {
        topLevelFilter.push('Pizzor')
      }
    } else if (dbCategories.has(entry)) {
      topLevelFilter.push(entry)
    }
  }
  // Catch any DB categories not in our predefined order
  for (const cat of dbCategoriesArr) {
    if (!PIZZA_CATEGORIES.includes(cat) && !topLevelFilter.includes(cat)) {
      topLevelFilter.push(cat)
    }
  }

  // Pizza subcategories actually present in the DB, in canonical order
  const availablePizzaSubs = PIZZA_CATEGORIES.filter((c) => dbCategories.has(c))

  function handleTopClick(cat: string) {
    setActiveCategory(cat)
    setActivePizzaSub(null) // reset sub when switching top-level
  }

  // Determine which categories to render as sections
  function renderSections() {
    if (activeCategory === 'Alla') {
      // Show everything in order
      const allOrdered = [
        ...TOP_LEVEL_ORDER.flatMap((e) =>
          e === '__PIZZOR__' ? availablePizzaSubs : dbCategories.has(e) ? [e] : []
        ),
        ...dbCategoriesArr.filter(
          (c) => !PIZZA_CATEGORIES.includes(c) && !TOP_LEVEL_ORDER.includes(c)
        ),
      ]
      return allOrdered.map((cat) => {
        const items = menuItems.filter((i) => i.category === cat)
        if (items.length === 0) return null
        return <CategorySection key={cat} category={cat} items={items} />
      })
    }

    if (activeCategory === 'Pizzor') {
      const subsToShow = activePizzaSub ? [activePizzaSub] : availablePizzaSubs
      return subsToShow.map((cat) => {
        const items = menuItems.filter((i) => i.category === cat)
        if (items.length === 0) return null
        return <CategorySection key={cat} category={cat} items={items} />
      })
    }

    // Single non-pizza category
    const items = menuItems.filter((i) => i.category === activeCategory)
    return <CategorySection category={activeCategory} items={items} />
  }

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
          {/* Top-level pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {topLevelFilter.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTopClick(cat)}
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

          {/* Pizza sub-category pills — only visible when Pizzor is active */}
          <AnimatePresence>
            {activeCategory === 'Pizzor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
                  <span className="flex-shrink-0 font-inter text-xs text-[#1C1C1C]/40 uppercase tracking-wider mr-1">
                    Typ:
                  </span>
                  <button
                    onClick={() => setActivePizzaSub(null)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full font-inter text-xs font-medium transition-all duration-300 ${
                      activePizzaSub === null
                        ? 'bg-[#1C1C1C] text-white'
                        : 'bg-white text-[#1C1C1C]/65 hover:bg-[#1C1C1C]/10 hover:text-[#1C1C1C] border border-[#E8DDD0]'
                    }`}
                  >
                    Alla pizzor
                  </button>
                  {availablePizzaSubs.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActivePizzaSub(cat)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full font-inter text-xs font-medium transition-all duration-300 ${
                        activePizzaSub === cat
                          ? 'bg-[#1C1C1C] text-white'
                          : 'bg-white text-[#1C1C1C]/65 hover:bg-[#1C1C1C]/10 hover:text-[#1C1C1C] border border-[#E8DDD0]'
                      }`}
                    >
                      {PIZZA_SUB_LABELS[cat] ?? cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + (activePizzaSub ?? '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderSections()}
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
