# Pizzeria Valentino

Public website and embedded Sanity Studio for **Pizzeria Valentino** in Hörby, Skåne.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind**, **framer-motion**, and **Sanity v3** (Content Lake + embedded Studio at `/studio`). Deployed on **Vercel**.

## Features

- Server-rendered public pages in Swedish: hem, meny, veckans lunch, galleri, om oss, kontakt
- Editable content via embedded Sanity Studio at `/studio`
- Automatic weekly lunch rotation based on ISO week number
- ISR (`revalidate: 60`) for fresh content without rebuilds
- SEO: dynamic `robots.txt`, `sitemap.xml`, schema.org Restaurant JSON-LD, OpenGraph + Twitter metadata
- Hardened CSP and security headers (Studio route exempted where required)

## Requirements

- Node.js 18.17+ (Next.js 14 minimum)
- npm
- A Sanity project (free tier works) — https://sanity.io

## Environment variables

Create `.env.local` in the repo root:

```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01    # defaults to 2025-01-01
NEXT_PUBLIC_SITE_URL=https://your-domain.se  # used by sitemap/robots/OG/canonical
```

Notes:
- In **production** the app fails fast if Sanity vars are missing.
- In **development / Vercel preview** missing Sanity vars only log a warning — Sanity fetches return `null` and pages render their hard-coded fallbacks. This keeps `next dev` and preview builds working for contributors without Sanity credentials.
- `NEXT_PUBLIC_SITE_URL` is the recommended way to set the canonical site URL. If absent, the app falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, then `http://localhost:3000`.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

Open `/studio` to edit content (Sanity auth via Google / GitHub / email).

## Build & run

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel (Next.js auto-detected).
3. Set environment variables in **Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://valentino2.vercel.app` or custom domain)
4. Deploy.
5. In Sanity (https://manage.sanity.io → project → API → CORS Origins) add your Vercel URL **with credentials**.

## Content model (Sanity)

- `menuItem` — menu dishes (kategori, ordning, pizzaType)
- `lunchWeek` — one document per ISO week, with array of days + weekly soup
- `galleryImage` — gallery images
- `siteSettings` (singleton) — hero copy, om oss, kontaktuppgifter, öppettider, sociala medier, kartlänk

### Weekly lunch rotation

`/veckans-lunch` queries Sanity for the document where `weekNumber == currentISOWeek && year == currentYear`. When Monday rolls over, the new week is picked up automatically on the next ISR revalidation.

To prepare next week: open `/studio` → **Veckans lunch** → **New document** → fill in the upcoming week number and days.

## Project structure

```
src/
  app/                     # Next.js App Router pages
    layout.tsx             # Root metadata + JSON-LD
    page.tsx               # Hem
    meny/                  # /meny
    veckans-lunch/         # /veckans-lunch
    galleri/, om-oss/, kontakt/
    studio/[[...tool]]/    # Embedded Sanity Studio (noindex)
    robots.txt/route.ts    # Dynamic robots
    sitemap.xml/route.ts   # Dynamic sitemap
  components/              # UI components (layout, home, ui)
  lib/
    siteUrl.ts             # Canonical site URL resolver
    weekNumber.ts          # ISO week helper
  sanity/
    client.ts              # Public read-only client (CDN)
    image.ts               # urlFor() image builder
    queries.ts             # GROQ queries
sanity/
  env.ts                   # Sanity env loading (prod fail-fast, dev tolerant)
  schemas/                 # Content schemas
  structure.ts             # Studio navigation
sanity.config.ts           # Studio config
```

## Troubleshooting

- **`Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID`** during `next build` — set the Sanity env vars in Vercel and redeploy. Local dev only warns.
- **Studio fails to load / CORS error** — add the deployment URL in Sanity → Manage → API → CORS Origins (with credentials).
- **Sitemap or OpenGraph URLs show `localhost`** — set `NEXT_PUBLIC_SITE_URL` in the Vercel project.
- **Pages render fallback copy in production** — Sanity returned empty/`null`. Open `/studio` and publish the missing documents (especially `siteSettings`).

## Conventions

- All user-facing copy is in Swedish.
- Use `getISOWeekNumber()` from `src/lib/weekNumber.ts` — never reinvent week math.
- Sanity images: always set explicit width via `urlFor(image).width(N).url()`.
- Adding a new editable field: extend the schema, the GROQ query, and the consuming component.
