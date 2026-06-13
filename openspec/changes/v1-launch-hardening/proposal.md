# Proposal: V1 Launch Hardening

## Intent

Ship the current Alfaro & Partners landing as a credible V1 launch by closing SEO, indexing, booking, and placeholder gaps without expanding into the full multi-page site.

## Scope

### In Scope
- Add launch-ready SEO metadata: canonical URL, absolute social image URLs, `og:url`, and Twitter metadata.
- Add `robots.txt` and verify sitemap/indexing behavior under `/alfaro-partners-web/`.
- Replace placeholder booking/contact constants with final or clearly configurable values.
- Remove production placeholder footer links by adding minimal legal pages or hiding unavailable links.
- Add lightweight verification notes/checks for published GitHub Pages.

### Out of Scope
- Multi-page V1 architecture (`/firma`, `/servicios`, `/vision`) unless needed for legal pages.
- MDX content collections and evergreen articles.
- Plausible Analytics setup.
- Visual redesign, copy rewrite, or conversion experiments.

## Capabilities

### New Capabilities
- `launch-hardening`: SEO/indexing/contact/legal readiness for the static launch.

### Modified Capabilities
- None.

## Approach

Keep the implementation static and small. Centralize URL construction and business constants, improve `BaseLayout.astro` metadata/schema, add static public files/pages, and verify generated/published URLs respect Astro’s GitHub Pages base path.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/layouts/BaseLayout.astro` | Modified | SEO metadata, canonical, social URLs, schema. |
| `src/lib/constants.ts` | Modified | Booking/contact/site URLs. |
| `src/pages/` | Modified/New | Legal placeholder pages if footer links remain. |
| `public/robots.txt` | New | Indexing policy and sitemap reference. |
| `openspec/` | New | SDD artifacts for the hardening change. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Wrong canonical/base URL on GitHub Pages | Medium | Derive paths with `Astro.site`/`import.meta.env.BASE_URL`; verify published HTML. |
| Legal pages imply final legal approval | Medium | Keep minimal neutral placeholders or remove links until approved. |
| Booking URL remains placeholder | Medium | Make it explicit in constants and verification checklist. |

## Rollback Plan

Revert the hardening commit(s). Static additions are isolated to metadata, public files, constants, and optional legal pages; rollback does not affect the deployed content model.

## Dependencies

- Final booking URL from Diego/José María, or explicit acceptance of the temporary booking destination.
- Legal text approval if full legal/privacy/cookie pages are required.

## Success Criteria

- [ ] Published page includes canonical, `og:url`, absolute `og:image`, and Twitter metadata.
- [ ] `robots.txt` returns `200` and references the sitemap.
- [ ] Footer has no dead `href="#"` links.
- [ ] Booking CTAs point to the agreed destination.
- [ ] GitHub Pages CSS and core assets still return `200`.
