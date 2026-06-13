# Tasks: V1 Launch Hardening

## 1. SEO and URL foundations

- [x] 1.1 Add/confirm canonical site constants in `src/lib/constants.ts`.
- [x] 1.2 Update `src/layouts/BaseLayout.astro` to emit canonical URL, `og:url`, absolute `og:image`, and complete Twitter metadata.
- [x] 1.3 Update JSON-LD to use the effective published URL/image rather than hardcoded future-domain URLs.
- [x] 1.4 Ensure all base-prefixed public assets still use `import.meta.env.BASE_URL`.

## 2. Indexing files

- [x] 2.1 Add `public/robots.txt` with `Allow: /` and sitemap reference.
- [x] 2.2 Verify sitemap integration remains enabled in `astro.config.mjs`.

## 3. Contact and footer readiness

- [ ] 3.1 Replace or explicitly confirm the booking URL in `src/lib/constants.ts`.
- [x] 3.2 Ensure all booking CTAs use the same configured URL.
- [x] 3.3 Remove `href="#"` footer placeholders by adding minimal pages or hiding links.
- [x] 3.4 If legal pages are added, use `BaseLayout` and clear "pending legal review" wording unless final text is available.

## 4. Verification

- [x] 4.1 Inspect source for no `href="#"` in rendered footer/navigation.
- [x] 4.2 Verify generated metadata by inspecting local or published HTML.
- [x] 4.3 Verify `robots.txt`, `sitemap-index.xml`, CSS, and public images return HTTP 200 after deploy.
- [x] 4.4 If UI changes are made, verify the page in a browser.

## 5. Optional follow-up

- [ ] 5.1 Decide whether to add `@astrojs/check` and `typescript` for non-interactive `bun run astro check`.
- [ ] 5.2 Decide whether Plausible belongs in V1 hardening or V1.1.
- [ ] 5.3 Decide when to start the full multi-page V1 (`/firma`, `/servicios`, `/vision`, MDX articles).

## Review Workload Forecast

- Estimated changed lines: 180-260.
- 400-line budget risk: Low.
- Chained PRs recommended: No.
- Decision needed before apply: Yes — booking URL and legal-page strategy must be confirmed or implemented as explicit placeholders.
