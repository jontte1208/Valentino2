import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { galleryImagesQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import type { SanityImageSource } from '@/sanity/types'
import GalleriClient from './GalleriClient'

// Galleribilder ändras sällan — 1h ISR räcker.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Galleri',
  description:
    'Bilder från Pizzeria Valentino i Hörby — restaurangen, rätterna och stämningen.',
  alternates: { canonical: '/galleri' },
  openGraph: { title: 'Galleri', url: '/galleri' },
}

interface SanityGalleryImage {
  _id: string
  image: SanityImageSource
  alt: string
  order: number
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
}

export default async function GalleriPage() {
  const raw = await sanityClient.fetch<SanityGalleryImage[]>(galleryImagesQuery)

  const images: GalleryItem[] = raw
    .filter((g) => g.image)
    .map((g) => ({
      id: g._id,
      // .quality(80) sätts som default i urlFor() — vi behöver inte chaina det.
      src: urlFor(g.image).width(1600).url(),
      alt: g.alt,
    }))

  return <GalleriClient images={images} />
}
