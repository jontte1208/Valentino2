import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Protects every /admin* route by verifying a valid NextAuth JWT.
 *
 * IMPORTANT: The previous matcher `/admin/:path*` did NOT match the bare
 * `/admin` route itself — only subpaths like `/admin/login`. That meant a
 * direct visit to `/admin` bypassed middleware entirely. The matcher below
 * explicitly includes both `/admin` and `/admin/*`.
 *
 * The login page is allow-listed so unauthenticated users can still see it.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public: the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Everything else under /admin requires a valid token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    // Preserve intended destination so the user lands back after login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Add security headers to every admin response
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

export const config = {
  // Match /admin itself AND everything under it.
  matcher: ['/admin', '/admin/:path*'],
}
