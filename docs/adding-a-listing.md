# Adding a listing to production

What is on `main` is what is live: a push to `main` builds the site and uploads it to IONOS.
A listing is published only when **both keys** agree:

1. its data says it is ready (`readiness.ready: true`, no blockers, an energy rating, and confirmed availability; see `canPublishListing` in `src/lib/listings.ts`);
2. its `publicId` is listed in `scripts/approved-listings.ts`.

`bun run validate:listings` fails when the two disagree. CI runs it before every production
build, so a mismatch stops the deploy rather than the merge.

## Before you start: what the office must supply

The office gives these in the inventory spreadsheet. Do not publish without all four.

- **Energy certificate**: rating, plus consumption (kWh/m²·year) and emissions (kg CO₂/m²·year).
- **Availability** confirmed as of today.
- **Current price.** The drafts on `main` may carry an older figure than the latest curation.
- **Office approval**: `OK para publicar` in the `Publicacion WEB` column.

## Steps

1. **Branch** from `main`.
2. **Update the listing data.** Drafts from the photo intake live in `src/data/listings/intake-batch.ts`. Edit the entry in place:
   - set price, `availability: "available"`, `energy` and `readiness: { "ready": true, "blockers": [] }`;
   - keep `previewEligible: true`, and keep `supplier: "arctempus"` on Arctempus listings so the contract's collaboration line shows;
   - compare every figure with the latest curated listing in the private curation folder, outside this repository.
3. **Approve it.** Add the `publicId` to `scripts/approved-listings.ts`.
4. **Check the photos** in `src/assets/properties/<publicId>/`:
   - the folder must hold exactly the files the data declares;
   - file names must match `^[a-z-]+-(large|compact)\.webp$`;
   - `width` and `height` in the data must match the files.

   Then publish the lighter copies, which keeps the originals in the private masters folder:

   ```bash
   python3 scripts/optimize_media.py
   ```

   This needs `AP_MEDIA_MASTERS`. The webspace is 50 MB, so check what the listing adds with `du -sh src/assets/properties/<publicId>`.
5. **Verify locally:**

   ```bash
   bun run validate:listings
   ```

   ```bash
   bun test src/lib/
   ```

   Then open the page under `bun run dev`.
6. **Pull request → merge.** The push to `main` deploys. Open `https://alfaropartners.es/inmuebles/<routeKey>/` and check that the price, the energy data and the collaboration line are right.
7. **Tell the office.** Write the final URL in the spreadsheet's `URL FINAL` column by hand. Nothing writes it automatically yet.

## Withdrawing a listing

Remove its `publicId` from `scripts/approved-listings.ts` and set `readiness.ready` back to `false` (or add a blocker).
The next deploy stops generating its pages, and the upload removes their files from IONOS.
