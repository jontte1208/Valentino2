'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface MenuCategory {
  id: string
  label: string
  subcategories: { id: string; label: string }[]
}

interface Props {
  categories: MenuCategory[]
  activeCategory: string
  activeSubcategory: string | null
  onCategoryChange: (id: string) => void
  onSubcategoryChange: (id: string | null) => void
}

// ─── Scroll-arrow hook ────────────────────────────────────────────────────────
function useScrollArrows() {
  const ref = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const check = useCallback(() => {
    const el = ref.current
    if (!el) return
    setShowLeft(el.scrollLeft > 4)
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [check])

  const nudgeLeft = () => ref.current?.scrollBy({ left: -200, behavior: 'smooth' })
  const nudgeRight = () => ref.current?.scrollBy({ left: 200, behavior: 'smooth' })

  return { ref, showLeft, showRight, nudgeLeft, nudgeRight }
}

// ─── Arrow button ─────────────────────────────────────────────────────────────
function ArrowBtn({
  dir,
  onClick,
  size = 'md',
}: {
  dir: 'left' | 'right'
  onClick: () => void
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
  const iconSize = size === 'sm' ? 14 : 16
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      aria-label={dir === 'left' ? 'Scroll vänster' : 'Scroll höger'}
      className={`flex-shrink-0 ${dim} flex items-center justify-center bg-[#FAF4EB] border border-[#E0D5C8] rounded-full shadow-sm text-[#1C1C1C]/40 hover:text-[#C0623A] hover:border-[#C0623A] transition-colors duration-200`}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
        {dir === 'left' ? (
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </motion.button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CategoryFilterBar({
  categories,
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
}: Props) {
  const main = useScrollArrows()
  const sub = useScrollArrows()

  const activeCat = categories.find((c) => c.id === activeCategory)
  const hasSubs = (activeCat?.subcategories.length ?? 0) > 0

  return (
    <div>
      {/* ── Row 1: Main categories ───────────────────────────────────────── */}
      <div className="flex items-center gap-2 py-4">
        <AnimatePresence>{main.showLeft && <ArrowBtn dir="left" onClick={main.nudgeLeft} />}</AnimatePresence>

        <div
          ref={main.ref}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-inter text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#C0623A] text-white shadow-md'
                  : 'bg-white text-[#1C1C1C]/60 hover:bg-[#C0623A]/10 hover:text-[#C0623A] border border-[#E8DDD0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence>{main.showRight && <ArrowBtn dir="right" onClick={main.nudgeRight} />}</AnimatePresence>
      </div>

      {/* ── Row 2: Sub-categories (animated in/out) ──────────────────────── */}
      <AnimatePresence>
        {hasSubs && (
          <motion.div
            key="sub-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-3 border-t border-[#E8DDD0]/70 pt-3">
              {/* Sticky "TYP:" label — stays in place while pills scroll */}
              <span className="flex-shrink-0 font-inter text-[10px] font-semibold tracking-[0.18em] uppercase text-[#1C1C1C]/35 select-none">
                Typ
              </span>

              {/* Scrollable sub-pill container */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <AnimatePresence>{sub.showLeft && <ArrowBtn dir="left" onClick={sub.nudgeLeft} size="sm" />}</AnimatePresence>

                <div
                  ref={sub.ref}
                  className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0"
                >
                  {activeCat?.subcategories.map((s) => {
                    const isActive = s.id === 'all' ? activeSubcategory === null : activeSubcategory === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => onSubcategoryChange(s.id === 'all' ? null : s.id)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full font-inter text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-[#1C1C1C] text-white'
                            : 'bg-white text-[#1C1C1C]/60 hover:bg-[#1C1C1C]/10 hover:text-[#1C1C1C] border border-[#E8DDD0]'
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>

                <AnimatePresence>{sub.showRight && <ArrowBtn dir="right" onClick={sub.nudgeRight} size="sm" />}</AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
