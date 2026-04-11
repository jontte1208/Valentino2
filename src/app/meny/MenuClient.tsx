'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryFilterBar, { MenuCategory } from './CategoryFilterBar'

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

// All DB category names that belong to the "Pizzor" group
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

// Short labels for the sub-category pills
const PIZZA_SUB_LABELS: Record<string, string> = {
  Pizzor: 'Vanliga',
  'Special Pizzor': 'Special',
  'Inbakade Pizzor': 'Inbakade',
  'Vegetariska Pizzor': 'Vegetariska',
  'Mexikanska Pizzor': 'Mexikanska',
  'Oxfilé Pizzor': 'Oxfilé',
  Kebabpizzor: 'Kebabpizzor',
  Kycklingpizzor: 'Kycklingpizzor',
}

// Canonical display order for non-pizza top-level categories
const TOP_LEVEL_BEFORE_PIZZA = ['Förrätter', 'Plankor', 'Varmrätter', 'Barn Meny', 'Pasta']
const TOP_LEVEL_AFTER_PIZZA = ['Kebab', 'Bakpotatis', 'Sallader', 'Drycker']

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


export default function MenuClient({ menuItems }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState('Alla')
  const [activePizzaSub, setActivePizzaSub] = useState<string | null>(null)

  const dbCategoriesArr = Array.from(new Set(menuItems.map((i) => i.category)))
  const dbCategories = new Set(dbCategoriesArr)

  // ── Build the categories data structure for the filter bar ──────────────
  const availablePizzaSubs = PIZZA_CATEGORIES.filter((c) => dbCategories.has(c))

  const categories: MenuCategory[] = [{ id: 'Alla', label: 'Alla', subcategories: [] }]

  for (const cat of TOP_LEVEL_BEFORE_PIZZA) {
    if (dbCategories.has(cat)) {
      categories.push({ id: cat, label: cat, subcategories: [] })
    }
  }

  if (availablePizzaSubs.length > 0) {
    categories.push({
      id: 'Pizzor',
      label: 'Pizzor',
      subcategories: [
        { id: 'all', label: 'Alla pizzor' },
        ...availablePizzaSubs.map((c) => ({ id: c, label: PIZZA_SUB_LABELS[c] ?? c })),
      ],
    })
  }

  for (const cat of TOP_LEVEL_AFTER_PIZZA) {
    if (dbCategories.has(cat)) {
      categories.push({ id: cat, label: cat, subcategories: [] })
    }
  }

  // Any remaining DB categories not in our predefined order
  for (const cat of dbCategoriesArr) {
    if (!PIZZA_CATEGORIES.includes(cat) && !categories.some((c) => c.id === cat)) {
      categories.push({ id: cat, label: cat, subcategories: [] })
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleCategoryChange(id: string) {
    setActiveCategory(id)
    setActivePizzaSub(null)
  }

  function handleSubcategoryChange(id: string | null) {
    setActivePizzaSub(id)
  }

  // ── Determine which category sections to render ──────────────────────
  function getSectionsToRender(): string[] {
    if (activeCategory === 'Alla') {
      return [
        ...TOP_LEVEL_BEFORE_PIZZA.filter((c) => dbCategories.has(c)),
        ...availablePizzaSubs,
        ...TOP_LEVEL_AFTER_PIZZA.filter((c) => dbCategories.has(c)),
        ...dbCategoriesArr.filter(
          (c) =>
            !PIZZA_CATEGORIES.includes(c) &&
            !TOP_LEVEL_BEFORE_PIZZA.includes(c) &&
            !TOP_LEVEL_AFTER_PIZZA.includes(c) &&
            c !== 'Alla'
        ),
      ]
    }

    if (activeCategory === 'Pizzor') {
      return activePizzaSub ? [activePizzaSub] : availablePizzaSubs
    }

    return [activeCategory]
  }

  return (
    <div className="bg-[#FAF4EB] min-h-screen">
      {/* ── Hero header ─────────────────────────────────────────────────── */}
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
              Tillagat med kärlek, serverat med stolthet. Varje rätt är ett äkta uttryck för det
              italienska köket.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <section className="sticky top-16 lg:top-20 z-30 bg-[#FAF4EB]/95 backdrop-blur-sm border-b border-[#E8DDD0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilterBar
            categories={categories}
            activeCategory={activeCategory}
            activeSubcategory={activePizzaSub}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
          />
        </div>
      </section>

      {/* ── Menu sections ───────────────────────────────────────────────── */}
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
              {getSectionsToRender().map((cat) => {
                const items = menuItems.filter((i) => i.category === cat)
                if (items.length === 0) return null
                return <CategorySection key={cat} category={cat} items={items} />
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

// ── Category section ─────────────────────────────────────────────────────────
function CategorySection({ category, items }: { category: string; items: MenuItem[] }) {
  const subtitle = categorySubtitles[category] ?? ''

  return (
    <div className="mb-16">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

// ── Menu card ────────────────────────────────────────────────────────────────
function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE3D7] flex flex-col"
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-playfair text-lg font-bold text-[#1C1C1C] leading-snug">{item.name}</h3>
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

        <p className="font-inter text-sm text-[#1C1C1C]/55 leading-relaxed mb-4 flex-1">
          {item.description}
        </p>

<div className="flex items-center justify-end pt-2 border-t border-[#F0E8DF]">
          <span className="font-playfair text-xl font-bold text-[#C0623A]">
            {item.price} <span className="text-base font-normal">kr</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
