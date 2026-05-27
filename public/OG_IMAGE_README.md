# OG-bild (Open Graph / Twitter Card)

Just nu använder sajten **`/og-image.svg`** — en enkel SVG-platshållare i varumärkesfärgerna.

## Rekommenderat att ersätta med en riktig bild

För bästa renderingsstöd på Facebook, LinkedIn, iMessage, Slack, X m.fl.:

1. Skapa en **JPG eller PNG** på exakt **1200 × 630 px** (≤ 1 MB).
2. Föreslagen filplats: `public/og-image.jpg`.
3. Uppdatera `src/app/layout.tsx`:
   - `openGraph.images[0].url` → `/og-image.jpg`
   - `twitter.images[0]`       → `/og-image.jpg`
   - Sätt `width: 1200, height: 630, type: 'image/jpeg'`.
4. Ta bort `public/og-image.svg` när den riktiga bilden ligger på plats.

SVG fungerar i många moderna previews men inte alla — `.jpg`/`.png` är säkrast.
