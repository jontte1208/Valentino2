// Centraliserad TypeScript-spegling av Sanity siteSettings-singleton.
// Källa: sanity/schemas/siteSettings.ts — håll denna fil synkad med schemat.
//
// Alla fält är optional för att matcha hur Studio fungerar (fält kan vara
// otomna ifyllda och queries kan exkludera dem).

export interface OpeningHoursRow {
  day: string
  hours: string
  _key?: string
}

// `aboutBody` är ett array av portable text-block i schemat. Vi använder
// `unknown[]` för att inte införa @portabletext/types som beroende — typen
// behövs bara där `aboutBody` faktiskt renderas, och kan kastas där lokalt.
export type PortableTextBlocks = unknown[]

// Sanity image-fält. Använd `SanityImageSource` direkt så `urlFor()` accepterar
// värdet utan typcastning. Återexporteras här för bekvämlighet.
export type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
export type SanityImageRef = SanityImageSource

export interface SiteSettings {
  // Hero
  heroLabel?: string
  heroTitle?: string
  heroSubtitle?: string
  heroTagline?: string
  heroImage?: SanityImageRef

  // Om oss
  aboutTitle?: string
  aboutText?: string
  aboutStory?: string
  aboutBody?: PortableTextBlocks
  aboutImage?: SanityImageRef

  // Öppettider
  openingHours?: OpeningHoursRow[]
  lunchHours?: string

  // Kontakt
  address?: string
  phone?: string
  email?: string
  mapEmbedUrl?: string

  // Sociala medier
  facebookUrl?: string
  instagramUrl?: string

  // Sidfot
  footerTagline?: string
}
