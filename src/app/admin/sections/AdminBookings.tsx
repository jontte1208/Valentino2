'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  guests: number
  specialRequests: string | null
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) setBookings(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id)
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      loadBookings()
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteBooking(id: number) {
    if (!confirm('Delete this booking?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    loadBookings()
  }

  const filtered =
    filterStatus === 'all' ? bookings : bookings.filter((b) => b.status === filterStatus)

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-inter text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="font-inter text-sm text-gray-500 mt-1">Manage restaurant reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
            <div className={`font-inter text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="font-inter text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-full font-inter text-xs font-medium transition-colors capitalize ${
              filterStatus === status
                ? 'bg-[#C0623A] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#C0623A] hover:text-[#C0623A]'
            }`}
          >
            {status === 'all' ? 'All' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="font-inter text-gray-500 text-center py-12">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                  <th className="text-left px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="text-center px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Guests</th>
                  <th className="text-center px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 font-inter text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-inter text-sm font-medium text-gray-900">{booking.name}</div>
                      <div className="font-inter text-xs text-gray-500">{booking.email}</div>
                      <div className="font-inter text-xs text-gray-500">{booking.phone}</div>
                      {booking.specialRequests && (
                        <div className="font-inter text-xs text-[#C0623A] mt-1 italic">
                          Note: {booking.specialRequests}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-inter text-sm text-gray-900">{booking.date}</div>
                      <div className="font-inter text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-inter text-sm font-semibold text-gray-900">{booking.guests}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-inter text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                            className="font-inter text-xs text-green-600 hover:text-green-800 px-2 py-1 hover:bg-green-50 rounded transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                            className="font-inter text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="font-inter text-xs text-gray-400 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 font-inter text-gray-500 text-sm">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
