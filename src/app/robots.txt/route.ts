export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: http://localhost:3000/sitemap.xml`,
    {
      headers: { 'Content-Type': 'text/plain' },
    }
  )
}
