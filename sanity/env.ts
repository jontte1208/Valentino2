// Sanity environment configuration.
//
// In production we fail fast on missing env vars (a misconfigured deploy
// should not silently serve broken content). In development/preview we log
// a warning and fall back to empty strings so `next dev` and `next build`
// still complete — fetches will return null and pages render with their
// hard-coded fallbacks instead of crashing the whole app.

const isProd = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV?.includes('preview')

function readEnv(name: string, value: string | undefined): string {
  if (value && value.length > 0) return value

  if (isProd) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in the Vercel project settings.`
    )
  }

  // eslint-disable-next-line no-console
  console.warn(
    `[sanity/env] ${name} is not set. Falling back to empty value. Sanity fetches will be skipped — pages will render with default content.`
  )
  return ''
}

export const projectId = readEnv(
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
)

export const dataset = readEnv(
  'NEXT_PUBLIC_SANITY_DATASET',
  process.env.NEXT_PUBLIC_SANITY_DATASET
)

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const useCdn = true

export const isSanityConfigured = projectId.length > 0 && dataset.length > 0
