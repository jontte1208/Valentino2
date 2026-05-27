import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn, isSanityConfigured } from '../../sanity/env'

type FetchFn = SanityClient['fetch']

// Stub client used when Sanity env vars are missing (dev/preview only —
// production throws in sanity/env.ts). All fetches resolve to null so pages
// can render their static fallbacks instead of crashing.
function createStubClient(): Pick<SanityClient, 'fetch'> {
  const fetchStub: FetchFn = (async () => null) as unknown as FetchFn
  return { fetch: fetchStub }
}

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })
  : (createStubClient() as SanityClient)
