'use client'

import { useState, useEffect } from 'react'
import { getISOWeekNumber } from '@/lib/weekNumber'

interface LunchDay {
  id: number
  dayOfWeek: string
  dishName: string
  description: string
  price: number
}

interface WeeklySoup {
  id: number
  name: string
  description: string
  price: number
}

const days = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
]

const currentWeek = getISOWeekNumber()
const currentYear = new Date().getFullYear()

export default function AdminLunch() {
  const [lunchDays, setLunchDays] = useState<LunchDay[]>([])
  const [soup, setSoup] = useState<WeeklySoup | null>(null)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editingSoup, setEditingSoup] = useState(false)
  const [dayForm, setDayForm] = useState({ dishName: '', description: '', price: '' })
  const [soupForm, setSoupForm] = useState({ name: '', description: '', price: '' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [daysRes, soupRes] = await Promise.all([
      fetch(`/api/lunch?week=${currentWeek}&year=${currentYear}`),
      fetch(`/api/lunch/soup?week=${currentWeek}&year=${currentYear}`),
    ])
    setLunchDays(await daysRes.json())
    const soupData = await soupRes.json()
    setSoup(soupData)
    if (soupData) {
      setSoupForm({ name: soupData.name, description: soupData.description, price: String(soupData.price) })
    }
  }

  function startEditDay(dayKey: string) {
    const existing = lunchDays.find((d) => d.dayOfWeek === dayKey)
    setDayForm({
      dishName: existing?.dishName ?? '',
      description: existing?.description ?? '',
      price: existing ? String(existing.price) : '',
    })
    setEditingDay(dayKey)
  }

  async function saveDayForm(dayKey: string) {
    setIsSaving(true)
    try {
      await fetch('/api/lunch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek,
          year: currentYear,
          dayOfWeek: dayKey,
          dishName: dayForm.dishName,
          description: dayForm.description,
          price: parseFloat(dayForm.price),
        }),
      })
      setEditingDay(null)
      loadData()
    } finally {
      setIsSaving(false)
    }
  }

  async function saveSoupForm() {
    setIsSaving(true)
    try {
      await fetch('/api/lunch/soup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekNumber: currentWeek,
          year: currentYear,
          name: soupForm.name,
          description: soupForm.description,
          price: parseFloat(soupForm.price),
        }),
      })
      setEditingSoup(false)
      loadData()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Weekly Lunch Manager</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Week {currentWeek} — {currentYear}</p>
      </div>

      {/* Lunch days */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {days.map((day) => {
          const existing = lunchDays.find((d) => d.dayOfWeek === day.key)
          const isEditing = editingDay === day.key

          return (
            <div key={day.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-b border-gray-200">
                <h3 className="font-inter font-semibold text-gray-900">{day.label}</h3>
                {!isEditing && (
                  <button
                    onClick={() => startEditDay(day.key)}
                    className="font-inter text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {existing ? 'Edit' : 'Add'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Dish Name</label>
                      <input
                        type="text"
                        value={dayForm.dishName}
                        onChange={(e) => setDayForm({ ...dayForm, dishName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Price (kr)</label>
                      <input
                        type="number"
                        value={dayForm.price}
                        onChange={(e) => setDayForm({ ...dayForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={dayForm.description}
                        onChange={(e) => setDayForm({ ...dayForm, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      onClick={() => setEditingDay(null)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 font-inter text-xs rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveDayForm(day.key)}
                      disabled={isSaving}
                      className="px-3 py-1.5 bg-[#C0623A] text-white font-inter text-xs font-medium rounded hover:bg-[#D4795A] disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : existing ? (
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-inter font-medium text-gray-900 text-sm">{existing.dishName}</p>
                      <p className="font-inter text-xs text-gray-500 mt-0.5">{existing.description}</p>
                    </div>
                    <span className="font-inter text-sm font-bold text-[#C0623A]">{existing.price} kr</span>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <p className="font-inter text-sm text-gray-400 italic">No lunch set for this day</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly soup */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-b border-gray-200">
          <h3 className="font-inter font-semibold text-gray-900">Weekly Soup</h3>
          {!editingSoup && (
            <button
              onClick={() => setEditingSoup(true)}
              className="font-inter text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              {soup ? 'Edit' : 'Add'}
            </button>
          )}
        </div>

        {editingSoup ? (
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Soup Name</label>
                <input
                  type="text"
                  value={soupForm.name}
                  onChange={(e) => setSoupForm({ ...soupForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
                />
              </div>
              <div>
                <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Price (kr)</label>
                <input
                  type="number"
                  value={soupForm.price}
                  onChange={(e) => setSoupForm({ ...soupForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-inter text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={soupForm.description}
                  onChange={(e) => setSoupForm({ ...soupForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setEditingSoup(false)}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 font-inter text-xs rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSoupForm}
                disabled={isSaving}
                className="px-3 py-1.5 bg-[#C0623A] text-white font-inter text-xs font-medium rounded hover:bg-[#D4795A] disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : soup ? (
          <div className="p-5 flex items-start justify-between">
            <div>
              <p className="font-inter font-medium text-gray-900 text-sm">{soup.name}</p>
              <p className="font-inter text-xs text-gray-500 mt-0.5">{soup.description}</p>
            </div>
            <span className="font-inter text-sm font-bold text-[#C0623A]">{soup.price} kr</span>
          </div>
        ) : (
          <div className="p-5">
            <p className="font-inter text-sm text-gray-400 italic">No soup set for this week</p>
          </div>
        )}
      </div>
    </div>
  )
}
