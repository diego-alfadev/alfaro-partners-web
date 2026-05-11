# Apply Progress: V1 Launch Hardening

## Mode

Standard mode. Strict TDD is disabled because this repo has no installed test runner.

## Completed Tasks

- [x] 1.1 Add/confirm canonical site constants in `src/lib/constants.ts`.
- [x] 1.2 Update `src/layouts/BaseLayout.astro` to emit canonical URL, `og:url`, absolute `og:image`, and complete Twitter metadata.
- [x] 1.3 Update JSON-LD to use the effective published URL/image rather than hardcoded future-domain URLs.
- [x] 1.4 Ensure all base-prefixed public assets still use `import.meta.env.BASE_URL`.
- [x] 2.1 Add `public/robots.txt` with `Allow: /` and sitemap reference.
- [x] 2.2 Verify sitemap integration remains enabled in `astro.config.mjs`.
- [x] 3.2 Ensure all booking CTAs use the same configured URL.
- [x] 3.3 Remove `href="#"` footer placeholders by adding minimal pages or hiding links.
- [x] 3.4 Add legal placeholder pages using `BaseLayout`.
- [x] 4.1 Inspect source for no `href="#"` in footer/navigation.
- [x] 4.2 Verify metadata by source inspection.
- [x] 4.3 Verify `robots.txt`, `sitemap-index.xml`, CSS, and public images return HTTP 200 after deploy.
- [x] 4.4 Verify the published page in a browser.

## Remaining Tasks

- [ ] 3.1 Replace or explicitly confirm the booking URL in `src/lib/constants.ts`.

## Files Changed

| File | Action | What Changed |
|------|--------|--------------|
| `src/lib/constants.ts` | Modified | Added site, booking, social, and legal constants; booking remains marked as placeholder. |
| `src/layouts/BaseLayout.astro` | Modified | Added canonical, OpenGraph/Twitter metadata, absolute image URL, dynamic JSON-LD, base-aware nav/footer links. |
| `src/pages/index.astro` | Modified | Switched booking and WhatsApp links to shared constants. |
| `src/pages/aviso-legal.astro` | Created | Minimal legal placeholder page. |
| `src/pages/privacidad.astro` | Created | Minimal privacy placeholder page. |
| `src/pages/cookies.astro` | Created | Minimal cookie placeholder page. |
| `public/robots.txt` | Created | Allows indexing and references sitemap index. |

## Verification Performed

- Ran `bun run astro sync` successfully.
- Ran `bun run build` successfully before deployment.
- Inspected source for metadata and absence of dead `href="#"` links.
- Confirmed `astro.config.mjs` still includes `@astrojs/sitemap`.
- Deployed to `gh-pages` and verified published HTTP 200 responses for home, `robots.txt`, `sitemap-index.xml`, legal pages, CSS, and public images.
- Opened the published site in the browser and confirmed the hero/header render with styles.

## Deviations

- Legal pages are explicit placeholders pending legal review, per user approval.
- Final booking URL is not available; `booking.status` remains `"placeholder"`.
- Browser verification was performed against the published GitHub Pages URL.
