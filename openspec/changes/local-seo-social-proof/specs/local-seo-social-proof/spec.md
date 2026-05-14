# Delta for Local SEO and Social Proof

## ADDED Requirements

### Requirement: Social Profile Links

The site MUST expose the approved Instagram and LinkedIn profiles as trust signals.

#### Scenario: Footer exposes social profiles

- GIVEN a visitor reaches any site page
- WHEN the footer is inspected
- THEN Instagram and LinkedIn links MUST be visible
- AND each link MUST open the approved external profile in a new tab

#### Scenario: Social URLs are centralized

- GIVEN social links are used in templates
- WHEN the source is inspected
- THEN URLs SHOULD come from shared business constants

### Requirement: Madrid Zone Discovery

The site MUST introduce Madrid-centro zone positioning from the home page.

#### Scenario: Home links to zones

- GIVEN a visitor is on the home page
- WHEN the zones section is inspected
- THEN it MUST link to Retiro, Ibiza (Madrid), and Barrio de Salamanca pages
- AND the copy SHOULD frame the pages as local representation, not generic city guides

### Requirement: Zone Landing Pages

The site MUST provide distinct static landing pages for each priority zone.

#### Scenario: Zone page has SEO basics

- GIVEN a zone page is requested
- WHEN the HTML is inspected
- THEN it MUST include unique title, meta description, canonical URL, and exactly one H1

#### Scenario: Zone page balances lifestyle and conversion

- GIVEN a visitor reads a zone page
- WHEN they reach the page body
- THEN it MUST include lifestyle/context copy
- AND it MUST explain how representation helps owners, buyers, landlords, tenants, or investors
- AND it MUST include a booking CTA

#### Scenario: Zone index routes correctly

- GIVEN `/zonas/` is requested
- WHEN the page renders
- THEN it MUST link to all three zone landing pages
