/** @type {import('next').NextConfig} */

// Content Security Policy — Next.js App Router uses inline scripts for
// hydration. Sanity Studio embeds at /studio and needs sanity.io origins.
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https:",
  "media-src 'self' blob: data: https://cdn.sanity.io",
  "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self' blob:",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Skip CSP on /studio — Sanity Studio needs blob: workers and its own origins.
        // We still apply other security headers there.
        source: '/((?!studio).*)',
        headers: securityHeaders,
      },
      {
        source: '/studio/:path*',
        headers: securityHeaders.filter((h) => h.key !== 'Content-Security-Policy' && h.key !== 'X-Frame-Options'),
      },
    ]
  },
}

export default nextConfig
