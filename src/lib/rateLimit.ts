/**
 * Simple in-memory rate limiter.
 *
 * NOTE: This is per-process memory. It works for a single Railway instance
 * but resets on deploy/restart and does not share state across multiple
 * instances. For a small restaurant admin panel with a single admin, this
 * is acceptable. For a multi-instance deployment, replace with Redis/Upstash.
 */

interface Entry {
  count: number
  firstAttemptAt: number
  lockedUntil: number
}

const store = new Map<string, Entry>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // Sweep occasionally to prevent unbounded growth
  if (store.size > 1000) {
    store.forEach((v, k) => {
      if (now - v.firstAttemptAt > WINDOW_MS && v.lockedUntil < now) {
        store.delete(k)
      }
    })
  }

  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 }
  }

  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    }
  }

  // Window expired — reset
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    }
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count - 1,
    retryAfterSeconds: 0,
  }
}

export function recordFailure(key: string): void {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    store.set(key, { count: 1, firstAttemptAt: now, lockedUntil: 0 })
    return
  }

  const count = entry.count + 1
  const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0
  store.set(key, { ...entry, count, lockedUntil })
}

export function recordSuccess(key: string): void {
  store.delete(key)
}
