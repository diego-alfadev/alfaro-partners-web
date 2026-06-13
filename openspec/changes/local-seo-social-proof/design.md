# Design: Local SEO and Social Proof

## Overview

This change adds a small static local-SEO layer to the existing Astro site. It does not introduce MDX or dynamic routing; three hand-authored pages are better than a generic template because local SEO pages need differentiated copy.

## Decisions

### 1. Normalize Instagram URL

Use `https://www.instagram.com/alfaropartners/` instead of the QR/tracking URL. The profile is the canonical destination; tracking query parameters are noise in code and SEO.

### 2. Use static pages for the first three zones

Create:

- `/zonas/`
- `/zonas/retiro/`
- `/zonas/ibiza/`
- `/zonas/barrio-de-salamanca/`

If this grows beyond 5-6 zones, move content to data-driven pages or content collections.

### 3. Keep copy evergreen

Avoid current pricing, yield claims, or “best area” language. Focus on decision criteria, lifestyle, buyer/tenant fit, and representation value.

### 4. Do not overload header

Add a “Zonas” nav item and social links in footer/contact areas. Avoid adding social icons to the fixed header unless the visual design needs it later.

## File Plan

| File | Change |
|------|--------|
| `src/lib/constants.ts` | Add Instagram, LinkedIn, and zones metadata. |
| `src/layouts/BaseLayout.astro` | Add `Zonas` nav link and social profile links in footer. |
| `src/pages/index.astro` | Add Madrid zones section and social proof line near contact. |
| `src/pages/zonas/index.astro` | Zone index page. |
| `src/pages/zonas/retiro.astro` | Retiro landing page. |
| `src/pages/zonas/ibiza.astro` | Ibiza, Madrid landing page. |
| `src/pages/zonas/barrio-de-salamanca.astro` | Barrio de Salamanca landing page. |

## Verification

- `bun run astro sync`
- `bun run build` only when user asks to deploy/build.
- Inspect generated routes if build is run.
- Browser check after deployment or when local browser access is available.
