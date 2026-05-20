# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Pizzeria Valentino — a Next.js 14 (App Router) restaurant site with a Swedish-language public site (meny, veckans-lunch, galleri, om-oss, kontakt). Content is edited in an embedded Sanity Studio at `/studio`.

## Commands

```bash
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # next lint
```

## Required environment

Variables live in `.env.local` (not committed):

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — required
- `NEXT_PUBLIC_SANITY_DATASET` — typically `production`
- `NEXT_PUBLIC_SANITY_API_VERSION` — optional, defaults to `2025-01-01`

For Vercel: set these as Environment Variables on the project. No write-token is needed at runtime — Sanity Studio handles its own auth via Google/GitHub/email.

## Architecture

**Stack:** Next.js 14 App Router, Sanity v3 (embedded Studio + Content Lake), Tailwind, framer-motion. TypeScript strict.

**Content model (Sanity):**
- `menuItem` — menyrätter (kategori, ordning, pizzaType)
- `lunchWeek` — en per ISO-vecka, med array av dagar + soppa
- `galleryImage` — Sanity-hosted images
- `siteSettings` (singleton) — hero, om-oss, kontaktuppgifter, öppettider, kartlänk

**Sanity client:** [src/sanity/client.ts](src/sanity/client.ts) är den publika read-only klienten (useCdn: true). GROQ-queries i [src/sanity/queries.ts](src/sanity/queries.ts). Bild-URLs via [src/sanity/image.ts](src/sanity/image.ts) (`urlFor()`).

**Public pages:** Server components som hämtar från Sanity med `revalidate: 3600` (ISR). Klient-wrappers (`*Client.tsx`) hanterar animationer (framer-motion kräver `'use client'`).

**Veckans lunch (automatiskt veckobyte):** [src/app/veckans-lunch/page.tsx](src/app/veckans-lunch/page.tsx) frågar Sanity efter dokumentet med `weekNumber == currentISOWeek && year == currentYear`. När måndag slår över byts veckan automatiskt vid nästa ISR-revalidering. För att förbereda nästa vecka: öppna `/studio` → Veckans lunch → New document → fyll i kommande veckonummer + dagar.

**Studio (`/studio`):** Embedded via `next-sanity/studio`. Config i [sanity.config.ts](sanity.config.ts), scheman i [sanity/schemas/](sanity/schemas/), navigationsstruktur i [sanity/structure.ts](sanity/structure.ts). Layout sätter `robots: noindex` så Google inte indexerar den.

**Security headers:** [next.config.mjs](next.config.mjs) — CSP tillåter `cdn.sanity.io` och Sanity API/WebSockets. Studio-routen undantas från CSP/X-Frame-Options eftersom Studio behöver Web Workers (blob:) och iframe-stöd.

## Conventions

- All user-facing copy är på svenska
- ISO-veckonummer: använd [src/lib/weekNumber.ts](src/lib/weekNumber.ts)
- Bilder: använd `urlFor(image).width(N).url()` — sätt alltid en explicit width
- Nya editerbara fält: lägg till i schema + uppdatera query

## Deployment (Vercel)

1. Push till GitHub
2. Importera repo i Vercel (Framework: Next.js detekteras automatiskt)
3. Sätt env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
4. Deploy
5. Lägg till din Vercel-URL i Sanity CORS: manage.sanity.io → projekt → API → CORS Origins (med credentials)
