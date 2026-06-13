# Proposal: Local SEO and Social Proof

## Intent

Add Madrid-centro location positioning and social-profile trust signals requested by José María, without turning the site into a full content platform yet.

## Scope

### In Scope
- Add Instagram and LinkedIn links from shared business constants.
- Surface social links in low-friction site areas.
- Add a home section for prime Madrid zones.
- Add SEO-focused zone pages for Retiro, Ibiza (Madrid), and Barrio de Salamanca.
- Add a zone index page under `/zonas/`.

### Out of Scope
- Real-time market data, prices, or claims requiring frequent updates.
- Blog/MDX content collections.
- Custom photography or maps.
- Paid SEO keyword research.

## Capabilities

### New Capabilities
- `local-seo-social-proof`: social profile exposure and local Madrid zone landing pages.

### Modified Capabilities
- None.

## Approach

Use static Astro pages and shared data in `src/lib/constants.ts`. Keep copy evergreen, premium, and conversion-oriented: lifestyle entry, local decision criteria, risks, and representation CTA. Avoid thin SEO pages by giving each zone distinct positioning.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/constants.ts` | Modified | Add social and zone metadata. |
| `src/layouts/BaseLayout.astro` | Modified | Add navigation/footer social or zone links. |
| `src/pages/index.astro` | Modified | Add zones/social proof section. |
| `src/pages/zonas/` | New | Zone index and three zone landing pages. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Thin SEO pages | Medium | Write differentiated, useful evergreen copy per zone. |
| Instagram tracking URL noise | Low | Normalize to clean profile URL. |
| Overstating local expertise | Low | Phrase as representation in zones, not market dominance. |

## Rollback Plan

Revert the change commit. Static pages and constants are isolated; removing them will not affect the existing landing.

## Dependencies

- Instagram: `https://www.instagram.com/alfaropartners/`
- LinkedIn: `https://www.linkedin.com/in/jose-mar%C3%ADa-alfaro-agente-inmobiliario/`

## Success Criteria

- [ ] Social links are visible and point to the provided profiles.
- [ ] `/zonas/`, `/zonas/retiro/`, `/zonas/ibiza/`, and `/zonas/barrio-de-salamanca/` build.
- [ ] Home links to the zone pages.
- [ ] Each zone page has unique title, description, H1, local copy, and CTA.
