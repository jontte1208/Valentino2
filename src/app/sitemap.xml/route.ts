export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/meny', priority: '0.9', changefreq: 'weekly' },
    { url: '/veckans-lunch', priority: '0.9', changefreq: 'weekly' },
    { url: '/boka-bord', priority: '0.8', changefreq: 'monthly' },
    { url: '/om-oss', priority: '0.7', changefreq: 'monthly' },
    { url: '/kontakt', priority: '0.7', changefreq: 'monthly' },
    { url: '/galleri', priority: '0.6', changefreq: 'monthly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
