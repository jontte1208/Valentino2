import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { dataset, projectId } from '../../sanity/env'

const builder = imageUrlBuilder({ projectId, dataset })

// `.auto('format')` levererar AVIF/WebP när webbläsaren stöder det.
// `.quality(80)` är en bra balans mellan storlek och visuell kvalitet.
// Anroparen kan fortfarande chaina vidare (.width, .height, .fit etc.).
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').quality(80)
}
