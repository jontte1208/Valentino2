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

  // ── Menu Items — Real menu from Restaurang Hörnan Valentino Facebook ──────
  const menuItems = [

    // ── Förrätter ────────────────────────────────────────────────────────────
    { name: 'Hörnans Starter', description: 'Hot wings, jalapeno poppers, mozzarellasticks, lökringar — 3 av varje, serveras med aioli', price: 99, category: 'Förrätter', order: 1 },
    { name: 'Toast Skagen', description: 'Skagenröra på rostat bröd med citron & dill', price: 90, category: 'Förrätter', order: 2 },
    { name: "Pane All'Aglio", description: 'Ostgratinerad vitlöksbröd med tzatziki', price: 85, category: 'Förrätter', order: 3 },

    // ── Plankor ──────────────────────────────────────────────────────────────
    { name: 'Hörnans Klassiska Oxfilé', description: 'Med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 289, category: 'Plankor', order: 1 },
    { name: 'Fläskfilé Planka', description: 'Med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 269, category: 'Plankor', order: 2 },
    { name: 'Black and White Planka', description: 'Oxfilé och fläskfilé med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 279, category: 'Plankor', order: 3 },
    { name: 'Kycklingfilé Planka', description: 'Med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 269, category: 'Plankor', order: 4 },
    { name: 'Fjordlax Planka', description: 'Med duchesse, griljerad sparris, griljerad tomat, vitvinssås, citron och handskalade räkor', price: 279, category: 'Plankor', order: 5 },
    { name: 'Hörnans Klassiska Mix Planka', description: 'Oxfilé, fläskfilé och kycklingfilé med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 295, category: 'Plankor', order: 6 },
    { name: "Ryggbiff med Kappa 'Planka'", description: 'Med duchesse, baconlindad sparris, griljerad tomat, stekt svamp, lökringar, rödvinssås och bearnaisesås', price: 299, category: 'Plankor', order: 7 },

    // ── Varmrätter ───────────────────────────────────────────────────────────
    { name: 'Oxfilé Tournedos', description: 'Serveras med wokade grönsaker, grillad sparris, valfri potatis, grönpepparsås och rödvinssås', price: 289, category: 'Varmrätter', order: 1 },
    { name: 'Fläskfilé', description: 'Serveras med wokade grönsaker, grönpepparsås, aioli & valfri potatis', price: 269, category: 'Varmrätter', order: 2 },
    { name: 'Black & White', description: 'Grillad oxfilé med rödvinssås, fläskfilé med bearnaisesås, wokade grönsaker & valfri potatis', price: 279, category: 'Varmrätter', order: 3 },
    { name: 'Vitlöksmarinerad Kycklingfilé', description: 'Serveras med wokade grönsaker, valfri potatis och grönpepparsås', price: 269, category: 'Varmrätter', order: 4 },
    { name: 'Hörnans Grillade Burgare', description: 'Serveras med bacon, cheddarost, sallad, tomat, picklad rödlök, saltgurka, hamburgardressing, pommes', price: 159, category: 'Varmrätter', order: 5 },
    { name: 'Hörnans Klassiska Schnitzel', description: 'Serveras med citron/anjovis/kapris, rödvinssås och bearnaisesås. Valfri potatis', price: 185, category: 'Varmrätter', order: 6 },
    { name: 'Fjordlax', description: 'Serveras med frästa grönsaker, vitvinssås & citron. Valfri potatis', price: 279, category: 'Varmrätter', order: 7 },
    { name: 'Fish and Chips', description: 'Serveras med pommes, remoulade och grillad citron', price: 189, category: 'Varmrätter', order: 8 },
    { name: 'Baby Back Ribbs', description: 'Serveras med wokade grönsaker och bbq-sås. Valfri potatis', price: 259, category: 'Varmrätter', order: 9 },
    { name: 'Hängmörad Black Angus Ryggbiff med Kappa', description: 'Serveras med wokade grönsaker, rödvinssås, bearnaisesås och lökringar. Valfri potatis', price: 299, category: 'Varmrätter', order: 10 },
    { name: 'Panerad Spätta', description: 'Serveras med wokade grönsaker, citron, remouladsås. Valfri potatis', price: 185, category: 'Varmrätter', order: 11 },

    // ── Barn Meny ────────────────────────────────────────────────────────────
    { name: 'Pasta med köttfärssås', description: 'Klassisk pasta med köttfärssås', price: 99, category: 'Barn Meny', order: 1 },
    { name: 'Liten hamburgare', description: 'Med bröd och pommes frites', price: 75, category: 'Barn Meny', order: 2 },
    { name: 'Köttbullar', description: 'Med lingonsylt och potatismos', price: 99, category: 'Barn Meny', order: 3 },
    { name: 'Chicken nuggets', description: 'Med pommes frites och bearnaisesås', price: 89, category: 'Barn Meny', order: 4 },
    { name: 'Fish & Chips (barn)', description: 'Med pommes och remoulade sås', price: 99, category: 'Barn Meny', order: 5 },

    // ── Pasta ────────────────────────────────────────────────────────────────
    { name: 'Pasta med Oxfilé', description: 'Serveras med oxfilé och färsk svamp i gräddsås, riven parmesan', price: 189, category: 'Pasta', order: 1 },
    { name: 'Pasta med Lax', description: 'Serveras med lax och broccoli i gräddsås, riven parmesan', price: 180, category: 'Pasta', order: 2 },
    { name: 'Pasta med Köttfärs', description: 'Serveras med köttfärssås, riven parmesan', price: 175, category: 'Pasta', order: 3 },

    // ── Pizzor (Vanliga) ─────────────────────────────────────────────────────
    { name: 'Margerita', description: 'Tomatsås, ost', price: 115, category: 'Pizzor', order: 1 },
    { name: 'Funghi', description: 'Tomatsås, ost, champinjoner', price: 120, category: 'Pizzor', order: 2 },
    { name: 'Vesuvio', description: 'Tomatsås, ost, skinka', price: 120, category: 'Pizzor', order: 3 },
    { name: 'Alfrona', description: 'Tomatsås, ost, skinka, tonfisk', price: 125, category: 'Pizzor', order: 4 },
    { name: 'Boscaiola', description: 'Tomatsås, ost, lök, salami', price: 125, category: 'Pizzor', order: 5 },
    { name: 'Caruso', description: 'Tomatsås, ost, köttfärssås, vitlök', price: 125, category: 'Pizzor', order: 6 },
    { name: 'Capricciosa', description: 'Tomatsås, ost, skinka, champinjoner', price: 125, category: 'Pizzor', order: 7 },
    { name: 'Veneziana', description: 'Tomatsås, ost, tonfisk, lök', price: 125, category: 'Pizzor', order: 8 },
    { name: 'Francescana', description: 'Tomatsås, ost, skinka, räkor', price: 130, category: 'Pizzor', order: 9 },
    { name: 'Carbonara', description: 'Tomatsås, ost, bacon, lök', price: 130, category: 'Pizzor', order: 10 },
    { name: 'Hawaii', description: 'Tomatsås, ost, skinka, ananas', price: 130, category: 'Pizzor', order: 11 },
    { name: 'Marinara', description: 'Tomatsås, ost, räkor, musslor', price: 130, category: 'Pizzor', order: 12 },
    { name: 'Milano', description: 'Tomatsås, ost, räkor, champinjoner', price: 130, category: 'Pizzor', order: 13 },
    { name: 'Italia', description: 'Tomatsås, ost, champinjoner, tonfisk, lök', price: 130, category: 'Pizzor', order: 14 },
    { name: 'Pirata', description: 'Tomatsås, ost, tonfisk, räkor, musslor', price: 130, category: 'Pizzor', order: 15 },
    { name: 'Prinsessa', description: 'Tomatsås, ost, skinka, räkor, ananas', price: 130, category: 'Pizzor', order: 16 },
    { name: 'Reale', description: 'Tomatsås, ost, skinka, räkor, tonfisk', price: 130, category: 'Pizzor', order: 17 },
    { name: 'Rimini', description: 'Tomatsås, ost, skinka, räkor, champinjoner', price: 130, category: 'Pizzor', order: 18 },
    { name: 'Valentino', description: 'Tomatsås, ost, skinka, köttfärssås, paprika', price: 130, category: 'Pizzor', order: 19 },
    { name: 'Bolognese', description: 'Tomatsås, ost, köttfärssås, lök, vitlök', price: 130, category: 'Pizzor', order: 20 },
    { name: 'Afrikana', description: 'Tomatsås, ost, kyckling, banan, ananas, jordnötter, curry', price: 135, category: 'Pizzor', order: 21 },
    { name: 'Bacon Special', description: 'Tomatsås, ost, lök, bacon, köttfärssås, gorgonzolaost', price: 135, category: 'Pizzor', order: 22 },
    { name: 'Damore', description: 'Tomatsås, ost, skinka, champinjoner, räkor, kronärtskocka', price: 135, category: 'Pizzor', order: 23 },
    { name: 'Sigges Special', description: 'Tomatsås, ost, skinka, champinjoner, lök, ananas', price: 135, category: 'Pizzor', order: 24 },
    { name: 'Salami Special', description: 'Tomatsås, ost, lök, paprika, salami, köttfärssås', price: 135, category: 'Pizzor', order: 25 },
    { name: 'Toscana', description: 'Tomatsås, ost, bacon, champinjoner, paprika, lök', price: 135, category: 'Pizzor', order: 26 },

    // ── Special Pizzor ───────────────────────────────────────────────────────
    { name: 'Quattro', description: 'Skinka, musslor, räkor, champinjoner, kronärtskocka, oliver', price: 140, category: 'Special Pizzor', order: 1 },
    { name: 'Barbone', description: 'Skinka, champinjoner, lök, köttfärssås, vitlök', price: 140, category: 'Special Pizzor', order: 2 },
    { name: 'Bombay', description: 'Skinka, räkor, jordnötter, ananas, curry', price: 140, category: 'Special Pizzor', order: 3 },
    { name: 'La Maffia', description: 'Skinka, champinjoner, bacon, svartpeppar, lök', price: 140, category: 'Special Pizzor', order: 4 },
    { name: 'Lasse Special', description: 'Bacon, ägg, vitlök, champinjoner, lök, stark sås', price: 140, category: 'Special Pizzor', order: 5 },
    { name: 'Legend', description: 'Färska tomater, färska champinjoner, lök, kyckling, curry, stark sås', price: 140, category: 'Special Pizzor', order: 6 },
    { name: 'Roma', description: 'Champinjoner, tonfisk, räkor, sparris, jalapeño', price: 140, category: 'Special Pizzor', order: 7 },
    { name: 'Valentino Special', description: 'Skinka, köttfärssås, paprika, jalapeño, vitlök', price: 140, category: 'Special Pizzor', order: 8 },
    { name: 'Olympia', description: 'Färska champinjoner, skinka, fläskfilé, räkor, bacon, lök', price: 149, category: 'Special Pizzor', order: 9 },
    { name: 'Gorgonzola', description: 'Färska champinjoner, färska tomater, fläskfilé, lök, gorgonzola', price: 145, category: 'Special Pizzor', order: 10 },
    { name: 'Al Salami', description: 'Peperonikorv, paprika, persilja, vitlöksost', price: 140, category: 'Special Pizzor', order: 11 },
    { name: 'File Oskar', description: 'Fläskfilé, sparris, räkor, bearnaisesås', price: 145, category: 'Special Pizzor', order: 12 },
    { name: 'Saranda', description: 'Chevré, rucola, valnötter, honung', price: 140, category: 'Special Pizzor', order: 13 },
    { name: 'Black & White', description: 'Oxfilé, fläskfilé, sparris, bearnaisesås', price: 145, category: 'Special Pizzor', order: 14 },
    { name: 'Affumicata', description: 'Kallrökt lax, handskalade räkor, sparris, rucola, pinjenötter', price: 149, category: 'Special Pizzor', order: 15 },
    { name: 'Quattro Formaggio', description: 'Chevré, mozzarella, gorgonzola, fetaost', price: 145, category: 'Special Pizzor', order: 16 },

    // ── Inbakade Pizzor ──────────────────────────────────────────────────────
    { name: 'Calzone', description: 'Skinka', price: 120, category: 'Inbakade Pizzor', order: 1 },
    { name: 'Kung Calzone', description: 'Skinka, räkor & champinjoner', price: 135, category: 'Inbakade Pizzor', order: 2 },
    { name: 'Florentina', description: 'Fläskfilé, sparris & bearnaisesås', price: 140, category: 'Inbakade Pizzor', order: 3 },
    { name: 'Ciao Ciao', description: 'Champinjoner, lök, vitlök & fläskfilé', price: 140, category: 'Inbakade Pizzor', order: 4 },
    { name: 'Husets Special', description: 'Champinjoner, lök & kebabkött', price: 135, category: 'Inbakade Pizzor', order: 5 },

    // ── Vegetariska Pizzor ───────────────────────────────────────────────────
    { name: 'Vegetariana', description: 'Champinjoner, lök, paprika, kronärtskocka, oliver', price: 135, category: 'Vegetariska Pizzor', order: 1 },
    { name: 'NR1', description: 'Tomatsås, ost, champinjoner, färska tomater, paprika, aubergine & fetaost', price: 140, category: 'Vegetariska Pizzor', order: 2 },
    { name: 'NR2', description: 'Tomatsås, ost, aubergine, zucchini, kronärtskocka, rucola & pinjenötter', price: 140, category: 'Vegetariska Pizzor', order: 3 },
    { name: 'NR3', description: 'Tomatsås, ost, sparris, broccoli, paprika, oliver & kronärtskocka', price: 135, category: 'Vegetariska Pizzor', order: 4 },

    // ── Mexikanska Pizzor ────────────────────────────────────────────────────
    { name: 'Azteka', description: 'Skinka, jalapeño, tzatzikisås, tacosås', price: 135, category: 'Mexikanska Pizzor', order: 1 },
    { name: 'Mexicana', description: 'Köttfärssås, lök, vitlök, jalapeño, tacosås', price: 135, category: 'Mexikanska Pizzor', order: 2 },
    { name: 'Acapulco', description: 'Oxfilé, champinjoner, lök, vitlök, jalapeño, tacosås', price: 140, category: 'Mexikanska Pizzor', order: 3 },

    // ── Oxfilé Pizzor ────────────────────────────────────────────────────────
    { name: 'Atlantik', description: 'Färska tomater, oxfilé, sparris, bearnaisesås', price: 140, category: 'Oxfilé Pizzor', order: 1 },
    { name: 'Dallas', description: 'Champinjoner, färska tomater, oxfilé, bearnaisesås', price: 140, category: 'Oxfilé Pizzor', order: 2 },
    { name: 'Amore', description: 'Champinjoner, färska tomater, paprika, oxfilé, färsk vitlök, bearnaisesås', price: 145, category: 'Oxfilé Pizzor', order: 3 },
    { name: 'Delphi', description: 'Skinka, räkor, oxfilé, lök, bearnaisesås', price: 145, category: 'Oxfilé Pizzor', order: 4 },

    // ── Kebabpizzor ──────────────────────────────────────────────────────────
    { name: 'Hörby Special', description: 'Skinka, lök, färska tomater, kebabkött, vitlökssås', price: 140, category: 'Kebabpizzor', order: 1 },
    { name: 'Favoriten', description: 'Champinjoner, lök, ananas, kebabkött, kebabsås, feferoni', price: 135, category: 'Kebabpizzor', order: 2 },
    { name: 'Kebabpizza', description: 'Lök, kebabkött, kebabsås, feferoni', price: 130, category: 'Kebabpizzor', order: 3 },
    { name: 'Kebabpizza Special', description: 'Kebabkött, isbergssallad, tomat, gurka, lök, feferoni, mild sås', price: 140, category: 'Kebabpizzor', order: 4 },
    { name: 'Hörnans Kebabpizza', description: 'Kebabkött, isbergssallad, lök, tomat, gurka, feferoni, fetaost, mild sås', price: 149, category: 'Kebabpizzor', order: 5 },

    // ── Kycklingpizzor ───────────────────────────────────────────────────────
    { name: 'Kyckling Pizza', description: 'Lök, kyckling, feferoni, mild sås', price: 130, category: 'Kycklingpizzor', order: 1 },
    { name: 'Kycklingpizza Special', description: 'Lök, isbergssallad, tomat, gurka, feferoni, mild sås', price: 140, category: 'Kycklingpizzor', order: 2 },
    { name: 'Gamla Torg', description: 'Skinka, lök, färska tomater, kyckling, vitlökssås', price: 140, category: 'Kycklingpizzor', order: 3 },
    { name: 'Hörnans Kycklingpizza', description: 'Kyckling, lök, sallad, gurka, tomat, feferoni, fetaost, mild sås', price: 149, category: 'Kycklingpizzor', order: 4 },

    // ── Kebab meny ───────────────────────────────────────────────────────────
    { name: 'Kebab med Pitabröd', description: 'Kebabkött, sallad, lök, gurka, tomat, feferoni, mild sås', price: 130, category: 'Kebab', order: 1 },
    { name: 'Kebabrulle', description: 'Kebabkött, sallad, lök, feferoni, gurka, tomat, mild sås', price: 125, category: 'Kebab', order: 2 },
    { name: 'Kebabtallrik med Strips', description: 'Kebabkött, sallad, lök, feferoni, tomat, gurka, mild sås', price: 130, category: 'Kebab', order: 3 },
    { name: 'Kebabtallrik Deluxe med Strips', description: 'Kebabkött, sallad, lök, feferoni, tomat, gurka, mild sås, fetaost', price: 140, category: 'Kebab', order: 4 },
    { name: 'Kycklingrulle', description: 'Kyckling, sallad, lök, feferoni, tomat, gurka, mild sås', price: 130, category: 'Kebab', order: 5 },
    { name: 'Kycklingtallrik med Strips', description: 'Kyckling, sallad, lök, feferoni, tomat, gurka, mild sås', price: 130, category: 'Kebab', order: 6 },

    // ── Bakpotatis ───────────────────────────────────────────────────────────
    { name: 'Räkor', description: 'Handskalade räkor, tomater, gurka, paprika, säsongens sallad, dill & citron', price: 145, category: 'Bakpotatis', order: 1 },
    { name: 'Tonfisk', description: 'Tonfisk, tomater, gurka, paprika, säsongens sallad, sparris, rödlök & citron', price: 140, category: 'Bakpotatis', order: 2 },
    { name: 'Skagenröra', description: 'Skagenröra, sallad, tomater, gurka, rödlök & citron', price: 145, category: 'Bakpotatis', order: 3 },
    { name: 'Kyckling', description: 'Salladskyckling, tomater, gurka, paprika, säsongens sallad, mozzarellaost, rödlök, soltorkade tomater', price: 140, category: 'Bakpotatis', order: 4 },
    { name: 'Ost & Skinka', description: 'Ost, skinka, tomater, gurka, paprika, säsongens sallad, ananas', price: 135, category: 'Bakpotatis', order: 5 },
    { name: 'Fetaost', description: 'Fetaost, tomater, gurka, säsongens sallad, oliver, rödlök, paprika', price: 140, category: 'Bakpotatis', order: 6 },
    { name: 'Lax & Avokado', description: 'Lax, avokado, tomat, gurka, säsongens sallad, dill & lime dressing', price: 145, category: 'Bakpotatis', order: 7 },

    // ── Sallader ─────────────────────────────────────────────────────────────
    { name: 'Kycklingsallad', description: 'Salladskyckling, säsongens sallad, tomat, gurka, paprika, mozzarellaost, rödlök, soltorkade tomater', price: 135, category: 'Sallader', order: 1 },
    { name: 'Räksallad', description: 'Handskalade räkor, tomat, gurka, paprika, säsongens sallad, rödlök, ägg', price: 140, category: 'Sallader', order: 2 },
    { name: 'Tonfisksallad', description: 'Tonfisk, tomat, gurka, säsongens sallad, sparris, rödlök, paprika, citron', price: 135, category: 'Sallader', order: 3 },
    { name: 'Kebabsallad', description: 'Kebabkött, tomat, gurka, paprika, säsongens sallad, rödlök', price: 130, category: 'Sallader', order: 4 },
    { name: 'Ost & Skinksallad', description: 'Ost, skinka, tomat, gurka, säsongens sallad, paprika, ananas', price: 130, category: 'Sallader', order: 5 },
    { name: 'Grekisk Sallad', description: 'Salladsost, tomat, gurka, säsongens sallad, rödlök, paprika, oliver', price: 135, category: 'Sallader', order: 6 },
    { name: 'Lax & Avokado Sallad', description: 'Lax, avokado, tomat, gurka, paprika, säsongens sallad, rödlök, dill & lime dressing', price: 140, category: 'Sallader', order: 7 },
    { name: 'Vegetarisk Sallad', description: 'Champinjoner, tomat, gurka, paprika, säsongens sallad, rödlök, sparris, ananas, oliver, kronärtskocka', price: 135, category: 'Sallader', order: 8 },
    { name: 'Caesar Sallad', description: 'Kycklingfilé, bacon, säsongens sallad, paprika, gurka, tomat, krutonger, granatäpple & parmesan', price: 159, category: 'Sallader', order: 9 },

    // ── Drycker ───────────────────────────────────────────────────────────────
    { name: 'Läsk burk 33cl', description: 'Coca-Cola, Fanta, Sprite eller annan läsk', price: 23, category: 'Drycker', order: 1 },
    { name: 'Läsk PET 50cl', description: 'Coca-Cola, Fanta, Sprite eller annan läsk', price: 28, category: 'Drycker', order: 2 },
  ]

  // Wipe and re-seed menu items fresh from real Facebook menu data
  await prisma.menuItem.deleteMany()
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }

  // ── Lunch Days ────────────────────────────────────────────────────────────
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
      value: 'Välkommen till Restaurang Hörnan Valentino — Hörbys mest omtyckta matställe för à la carte. Vi serverar handgjorda pizzor, kebab, pasta och mycket mer med kärlek och de bästa råvarorna. Hos oss hittar du en varm och familjär atmosfär som passar både en snabb lunch och en festlig middag. Öppet alla dagar i veckan!',
    },
    {
      key: 'about_text',
      value: 'Restaurang Hörnan Valentino har länge varit ett självklart val för Hörbyborna. Beläget på Nygatan 38 i centrala Hörby, Skåne, har vi gjort oss kända för våra vällagade pizzor, smakrika kebabmaträtter och generösa portioner. Vi är stolta över att vara rankade som #5 av 34 restauranger i Hörby och kallade "lätt byns bästa matställe" av våra gäster.',
    },
    {
      key: 'about_story',
      value: 'Hos oss är alla välkomna — familjer, kompisgäng och affärsmiddagar. Vi erbjuder avhämtning, bordsbeställning och uteservering under sommaren. Vår personal är välutbildad och servicen är alltid snabb och vänlig. Vi tar emot betalkort och är anpassade för rörelsehindrade.',
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
      value: 'Restaurang Hörnan Valentino — Pizzeria & Restaurang i Hörby, Skåne. Pizza, kebab, plankor, pasta och mer. Öppet alla dagar. Nygatan 38, 242 31 Hörby. Tel: 0415-100 39.',
    },
  ]

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

  console.log('✅ Seed completed — Full real Facebook menu loaded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
