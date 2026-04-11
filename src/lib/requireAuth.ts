import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NEXTAUTH_SECRET } from './auth'

/**
 * Verifies that the incoming request carries a valid NextAuth JWT.
 * Returns null if authenticated, or a 401 NextResponse if not.
 *
 * Usage:
 *   const unauth = await requireAuth(request)
 *   if (unauth) return unauth
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = await getToken({
    req: request,
    secret: NEXTAUTH_SECRET,
    // Auto-detects cookie name based on NEXTAUTH_URL (https → __Secure- prefix)
  })
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
