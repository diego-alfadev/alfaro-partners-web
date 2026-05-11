# Delta for Launch Hardening

## ADDED Requirements

### Requirement: SEO Metadata Readiness

The site MUST expose launch-ready metadata for the published GitHub Pages URL.

#### Scenario: Home metadata is shareable

- GIVEN the published home page is requested
- WHEN the HTML is inspected
- THEN it MUST include `title`, `description`, `canonical`, `og:url`, `og:title`, `og:description`, absolute `og:image`, and Twitter card metadata
- AND URLs MUST resolve correctly under `/alfaro-partners-web/`

#### Scenario: Schema describes the brand/person

- GIVEN the published home page is requested
- WHEN JSON-LD is inspected
- THEN it MUST include RealEstateAgent/Person information for José María Alfaro
- AND it MUST use the effective published URL and image URL

### Requirement: Indexing Files

The site MUST provide basic crawler guidance for launch.

#### Scenario: Robots file is available

- GIVEN `/alfaro-partners-web/robots.txt` is requested
- WHEN GitHub Pages serves the file
- THEN it MUST return HTTP 200
- AND it SHOULD reference the sitemap index URL

#### Scenario: Sitemap remains available

- GIVEN `/alfaro-partners-web/sitemap-index.xml` is requested
- WHEN GitHub Pages serves the file
- THEN it MUST return HTTP 200

### Requirement: Production Links Have No Dead Placeholders

The site MUST NOT expose dead placeholder links in launch-critical navigation or footer surfaces.

#### Scenario: Footer links are valid or absent

- GIVEN the home page footer is inspected
- WHEN legal/privacy/cookie entries are visible
- THEN each visible link MUST point to a real local page or approved external URL
- AND no visible footer link MAY use `href="#"`

#### Scenario: Booking CTAs route consistently

- GIVEN any booking CTA is inspected
- WHEN its `href` is read
- THEN it MUST point to the configured booking destination
- AND all booking CTAs SHOULD use the same source constant

### Requirement: Asset Delivery Remains Intact

The site MUST continue serving Astro-generated CSS and public assets on GitHub Pages.

#### Scenario: Astro CSS loads after hardening

- GIVEN the home page references an `_astro/*.css` asset
- WHEN that asset URL is requested
- THEN it MUST return HTTP 200 with `text/css`

#### Scenario: Public images load under base path

- GIVEN the home page references hero/logo images
- WHEN those asset URLs are requested
- THEN they MUST return HTTP 200
