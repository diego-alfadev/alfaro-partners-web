# Apply Progress: Local SEO and Social Proof

## Mode

Standard mode. Strict TDD is disabled because this repo has no installed test runner.

## Completed Tasks

- [x] 1.1 Add normalized Instagram and LinkedIn URLs to `src/lib/constants.ts`.
- [x] 1.2 Add zone route/title metadata for Retiro, Ibiza, and Barrio de Salamanca.
- [x] 2.1 Add a `Zonas` navigation link.
- [x] 2.2 Add visible Instagram and LinkedIn footer links.
- [x] 3.1 Add a Madrid-centro zones section linking to the three zone pages.
- [x] 3.2 Add social proof links near the contact/CTA area without cluttering the hero.
- [x] 4.1 Create `/zonas/` index page.
- [x] 4.2 Create `/zonas/retiro/`.
- [x] 4.3 Create `/zonas/ibiza/`.
- [x] 4.4 Create `/zonas/barrio-de-salamanca/`.
- [x] 4.5 Ensure every zone page has unique title, description, H1, and CTA.
- [x] 5.1 Run `bun run astro sync`.
- [x] 5.2 Inspect source for approved social URLs and zone links.

## Remaining Tasks

- [x] 5.3 If deployment is requested, run build, publish, and browser-check.

## Files Changed

| File | Action | What Changed |
|------|--------|--------------|
| `src/lib/constants.ts` | Modified | Added normalized social URLs and Madrid zone metadata. |
| `src/layouts/BaseLayout.astro` | Modified | Added `Zonas` nav link and Instagram/LinkedIn footer links. |
| `src/pages/index.astro` | Modified | Added Madrid zones section and social links near contact CTA. |
| `src/pages/zonas/index.astro` | Created | Zone index page. |
| `src/pages/zonas/retiro.astro` | Created | Retiro local SEO landing page. |
| `src/pages/zonas/ibiza.astro` | Created | Ibiza, Madrid local SEO landing page. |
| `src/pages/zonas/barrio-de-salamanca.astro` | Created | Barrio de Salamanca local SEO landing page. |

## Verification Performed

- Ran `bun run astro sync` successfully.
- Ran `bun run build` successfully; Astro generated 8 pages.
- Inspected source for the normalized Instagram URL and provided LinkedIn URL.
- Inspected source for `/zonas/`, `/zonas/retiro/`, `/zonas/ibiza/`, and `/zonas/barrio-de-salamanca/` references.
- Fixed base-path URL generation after build exposed malformed `/alfaro-partners-webzonas/...` links.

## Deviations

- Instagram URL was normalized from the QR/tracking URL to `https://www.instagram.com/alfaropartners/`.
- Deployment and browser verification requested by the user after implementation.
