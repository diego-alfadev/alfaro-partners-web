# IONOS deployment

## Recommended path: IONOS Deploy Now

IONOS Deploy Now can deploy static websites from a GitHub repository, detects Astro projects, creates a GitHub Actions workflow, and publishes the generated output to IONOS infrastructure.

Project settings:

- Framework/template: Astro, or static site if manual selection is required.
- Install command: `bun install --frozen-lockfile`
- Build command: `PUBLIC_SITE_URL=https://alfaropartners.es PUBLIC_BASE_PATH=/ bun run build`
- Output/dist folder: `dist`
- Node requirement: `>=22.12.0`

Required production variables:

```bash
PUBLIC_SITE_URL=https://alfaropartners.es
PUBLIC_BASE_PATH=/
```

Use a non-root `PUBLIC_BASE_PATH` only if the site is deployed under a subdirectory.

## Manual webspace/SFTP path

If the project is deployed to classic IONOS Web Hosting instead of Deploy Now:

1. Build locally:
   ```bash
   PUBLIC_SITE_URL=https://alfaropartners.es bun run build:ionos
   ```
2. Upload the **contents** of `dist/` to the document root for the domain.
3. Keep `.htaccess` in the uploaded files; it provides directory-index hardening, security headers, caching and the 404 document.

## Pre-deploy checklist

- Use `PUBLIC_SITE_URL=https://alfaropartners.es`.
- Confirm the IONOS domain points to the deployment target.
- Confirm SSL is active before opening indexing.
- Confirm the Google Appointment Schedule URL still points to José María's live booking page.
- Replace provisional legal/privacy/cookie text before indexing those pages.
