// Resolve the canonical public URL for the site. Used by robots.txt,
// sitemap.xml, metadataBase and JSON-LD.
//
// Priority:
//   1. NEXT_PUBLIC_SITE_URL  — explicit production URL (recommended)
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's prod alias
//   3. VERCEL_URL            — current deployment preview URL
//   4. http://localhost:3000 — local dev fallback
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return stripTrailingSlash(explicit)

  const prodAlias = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (prodAlias) return `https://${stripTrailingSlash(prodAlias)}`

  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${stripTrailingSlash(vercel)}`

  return 'http://localhost:3000'
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '')
}
