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
  // Real menu scraped from Restaurang Hörnan Valentino, Hörby
  const menuItems = [
    // ── Ordinarie Pizzor ──────────────────────────────────────────────────
    { name: '1. Milano', description: 'Tomat, ost, skinka', price: 120, category: 'Pizzor', order: 1 },
    { name: '2. Sicilia', description: 'Tomat, ost, champinjoner', price: 120, category: 'Pizzor', order: 2 },
    { name: '3. Tonno', description: 'Tomat, ost, tonfisk', price: 125, category: 'Pizzor', order: 3 },
    { name: '4. Palermo', description: 'Tomat, ost, köttfärs, lök', price: 125, category: 'Pizzor', order: 4 },
    { name: '5. Capricciosa', description: 'Tomat, ost, skinka, champinjoner', price: 125, category: 'Pizzor', order: 5 },
    { name: '6. Hawaii', description: 'Tomat, ost, skinka, ananas', price: 125, category: 'Pizzor', order: 6 },
    { name: '7. Catarina', description: 'Tomat, ost, räkor', price: 125, category: 'Pizzor', order: 7 },
    { name: '8. Calzone', description: 'Tomat, ost, skinka (inbakad)', price: 125, category: 'Pizzor', order: 8 },
    { name: '9. Bolognese', description: 'Tomat, ost, köttfärs (inbakad)', price: 125, category: 'Pizzor', order: 9 },
    { name: '10. Bari', description: 'Tomat, ost, salami', price: 125, category: 'Pizzor', order: 10 },
    { name: '11. Capri', description: 'Tomat, ost, skinka, räkor', price: 125, category: 'Pizzor', order: 11 },
    { name: '12. Sorvento', description: 'Tomat, ost, räkor, musslor', price: 130, category: 'Pizzor', order: 12 },
    { name: '13. Amigo', description: 'Tomat, ost, köttfärs, champinjoner, paprika', price: 130, category: 'Pizzor', order: 13 },
    { name: '14. Corallo', description: 'Tomat, ost, bacon, lök, paprika', price: 130, category: 'Pizzor', order: 14 },
    { name: '15. Roma', description: 'Tomat, ost, räkor, tonfisk', price: 130, category: 'Pizzor', order: 15 },
    { name: '16. Blecko', description: 'Tomat, ost, champinjoner, räkor', price: 130, category: 'Pizzor', order: 16 },
    { name: '17. Jamaica', description: 'Tomat, ost, skinka, räkor, champinjoner', price: 130, category: 'Pizzor', order: 17 },
    { name: '18. Le Marre', description: 'Tomat, ost, räkor, krabbstick', price: 130, category: 'Pizzor', order: 18 },
    { name: '19. Quattro Stagioni', description: 'Tomat, ost, skinka, champinjoner, räkor, musslor, kronärtskocka', price: 130, category: 'Pizzor', order: 19 },
    { name: '20. Vegetaria', description: 'Tomat, ost, champinjoner, lök, paprika, ananas, kronärtskocka', price: 130, category: 'Pizzor', order: 20 },

    // ── Special Pizzor ────────────────────────────────────────────────────
    { name: '21. Disco', description: 'Tomat, ost, skinka, köttfärs, räkor', price: 130, category: 'Special Pizzor', order: 1 },
    { name: '22. Levande Livet', description: 'Tomat, ost, skinka, ananas, banan', price: 130, category: 'Special Pizzor', order: 2 },
    { name: '23. Altono', description: 'Tomat, ost, skinka, räkor, krabbstick (inbakad)', price: 130, category: 'Special Pizzor', order: 3 },
    { name: '24. Emilia', description: 'Tomat, ost, skinka, räkor, champinjoner, tonfisk', price: 130, category: 'Special Pizzor', order: 4 },
    { name: '25. Sussie', description: 'Tomat, ost, champinjoner, lök, ägg, fläskfilé, kryddor', price: 130, category: 'Special Pizzor', order: 5 },
    { name: '26. Elisabet', description: 'Tomat, ost, paprika, lök, fläskfilé, färska tomater, kryddor', price: 130, category: 'Special Pizzor', order: 6 },
    { name: '27. Ciao Ciao', description: 'Tomat, ost, champinjoner, lök, vitlök, fläskfilé (inbakad)', price: 130, category: 'Special Pizzor', order: 7 },
    { name: '28. Dino', description: 'Tomat, ost, oxfilé, lök, bearnaisesås (inbakad)', price: 130, category: 'Special Pizzor', order: 8 },
    { name: '29. Donna Grazia', description: 'Tomat, ost, champinjoner, oxfilé, lök, bearnaisesås', price: 130, category: 'Special Pizzor', order: 9 },
    { name: '30. Opera', description: 'Tomat, ost, champinjoner, bacon, salami, lök', price: 130, category: 'Special Pizzor', order: 10 },
    { name: '31. Indiana', description: 'Tomat, ost, kyckling, banan, räkor, champinjoner', price: 130, category: 'Special Pizzor', order: 11 },
    { name: '32. Mexicana', description: 'Tomat, ost, köttfärs, färsk paprika, lök (het)', price: 130, category: 'Special Pizzor', order: 12 },
    { name: '33. Tropicana', description: 'Tomat, ost, skinka, fläskfilé, räkor, banan', price: 130, category: 'Special Pizzor', order: 13 },
    { name: '34. Provencale', description: 'Tomat, ost, champinjoner, oxfilé, paprika', price: 130, category: 'Special Pizzor', order: 14 },
    { name: '35. Jackpott', description: 'Tomat, ost, skinka, champinjoner, oxfilé, lök', price: 130, category: 'Special Pizzor', order: 15 },
    { name: '36. Shazam', description: 'Tomat, ost, champinjoner, räkor, gorgonzolaost', price: 130, category: 'Special Pizzor', order: 16 },
    { name: '37. Husets Pizza', description: 'Tomat, ost, oxfilé, gorgonzolaost', price: 130, category: 'Special Pizzor', order: 17 },
    { name: '38. M.A.I', description: 'Tomat, ost, skinka, lök, kebabkött, kebabsås', price: 130, category: 'Special Pizzor', order: 18 },
    { name: '39. Eli', description: 'Tomat, ost, champinjoner, lök, kebabkött, bearnaisesås, peperoni', price: 130, category: 'Special Pizzor', order: 19 },
    { name: '40. Poker', description: 'Tomat, ost, champinjoner, oxfilé, fläskfilé, bearnaisesås', price: 130, category: 'Special Pizzor', order: 20 },
    { name: '41. Valentino', description: 'Tomat, ost, skinka, champinjoner, lök, fläskfilé, bearnaisesås', price: 130, category: 'Special Pizzor', order: 21 },

    // ── Taco Pizzor ───────────────────────────────────────────────────────
    { name: 'Acapulco', description: 'Tomat, ost, oxfilé, champinjoner, vitlök, jalapeño, tacokryddor (het)', price: 130, category: 'Taco Pizzor', order: 1 },
    { name: 'Don Pedro', description: 'Tomat, ost, skinka, köttfärs, lök, vitlök, jalapeño, tacokryddor (het)', price: 130, category: 'Taco Pizzor', order: 2 },
    { name: 'El Paso', description: 'Tomat, ost, fläskfilé, champinjoner, lök, tacokrydda, jalapeño, kebabsås (het)', price: 130, category: 'Taco Pizzor', order: 3 },
    { name: 'Gringo', description: 'Tomat, ost, champinjoner, lök, jalapeño, tacokrydda, kebabkött, kebabsås', price: 130, category: 'Taco Pizzor', order: 4 },

    // ── Italiensk Pizza ───────────────────────────────────────────────────
    { name: 'Parma Special', description: 'Tomat, ost, mozzarella, färska champinjoner, lufttorkad skinka, lök', price: 140, category: 'Italiensk Pizza', order: 1 },
    { name: 'Aten Special', description: 'Tomat, ost, mozzarella, färska champinjoner, salladsost, svarta oliver', price: 140, category: 'Italiensk Pizza', order: 2 },
    { name: 'Pisa Special', description: 'Tomat, ost, mozzarella, färska champinjoner, salami, lök', price: 140, category: 'Italiensk Pizza', order: 3 },
    { name: 'Tigris', description: 'Tomat, ost, mozzarella, färska champinjoner, lufttorkad skinka, ruccolasallad', price: 140, category: 'Italiensk Pizza', order: 4 },
    { name: '4 Ostar', description: 'Ost, salladsost, gorgonzolaost, mozzarella', price: 140, category: 'Italiensk Pizza', order: 5 },

    // ── Kycklingpizzor ────────────────────────────────────────────────────
    { name: 'Kycklingpizza', description: 'Tomat, lök, kyckling, sås', price: 130, category: 'Kycklingpizzor', order: 1 },
    { name: '50/50', description: 'Kyckling, kebabkött, kebabsås, färska tomater', price: 130, category: 'Kycklingpizzor', order: 2 },
    { name: 'Hörnans Kebabpizza', description: 'Kebabkött, isbergsallad, tomat, gurka, lök, peperoni, mild dressing', price: 95, category: 'Kycklingpizzor', order: 3 },

    // ── Sallader ──────────────────────────────────────────────────────────
    { name: 'Amerikansk sallad', description: 'Sallad, tomat, gurka, majs, skinka, ost, ananas, ägg', price: 130, category: 'Sallader', order: 1 },
    { name: 'Hawaiisallad', description: 'Sallad, tomat, gurka, kyckling, banan, paprika, ananas', price: 130, category: 'Sallader', order: 2 },
    { name: 'Räksallad', description: 'Sallad, tomat, gurka, majs, paprika, räkor, ägg', price: 130, category: 'Sallader', order: 3 },
    { name: 'Tonfisksallad', description: 'Sallad, tomat, gurka, lök, majs, tonfisk, oliver', price: 130, category: 'Sallader', order: 4 },
    { name: 'Grekisk sallad', description: 'Sallad, tomat, gurka, lök, paprika, oliver, salladsost', price: 130, category: 'Sallader', order: 5 },
    { name: 'Västkustsallad', description: 'Sallad, tomat, gurka, champinjoner, musslor, räkor', price: 130, category: 'Sallader', order: 6 },
    { name: 'Kycklingsallad', description: 'Sallad, tomat, gurka, majs, paprika, kyckling, ananas', price: 130, category: 'Sallader', order: 7 },

    // ── Kebab ─────────────────────────────────────────────────────────────
    { name: 'Kebab med bröd (liten)', description: 'Kebabkött med nötkött i tunnbröd med sallad och sås', price: 120, category: 'Kebab', order: 1 },
    { name: 'Kebab med bröd (stor)', description: 'Stor kebab med nötkött i tunnbröd med sallad och sås', price: 130, category: 'Kebab', order: 2 },
    { name: 'Kebab med ris', description: 'Kebabkött serverat med ris, sallad och sås', price: 130, category: 'Kebab', order: 3 },
    { name: 'Kebab hawaii', description: 'Kebabkött med ananas, sallad och sås', price: 130, category: 'Kebab', order: 4 },
    { name: 'Kebab tallrik', description: 'Kebabkött med pommes frites, sallad och sås', price: 130, category: 'Kebab', order: 5 },
    { name: 'Kebab special', description: 'Kebabkött med pommes, sallad, tomat, lök och sås', price: 130, category: 'Kebab', order: 6 },
    { name: 'Kebab rulle', description: 'Kebabkött i tunnbröd med sallad, tomat, lök och sås', price: 130, category: 'Kebab', order: 7 },

    // ── Falafel ───────────────────────────────────────────────────────────
    { name: 'Falafel med pommes', description: 'Hemlagad falafel serverad med pommes frites', price: 125, category: 'Falafel', order: 1 },
    { name: 'Falafel med sallad', description: 'Hemlagad falafel serverad med sallad', price: 125, category: 'Falafel', order: 2 },
    { name: 'Falafel med bröd', description: 'Hemlagad falafel i tunnbröd med sallad och sås', price: 125, category: 'Falafel', order: 3 },
    { name: 'Falafel rulle', description: 'Hemlagad falafel i tunnbrödsrulle med sallad och sås', price: 125, category: 'Falafel', order: 4 },
    { name: 'Falafel med ris', description: 'Hemlagad falafel serverad med ris och sallad', price: 125, category: 'Falafel', order: 5 },

    // ── Hamburgare ────────────────────────────────────────────────────────
    { name: 'Hörnans Hemlagade Burger', description: 'Grillad burgare 200g med cheddar & bacon, dillgurka, tomat, lök & majonnäs, serveras med pommes', price: 145, category: 'Hamburgare', order: 1 },

    // ── À la Carte ────────────────────────────────────────────────────────
    { name: 'Gambas', description: 'Räkor i vitlök, chili & citron, serveras med bröd', price: 99, category: 'À la Carte', order: 1 },
    { name: 'Fettuccine al filetto', description: 'Färsk fettuccine med oxfilé, krämig svampsås, färskriven parmesan', price: 135, category: 'À la Carte', order: 2 },
    { name: 'Löjromspizza', description: 'Löjrom, mozzarella, crème fraîche, gräslök, rödlök, dill', price: 139, category: 'À la Carte', order: 3 },
    { name: 'Hörnans Grillmix', description: 'Oxfilé, fläskfilé, kycklingfilé, kryddkorv & grillgrönsaker, bearnaisesås', price: 195, category: 'À la Carte', order: 4 },

    // ── Drycker ───────────────────────────────────────────────────────────
    { name: 'Läsk burk 33cl', description: 'Coca-Cola, Fanta, Sprite eller annan läsk', price: 23, category: 'Drycker', order: 1 },
    { name: 'Läsk PET 50cl', description: 'Coca-Cola, Fanta, Sprite eller annan läsk', price: 28, category: 'Drycker', order: 2 },
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
  // Only seed lunch days for current week if none exist yet
  // Admin should update these weekly via the admin panel or Facebook
  const lunchDays = [
    { weekNumber: currentWeek, year: currentYear, dayOfWeek: 'tuesday', dishName: 'Capricciosa', description: 'Pizza med tomatsås, ost, skinka och champinjoner. Serveras med sallad', price: 99 },
    { weekNumber: currentWeek, year: currentYear, dayOfWeek: 'wednesday', dishName: 'Kebabpizza', description: 'Pizza med kebabkött, lök, tomat och sås. Serveras med sallad', price: 99 },
    { weekNumber: currentWeek, year: currentYear, dayOfWeek: 'thursday', dishName: 'Hawaii', description: 'Pizza med tomatsås, ost, skinka och ananas. Serveras med sallad', price: 99 },
    { weekNumber: currentWeek, year: currentYear, dayOfWeek: 'friday', dishName: 'Räksallad', description: 'Sallad med räkor, tomat, gurka, majs och paprika', price: 99 },
  ]

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
      value: 'Måndag: 13:00–21:00\nTisdag: 11:30–22:00\nOnsdag: 11:00–22:00\nTorsdag: 11:30–22:00\nFredag: 11:30–22:00\nLördag: 11:30–23:00\nSöndag: 12:00–23:00',
    },
    { key: 'lunch_hours', value: 'Tisdag–Fredag: 11:30–14:00' },
    {
      key: 'meta_description',
      value: 'Restaurang Hörnan Valentino — Pizzeria & Restaurang i Hörby, Skåne. Pizza, kebab, sallader och mer. Öppet alla dagar. Nygatan 38, 242 31 Hörby. Tel: 0415-100 39.',
    },
  ]

  // Upsert page content so admin edits on Railway are never overwritten
  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: { key: content.key },
      update: {},
      create: content,
    })
  }

  // ── Gallery Images ────────────────────────────────────────────────────────
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

  console.log('✅ Seed completed — Valentino Hörby real menu loaded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
