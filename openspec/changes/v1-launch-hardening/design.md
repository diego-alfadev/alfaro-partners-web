# Design: V1 Launch Hardening

## Overview

This change hardens the existing single-page Astro landing for launch. It deliberately avoids implementing the full multi-page V1 from `docs/astro-sdd-spec.md`; the goal is to remove production blockers while preserving the current design and deployment model.

## Decisions

### 1. Keep hardening static

Use Astro/public files and existing constants. Do not add runtime JavaScript, CMS, analytics, or content collections in this change.

### 2. Make URL generation base-aware

GitHub Pages serves the site at `/alfaro-partners-web/`. Metadata and assets must not assume domain root. Use:

- `Astro.site` for absolute published URLs where possible.
- `import.meta.env.BASE_URL` for base-prefixed public paths.
- `new URL(path, Astro.site)` style construction when absolute URLs are required.

### 3. Treat legal pages as launch placeholders only if content is unavailable

Footer `href="#"` is worse than a minimal page. If final legal text is unavailable, create simple pages that state the section is pending legal review and provide contact info. If that feels inappropriate, hide those links instead.

### 4. Do not install checking dependencies inside this hardening unless approved

`bun run astro check` currently prompts to add `@astrojs/check` and `typescript`. Installing them is useful, but it is a dependency/config change. Keep it optional unless the user approves it during implementation.

## File Plan

| File | Change |
|------|--------|
| `src/lib/constants.ts` | Add canonical site/base URLs, booking label/url, social image path, legal route paths. |
| `src/layouts/BaseLayout.astro` | Accept optional path/image props; emit canonical, OpenGraph/Twitter metadata, absolute JSON-LD URLs. |
| `src/pages/index.astro` | Pass route/metadata values if needed; ensure CTAs use constants. |
| `src/pages/aviso-legal.astro` | Minimal legal placeholder or real text. |
| `src/pages/privacidad.astro` | Minimal privacy placeholder or real text. |
| `src/pages/cookies.astro` | Minimal cookies placeholder or real text. |
| `public/robots.txt` | Allow indexing and reference sitemap index. |

## Verification Strategy

Without running a production build unless explicitly requested:

1. Source inspection for metadata generation and no `href="#"`.
2. Run lightweight Astro/dev-safe checks if available.
3. After deploy, use `curl -I`/`curl -L` against:
   - `/alfaro-partners-web/`
   - `/alfaro-partners-web/robots.txt`
   - `/alfaro-partners-web/sitemap-index.xml`
   - referenced `_astro/*.css`
   - referenced public images

## Risks and Tradeoffs

- Minimal legal pages are not a substitute for legal review, but they avoid dead links.
- Absolute URL construction must be tested against GitHub Pages base path.
- Leaving `@astrojs/check` uninstalled limits automated type verification until a dependency task is approved.
