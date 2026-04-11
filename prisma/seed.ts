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
    // Förrätter
    { name: 'Vitlöksbröd', description: 'Hemgjort bröd med vitlökssmör och örter', price: 129, category: 'Förrätter', order: 1 },
    { name: 'Bruschetta', description: 'Rostade bröd med tomat, basilika och mozzarella', price: 79, category: 'Förrätter', order: 2 },
    { name: 'Räksmörgås', description: 'Handskalade räkor på rostat bröd med dill och citron', price: 95, category: 'Förrätter', order: 3 },
    { name: 'Mozzarella Sticks', description: 'Friterade mozzarellastavar med marinara sås', price: 85, category: 'Förrätter', order: 4 },
    { name: 'Toast Skagen', description: 'Rostade bröd med handskalade räkor, majonnäs, dill och citron', price: 105, category: 'Förrätter', order: 5 },
    { name: 'Tapas', description: 'Blandat urval av smårätter och tilltugg', price: 89, category: 'Förrätter', order: 6 },

    // Plankor
    { name: 'Biff Planka', description: 'Grillad entrecôte med bearnaisesås, pommes frites och sallad', price: 189, category: 'Plankor', order: 1 },
    { name: 'Lax Planka', description: 'Grillad lax med hollandaisesås, kokt potatis och grönsaker', price: 169, category: 'Plankor', order: 2 },
    { name: 'Vegetarisk Planka', description: 'Grillad halloumi med tzatziki, rostade grönsaker och bulgur', price: 149, category: 'Plankor', order: 3 },
    { name: 'Kyckling Planka', description: 'Grillad kycklingfilé med curry-yoghurt, ris och grönsaker', price: 159, category: 'Plankor', order: 4 },
    { name: 'Fläsk Planka', description: 'Grillad fläskfilé med äppelchutney, hasselbackspotatis och rödvinssås', price: 179, category: 'Plankor', order: 5 },
    { name: 'Lamm Planka', description: 'Grillad lammfilé med rosmarin, klyftpotatis och rödvinssås', price: 199, category: 'Plankor', order: 6 },

    // Kebab
    { name: 'Kebab Tallrik', description: 'Kebabkött med pommes frites, sallad och valfri sås', price: 129, category: 'Kebab', order: 1 },
    { name: 'Kebabrulle', description: 'Kebabkött i tunnbröd med sallad och sås', price: 89, category: 'Kebab', order: 2 },
    { name: 'Kyckling Kebab', description: 'Marinerad kycklingkebab med ris, sallad och tzatziki', price: 135, category: 'Kebab', order: 3 },
    { name: 'Falafel Tallrik', description: 'Hemgjorda falafelbullar med hummus, sallad och pitabröd', price: 119, category: 'Kebab', order: 4 },
    { name: 'Mix Kebab', description: 'Blandning av kött- och kycklingkebab med pommes och sallad', price: 149, category: 'Kebab', order: 5 },
    { name: 'Kebab Pizza', description: 'Pizza med kebabkött, lök, tomat och kebabsås', price: 155, category: 'Kebab', order: 6 },

    // Sallader
    { name: 'Caesar Sallad', description: 'Romansallad, krutonger, parmesan och caesardressing', price: 109, category: 'Sallader', order: 1 },
    { name: 'Grekisk Sallad', description: 'Tomat, gurka, rödlök, oliver, fetaost och olivolja', price: 99, category: 'Sallader', order: 2 },
    { name: 'Kyckling Caesar', description: 'Caesar sallad med grillad kycklingfilé', price: 139, category: 'Sallader', order: 3 },
    { name: 'Räksallad', description: 'Handskalade räkor med avokado, tomat och dill', price: 149, category: 'Sallader', order: 4 },
    { name: 'Halloumi Sallad', description: 'Grillad halloumi med blandade gröna blad och balsamico', price: 129, category: 'Sallader', order: 5 },
    { name: 'Tonfisk Sallad', description: 'Färsk tonfisk med bönor, ägg och kapris', price: 159, category: 'Sallader', order: 6 },

    // Husmanskost
    { name: 'Köttbullar med potatismos', description: 'Hemgjorda köttbullar med potatismos, gräddsås och lingonsylt', price: 139, category: 'Husmanskost', order: 1 },
    { name: 'Pannbiff med lök', description: 'Pannbiff med stekt lök, kokt potatis och gräddsås', price: 149, category: 'Husmanskost', order: 2 },
    { name: 'Kalops', description: 'Klassisk kalops med kokt potatis och rödbetor', price: 155, category: 'Husmanskost', order: 3 },
    { name: 'Janssons frestelse', description: 'Potatisgratäng med ansjovis och grädde', price: 129, category: 'Husmanskost', order: 4 },
    { name: 'Wallenbergare', description: 'Kalvfärs med ärtor, morötter och kokt potatis', price: 169, category: 'Husmanskost', order: 5 },
    { name: 'Ärtsoppa med fläsk', description: 'Klassisk gul ärtsoppa med fläsk och pannkakor', price: 119, category: 'Husmanskost', order: 6 },
    { name: 'Fiskgratäng', description: 'Torsk i ugn med dill, räkor och potatismos', price: 159, category: 'Husmanskost', order: 7 },
    { name: 'Kött och potatis', description: 'Kokt nötkött med kokt potatis, rödbetor och pepparrotssås', price: 145, category: 'Husmanskost', order: 8 },

    // Pizza
    { name: 'Margherita', description: 'Klassisk pizza med tomatsås, mozzarella och basilika', price: 149, category: 'Pizzor', pizzaType: 'regular', order: 1 },
    { name: 'Vesuvio', description: 'Pizza med tomatsås, mozzarella och skinka', price: 159, category: 'Pizzor', pizzaType: 'regular', order: 2 },
    { name: 'Hawaii', description: 'Pizza med tomatsås, mozzarella, skinka och ananas', price: 159, category: 'Pizzor', pizzaType: 'regular', order: 3 },
    { name: 'Pepperoni', description: 'Pizza med tomatsås, mozzarella och pepperoni', price: 169, category: 'Pizzor', pizzaType: 'regular', order: 4 },
    { name: 'Flygande Jacob', description: 'Pizza med kyckling, banan, jordnötter och curry', price: 123, category: 'Pizzor', pizzaType: 'regular', order: 5 },
    { name: 'Kebabpizza', description: 'Pizza med kebabkött, lök, tomat och kebabsås', price: 135, category: 'Pizzor', pizzaType: 'regular', order: 6 },

    // Efterrätter
    { name: 'Chokladmousse', description: 'Krämig chokladmousse med vispad grädde', price: 75, category: 'Efterrätter', order: 1 },
    { name: 'Tiramisu', description: 'Klassisk italiensk tiramisu med kaffe och mascarpone', price: 85, category: 'Efterrätter', order: 2 },
    { name: 'Pannacotta', description: 'Vaniljpannacotta med färska bär', price: 79, category: 'Efterrätter', order: 3 },
    { name: 'Glass (3 kulor)', description: 'Vanilj, choklad eller jordgubb med vispad grädde', price: 65, category: 'Efterrätter', order: 4 },
    { name: 'Cheesecake', description: 'New York cheesecake med blåbärssylt', price: 89, category: 'Efterrätter', order: 5 },
  ]

  // Upsert menu items by name+category so admin additions survive redeployments
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name, category: item.category },
    })
    if (existing) {
      await prisma.menuItem.update({ where: { id: existing.id }, data: item })
    } else {
      await prisma.menuItem.create({ data: item })
    }
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

  // Only seed lunch days for current week if none exist yet
  const existingDays = await prisma.lunchDay.count({ where: { weekNumber: currentWeek, year: currentYear } })
  if (existingDays === 0) {
    for (const day of lunchDays) {
      await prisma.lunchDay.create({ data: day })
    }
  }

  // ── Weekly Soup ───────────────────────────────────────────────────────────
  const existingSoup = await prisma.weeklySoup.count({ where: { weekNumber: currentWeek, year: currentYear } })
  if (existingSoup === 0) {
    await prisma.weeklySoup.create({
      data: {
        weekNumber: currentWeek,
        year: currentYear,
        name: 'Tomatsoppa med bröd',
        description: 'Krämig tomatsoppa med örter, serveras med nybakat bröd och smör',
        price: 75,
      },
    })
  }

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

  // Upsert page content so admin edits on Railway are never overwritten
  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: { key: content.key },
      update: {},           // never overwrite existing values
      create: content,
    })
  }

  // ── Gallery Images ────────────────────────────────────────────────────────
  // Only seed gallery if empty
  const existingGallery = await prisma.galleryImage.count()
  if (existingGallery === 0) {
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
