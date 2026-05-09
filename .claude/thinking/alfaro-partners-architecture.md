# Idea: Alfaro & Partners - Premium Web Architecture

> A high-conversion, premium personal brand platform with SEO capabilities, avoiding the overhead of traditional CMSs like WordPress.

## The Problem

José María Alfaro needs a digital presence that reflects 20+ years of institutional authority in real estate. The site needs to generate trust, handle contact frictionlessly, and rank via SEO (blogging). However, traditional solutions (WordPress) introduce high maintenance, security risks, and complex interfaces for non-technical users.

## The Solution

A static-site generated (SSG) frontend using Astro and the "Digital Obsidian" aesthetic. Since the content strategy is limited to 4-5 fixed "Vision/Opinion" articles, we are dropping any external Headless CMS dependency. Content will be managed via local Markdown/MDX files in the repository. This provides maximum performance, perfect technical SEO, and zero maintenance overhead.

## Target Users

High-net-worth individuals, investors, and property owners seeking ethical, high-level real estate representation, initially captured via physical interactions (business cards, events).

## Competition & Differentiation

Most real estate agent sites are generic templates with aggressive lead-capture popups. This platform differentiates through "Private Banking" aesthetics, radical transparency, and an editorial presentation of authority.

## Riskiest Assumptions

- The client will actually produce regular content for SEO (if not, the blog infrastructure is over-engineering).
- A Notion-based authoring flow will be adopted easily by the client.

## MVP Scope

- Single-page core structure (Day 0 prototype already validated).
- Integration with Calendly / Direct WhatsApp.
- 4-5 static "Authority/Vision" articles hardcoded via Astro MDX (No CMS required).
- Privacy-friendly analytics (Plausible).

## Design System Updates

Based on stakeholder feedback, the "Digital Obsidian" system will be adapted to:
- **Base Color:** `#0e192a` (Navy Blue from the logo).
- **Text Color:** `#eeeceb` (Off-white).
- **Typography:** `Times New Roman` (Headings) and `Satoshi Variable` (Body/UI).
- **Accents:** Gold accents will be retained as part of the extended brand palette to soften the design and maintain the "Private Banking" aesthetic.
- Integration with Calendly / Direct WhatsApp.
- Base integration of the blog section using Markdown/Notion.
- Privacy-friendly analytics (Plausible).

## Possible Directions

### Direction 1: Astro + Local MDX + Plausible (Coolify)
The recommended path. Astro delivers ultra-fast static HTML (perfect for SEO). Since the blog requirement has been reduced to 4-5 static articles, we drop the Notion API and simply use local MDX files. Plausible Analytics is self-hosted on the existing Coolify server.

### Direction 2: Astro + Decap CMS
If they later decide they want to edit the 4-5 articles themselves, we can add Decap CMS (free, Git-based) over the Astro project without changing the architecture.

## Open Questions

- [ ] Will `Times New Roman` look too dated on the web compared to the logo? We may need to test it visually or fall back to a web-optimized serif if it fails to look premium.
- [ ] How exactly do we execute the "marble dark blue obsidian" texture without breaking performance or making the site look cluttered?

## Next Steps

- Await client response to the WhatsApp questions regarding content volume.
- Update the `DESIGN.md` spec to include the "marble dark blue obsidian" lighting/texture guidelines.
- Spin up Plausible on Coolify to have the tracking ready.
