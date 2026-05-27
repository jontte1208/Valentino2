import { getSiteUrl } from '@/lib/siteUrl'

export function GET() {
  const baseUrl = getSiteUrl()

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /studio',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
