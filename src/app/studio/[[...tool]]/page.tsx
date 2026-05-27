'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// Studio är en interaktiv klient-applikation som bootstrapper i webbläsaren.
// `force-dynamic` säkerställer att Next inte försöker prerendra något ISR-state.
export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
