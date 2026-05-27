// One-shot: fyller siteSettings i Sanity med de defaults som koden använder
// som fallback på publika sidor. Kör med:  node scripts/seed-site-settings.mjs
//
// setIfMissing → redan ifyllda fält (telefon, adress, hero-titel) skrivs INTE över.
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'

// --- läs .env.local ---
function loadEnv(file) {
  const p = path.join(process.cwd(), file)
  if (!fs.existsSync(p)) return
  let buf = fs.readFileSync(p)
  if (buf[0] === 0xff && buf[1] === 0xfe) buf = Buffer.from(buf.toString('utf16le'))
  else if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) buf = buf.slice(3)
  for (const line of buf.toString('utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[k]) process.env[k] = v
  }
}
loadEnv('.env.local')
loadEnv('.env')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Saknar env: NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET / SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const defaults = {
  heroLabel: 'Pizzeria & Restaurang — Hörby, Skåne',
  heroTitle: 'Valentino',
  heroSubtitle: 'Pizzeria & Restaurang i hjärtat av Hörby',
  heroTagline:
    'Pizza, kebab, pasta och mycket mer — lagat med kärlek och de bästa råvarorna. Öppet alla dagar i veckan',
  footerTagline:
    'Pizzeria & Restaurang i Hörby, Skåne. Pizza, kebab, pasta och mer — öppet alla dagar i veckan.',
  facebookUrl: 'https://www.facebook.com/Restaurang.valentino/',
  // Tomt som default — sätt riktig URL i Studio när Instagram-konto finns.
  // (Tidigare pekade detta felaktigt på Facebook-URL:en.)
  instagramUrl: '',
  aboutTitle: 'En familjerestaurang med hjärta och historia',
  aboutText:
    'Pizzeria Valentino i Hörby serverar pizza, kebab och pasta med fokus på goda råvaror, generösa portioner och välkomnande gästvänlighet.',
  aboutStory:
    'Vi har varit en del av Hörbys vardag i många år — en plats där grannar, familjer och nya gäster möts över en nybakad pizza.',
  openingHours: [
    { _key: 'mon', day: 'Måndag', hours: '13:00–21:00' },
    { _key: 'tue', day: 'Tisdag', hours: '11:30–22:00' },
    { _key: 'wed', day: 'Onsdag', hours: '11:00–22:00' },
    { _key: 'thu', day: 'Torsdag', hours: '11:30–22:00' },
    { _key: 'fri', day: 'Fredag', hours: '11:30–22:00' },
    { _key: 'sat', day: 'Lördag', hours: '11:30–23:00' },
    { _key: 'sun', day: 'Söndag', hours: '12:00–23:00' },
  ],
  lunchHours: 'Tisdag–Fredag: 11:30–14:00',
  address: 'Nygatan 38, 242 31 Hörby, Skåne',
  phone: '0415-100 39',
  email: 'pizzeria-valentino@hotmail.com',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2271.3!2d13.6597595!3d55.850975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46542b3e3a3a3a3a%3A0x0!2sNygatan%2038%2C%20242%2031%20H%C3%B6rby!5e0!3m2!1ssv!2sse!4v1700000000000',
}

async function main() {
  // Säkerställ att dokumentet existerar
  const existing = await client.getDocument('siteSettings')
  if (!existing) {
    console.log('Skapar siteSettings-dokument...')
    await client.createIfNotExists({ _id: 'siteSettings', _type: 'siteSettings' })
  }

  console.log('Fyller på tomma fält...')
  const patch = client.patch('siteSettings').setIfMissing(defaults)
  const result = await patch.commit()
  console.log('✓ Klar. Sätt eller publicera i Studio:')
  console.log('  Title:', result.heroTitle)
  console.log('  Phone:', result.phone)
  console.log('  Days:', result.openingHours?.length, 'rows')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
