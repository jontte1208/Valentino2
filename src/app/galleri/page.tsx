import type { Metadata } from 'next'
import { sanityClient } from '@/sanity/client'
import { galleryImagesQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import GalleriClient from './GalleriClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Galleri',
  description:
    'Bilder från Pizzeria Valentino i Hörby — restaurangen, rätterna och stämningen.',
  alternates: { canonical: '/galleri' },
  openGraph: { title: 'Galleri', url: '/galleri' },
}

interface SanityGalleryImage {
  _id: string
  image: unknown
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
      src: urlFor(g.image as never).width(1600).quality(85).url(),
      alt: g.alt,
    }))

  return <GalleriClient images={images} />
}
