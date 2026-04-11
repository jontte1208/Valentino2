import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

async function main() {
  const currentWeek = getISOWeekNumber()
  const currentYear = new Date().getFullYear()

  // ── Menu Items ────────────────────────────────────────────────────────────
  const menuItems = [
    // Vanliga pizzor
    {
      name: 'Margherita',
      description: 'Tomatsås, ost',
      price: 80,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 1,
    },
    {
      name: 'Capricciosa',
      description: 'Tomatsås, ost, skinka, champinjoner',
      price: 90,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 2,
    },
    {
      name: 'Hawaii',
      description: 'Tomatsås, ost, skinka, ananas',
      price: 90,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 3,
    },
    {
      name: 'Vesuvio',
      description: 'Tomatsås, ost, skinka, ägg',
      price: 90,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 4,
    },
    {
      name: 'Kebabpizza',
      description: 'Tomatsås, ost, kebab, lök, paprika',
      price: 100,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 5,
    },
    {
      name: 'Napolitana',
      description: 'Tomatsås, ost, ansjovis, kapris, oliver',
      price: 90,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 6,
    },
    {
      name: 'Quattro Stagioni',
      description: 'Tomatsås, ost, skinka, champinjoner, räkor, musslor',
      price: 105,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 7,
    },
    {
      name: 'Tonfiskpizza',
      description: 'Tomatsås, ost, tonfisk, lök, paprika',
      price: 95,
      category: 'Pizzor',
      pizzaType: 'regular',
      order: 8,
    },
    // Familjepizzor
    {
      name: 'Familjen Valentino',
      description: 'Stor familjepizza med tomatsås, ost, skinka, champinjoner och paprika. Räcker till 3–4 personer',
      price: 200,
      category: 'Pizzor',
      pizzaType: 'family',
      order: 9,
    },
    {
      name: 'Stor Kebabpizza',
      description: 'Stor familjepizza med tomatsås, ost, kebab, lök, paprika och tomat',
      price: 210,
      category: 'Pizzor',
      pizzaType: 'family',
      order: 10,
    },
    // Kebab
    {
      name: 'Kebab på bröd',
      description: 'Grillad kebab på bröd med sallad, tomat, lök och dressing',
      price: 95,
      category: 'Kebab',
      order: 1,
    },
    {
      name: 'Kycklingkebab på bröd',
      description: 'Grillad kycklingkebab på bröd med sallad, tomat, lök och dressing',
      price: 95,
      category: 'Kebab',
      order: 2,
    },
    {
      name: 'Kebab på tallrik',
      description: 'Grillad kebab serverad med ris, sallad, tomat och dressing',
      price: 115,
      category: 'Kebab',
      order: 3,
    },
    {
      name: 'Gyros på bröd',
      description: 'Grillat griskött på bröd med sallad, tomat, lök och tzatziki',
      price: 95,
      category: 'Kebab',
      order: 4,
    },
    // Pasta
    {
      name: 'Pasta Bolognese',
      description: 'Pasta med klassisk köttfärssås och riven parmesan',
      price: 110,
      category: 'Pasta',
      order: 1,
    },
    {
      name: 'Pasta Carbonara',
      description: 'Pasta med gräddsås, bacon och riven parmesan',
      price: 115,
      category: 'Pasta',
      order: 2,
    },
    {
      name: 'Pasta med Kycklinggryta',
      description: 'Pasta med krämig kycklinggryta i gräddsås',
      price: 120,
      category: 'Pasta',
      order: 3,
    },
    // Sallader
    {
      name: 'Husallad',
      description: 'Sallad, tomat, gurka, lök, oliver, dressing',
      price: 95,
      category: 'Sallader',
      order: 1,
    },
    {
      name: 'Kebabsallad',
      description: 'Sallad med kebab, tomat, lök, paprika och dressing',
      price: 115,
      category: 'Sallader',
      order: 2,
    },
    // Hamburgare
    {
      name: 'Classic Burger',
      description: 'Nötfärsbiff med sallad, tomat, lök och dressing. Serveras med pommes',
      price: 105,
      category: 'Hamburgare',
      order: 1,
    },
    {
      name: 'Kycklingburger',
      description: 'Stekt kycklingfilé med sallad, tomat, lök och dressing. Serveras med pommes',
      price: 105,
      category: 'Hamburgare',
      order: 2,
    },
    // Drycker
    {
      name: 'Läsk',
      description: 'Coca-Cola, Fanta eller Sprite 33cl',
      price: 25,
      category: 'Drycker',
      order: 1,
    },
    {
      name: 'Mineralvatten',
      description: 'Loka eller Ramlösa 50cl',
      price: 20,
      category: 'Drycker',
      order: 2,
    },
    {
      name: 'Juice',
      description: 'Apelsin- eller äppeljuice 25cl',
      price: 25,
      category: 'Drycker',
      order: 3,
    },
    {
      name: 'Kaffe',
      description: 'Bryggkaffe',
      price: 20,
      category: 'Drycker',
      order: 4,
    },
    {
      name: 'Latte',
      description: 'Kaffe med mjölk',
      price: 35,
      category: 'Drycker',
      order: 5,
    },
  ]

  await prisma.menuItem.deleteMany()
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }

  // ── Lunch Days ────────────────────────────────────────────────────────────
  const lunchDays = [
    {
      weekNumber: currentWeek,
      year: currentYear,
      dayOfWeek: 'monday',
      dishName: 'Pasta Bolognese',
      description: 'Pasta med klassisk köttfärssås och riven parmesan. Serveras med sallad och bröd',
      price: 99,
    },
    {
      weekNumber: currentWeek,
      year: currentYear,
      dayOfWeek: 'tuesday',
      dishName: 'Kycklinggryta med ris',
      description: 'Krämig kycklinggryta med paprika och lök, serveras med ris och sallad',
      price: 99,
    },
    {
      weekNumber: currentWeek,
      year: currentYear,
      dayOfWeek: 'wednesday',
      dishName: 'Capricciosa',
      description: 'Pizza med tomatsås, ost, skinka och champinjoner. Serveras med sallad',
      price: 99,
    },
    {
      weekNumber: currentWeek,
      year: currentYear,
      dayOfWeek: 'thursday',
      dishName: 'Pasta Carbonara',
      description: 'Pasta med gräddsås, bacon och parmesan. Serveras med sallad och bröd',
      price: 99,
    },
    {
      weekNumber: currentWeek,
      year: currentYear,
      dayOfWeek: 'friday',
      dishName: 'Kebabpizza',
      description: 'Pizza med tomatsås, ost, kebab, lök och paprika. Serveras med sallad',
      price: 99,
    },
  ]

  await prisma.lunchDay.deleteMany()
  for (const day of lunchDays) {
    await prisma.lunchDay.create({ data: day })
  }

  // ── Weekly Soup ───────────────────────────────────────────────────────────
  await prisma.weeklySoup.deleteMany()
  await prisma.weeklySoup.create({
    data: {
      weekNumber: currentWeek,
      year: currentYear,
      name: 'Tomatsoppa med bröd',
      description: 'Krämig tomatsoppa med örter, serveras med nybakat bröd och smör',
      price: 75,
    },
  })

  // ── Page Content ──────────────────────────────────────────────────────────
  const pageContents = [
    { key: 'hero_title', value: 'Valentino' },
    { key: 'hero_subtitle', value: 'Pizzeria & Restaurang i hjärtat av Hörby' },
    { key: 'hero_tagline', value: 'Välkommen till Hörby mest omtyckta restaurang' },
    {
      key: 'welcome_text',
      value:
        'Välkommen till Restaurang Hörnan Valentino — Hörbys mest omtyckta matställe för à la carte. Vi serverar handgjorda pizzor, kebab, pasta och mycket mer med kärlek och de bästa råvarorna. Hos oss hittar du en varm och familjär atmosfär som passar både en snabb lunch och en festlig middag. Öppet alla dagar i veckan!',
    },
    {
      key: 'about_text',
      value:
        'Restaurang Hörnan Valentino har länge varit ett självklart val för Hörbyborna. Beläget på Nygatan 38 i centrala Hörby, Skåne, har vi gjort oss kända för våra vällagade pizzor, smakrika kebabmaträtter och generösa portioner. Vi är stolta över att vara rankade som #5 av 34 restauranger i Hörby och kallade "lätt byns bästa matställe" av våra gäster.',
    },
    {
      key: 'about_story',
      value:
        'Hos oss är alla välkomna — familjer, kompisgäng och affärsmiddagar. Vi erbjuder avhämtning, bordsbeställning och uteservering under sommaren. Vår personal är välutbildad och servicen är alltid snabb och vänlig. Vi tar emot betalkort och är anpassade för rörelsehindrade.',
    },
    { key: 'address', value: 'Nygatan 38, 242 31 Hörby' },
    { key: 'phone', value: '0415-100 39' },
    { key: 'email', value: 'pizzeria-valentino@hotmail.com' },
    {
      key: 'opening_hours',
      value: 'Måndag: 11:30–22:00\nTisdag: 11:00–22:00\nOnsdag: 11:30–22:00\nTorsdag: 11:30–22:00\nFredag: 11:30–23:00\nLördag: 12:00–23:00\nSöndag: 13:00–21:00',
    },
    { key: 'lunch_hours', value: 'Måndag–Fredag: 11:00–14:30' },
    {
      key: 'meta_description',
      value: 'Restaurang Hörnan Valentino — Pizzeria & Restaurang i Hörby, Skåne. Pizza, kebab, pasta och mer. Öppet alla dagar. Nygatan 38, 242 31 Hörby. Tel: 0415-100 39.',
    },
  ]

  await prisma.pageContent.deleteMany()
  for (const content of pageContents) {
    await prisma.pageContent.create({ data: content })
  }

  // ── Gallery Images ────────────────────────────────────────────────────────
  await prisma.galleryImage.deleteMany()
  const galleryImages = [
    { filename: 'restaurant-interior.jpg', alt: 'Restaurangens mysiga interiör', order: 1 },
    { filename: 'pizza-fresh.jpg', alt: 'Nybakad pizza från ugnen', order: 2 },
    { filename: 'kebab-plate.jpg', alt: 'Kebab på tallrik med tillbehör', order: 3 },
    { filename: 'outdoor-seating.jpg', alt: 'Uteservering sommartid', order: 4 },
    { filename: 'pasta-dish.jpg', alt: 'Krämig pasta serverad varm', order: 5 },
    { filename: 'family-dining.jpg', alt: 'Familj som njuter av maten', order: 6 },
  ]
  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img })
  }

  console.log('✅ Seed completed — Valentino Hörby real data loaded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
