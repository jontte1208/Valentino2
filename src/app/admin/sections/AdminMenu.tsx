'use client'

import { useState, useEffect } from 'react'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  pizzaType: string | null
  order: number
}

const DEFAULT_CATEGORIES = [
  'Pizzor', 'Special Pizzor', 'Taco Pizzor', 'Italiensk Pizza', 'Kycklingpizzor',
  'Sallader', 'Kebab', 'Falafel', 'Hamburgare', 'À la Carte', 'Drycker',
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Förrätter',
  pizzaType: '',
  order: '0',
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filterCategory, setFilterCategory] = useState('All')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      setItems(data)
    } finally {
      setIsLoading(false)
    }
  }

  function handleEdit(item: MenuItem) {
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      pizzaType: item.pizzaType ?? '',
      order: String(item.order),
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  function handleNew() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return
    await fetch(`/api/menu/${id}`, { method: 'DELETE' })
    loadItems()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        order: parseInt(form.order),
        pizzaType: form.pizzaType || null,
      }

      if (editingId) {
        await fetch(`/api/menu/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      loadItems()
    } finally {
      setIsSaving(false)
    }
  }

  // Derive categories from loaded items, falling back to defaults if DB is empty
  const categories = items.length > 0
    ? Array.from(new Set(items.map((i) => i.category))).sort()
    : DEFAULT_CATEGORIES

  const filtered = filterCategory === 'All' ? items : items.filter((i) => i.category === filterCategory)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Menu Manager</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-[#C0623A] text-white font-inter text-sm font-medium rounded hover:bg-[#D4795A] transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-inter text-xs font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-[#C0623A] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C0623A] hover:text-[#C0623A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-inter font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Item' : 'New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Price (kr) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] resize-none"
              />
            </div>
            <div>
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] bg-white"
              >
                {(categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Pizza Type</label>
              <select
                value={form.pizzaType}
                onChange={(e) => setForm({ ...form, pizzaType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] bg-white"
              >
                <option value="">None</option>
                <option value="regular">Regular</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div>
              <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null) }}
                className="px-4 py-2 border border-gray-200 text-gray-600 font-inter text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-[#C0623A] text-white font-inter text-sm font-medium rounded hover:bg-[#D4795A] disabled:opacity-60 transition-colors"
              >
                {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items list */}
      {isLoading ? (
        <p className="font-inter text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-right px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-inter text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="font-inter text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</div>
                    {item.pizzaType && (
                      <span className="font-inter text-xs px-2 py-0.5 bg-[#C0623A]/10 text-[#C0623A] rounded-full mt-1 inline-block">
                        {item.pizzaType === 'family' ? 'Family' : 'Regular'} pizza
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-inter text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-inter text-sm font-semibold text-[#C0623A]">{item.price} kr</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="font-inter text-xs text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="font-inter text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 font-inter text-gray-500 text-sm">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
