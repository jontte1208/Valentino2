'use client'

import { useState, useEffect } from 'react'

interface ContentItem {
  id: number
  key: string
  value: string
}

const contentLabels: Record<string, string> = {
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
  hero_tagline: 'Hero Tagline',
  welcome_text: 'Welcome Text (Homepage)',
  about_text: 'About Text (Om oss)',
  about_story: 'About Story (Om oss)',
  address: 'Address',
  phone: 'Phone',
  email: 'Email',
  opening_hours: 'Opening Hours',
  lunch_hours: 'Lunch Hours',
  meta_description: 'Meta Description (SEO)',
}

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/content')
      setItems(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  function startEdit(item: ContentItem) {
    setEditingKey(item.key)
    setEditValue(item.value)
  }

  async function saveEdit(key: string) {
    setIsSaving(true)
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: editValue }),
      })
      setEditingKey(null)
      setSavedKey(key)
      setTimeout(() => setSavedKey(null), 2000)
      loadContent()
    } finally {
      setIsSaving(false)
    }
  }

  const isMultiLine = (key: string) =>
    ['welcome_text', 'about_text', 'about_story', 'opening_hours', 'meta_description'].includes(key)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Page Editor</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Edit website text content</p>
      </div>

      {isLoading ? (
        <p className="font-inter text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isEditing = editingKey === item.key
            const label = contentLabels[item.key] ?? item.key
            const multiLine = isMultiLine(item.key)

            return (
              <div
                key={item.key}
                className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-colors ${
                  savedKey === item.key ? 'border-green-300' : 'border-gray-200'
                }`}
              >
                <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-b border-gray-200">
                  <div>
                    <span className="font-inter text-sm font-semibold text-gray-900">{label}</span>
                    <span className="font-inter text-xs text-gray-400 ml-2">{item.key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {savedKey === item.key && (
                      <span className="font-inter text-xs text-green-600 font-medium">✓ Saved</span>
                    )}
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(item)}
                        className="font-inter text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {isEditing ? (
                    <div>
                      {multiLine ? (
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A] resize-y"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded text-sm font-inter focus:outline-none focus:border-[#C0623A]"
                        />
                      )}
                      <div className="flex gap-3 justify-end mt-3">
                        <button
                          onClick={() => setEditingKey(null)}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 font-inter text-xs rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(item.key)}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-[#C0623A] text-white font-inter text-xs font-medium rounded hover:bg-[#D4795A] disabled:opacity-60"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={`font-inter text-sm text-gray-700 ${multiLine ? 'whitespace-pre-line' : ''}`}>
                      {item.value || <span className="italic text-gray-400">Empty</span>}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
