'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Felaktigt användarnamn eller lösenord')
    } else {
      router.push('/admin')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-[#FAF4EB]">Valentino</h1>
          <p className="font-inter text-sm text-[#FAF4EB]/50 mt-2">Admin Panel</p>
        </div>

        <div className="bg-[#FAF4EB] rounded-2xl p-8 shadow-2xl">
          <h2 className="font-inter text-xl font-semibold text-[#1C1C1C] mb-6">Sign in</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
              <p className="font-inter text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
              />
            </div>
            <div>
              <label className="block font-inter text-sm font-medium text-[#1C1C1C] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-[#E8DDD0] rounded-lg font-inter text-sm focus:outline-none focus:border-[#C0623A] focus:ring-1 focus:ring-[#C0623A] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C0623A] text-white font-inter font-semibold rounded-lg hover:bg-[#D4795A] disabled:opacity-60 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
