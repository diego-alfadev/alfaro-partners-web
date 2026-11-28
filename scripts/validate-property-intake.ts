import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { intakeDrafts, intakeListingEntries } from '../src/data/listings/intake-batch';
import { intakeTours } from '../src/data/tours/intake-batch';
import { listingEntries, visibleListingEntries } from '../src/data/listings';
import { tourScripts } from '../src/data/tours';
import { canPublishListing, listingImages } from '../src/lib/listings';
import { resolveShot } from '../src/lib/guided-tour';
import { approvedListings } from './approved-listings';
assert.deepEqual(visibleListingEntries(false).map(({ listing }) => listing.publicId).sort(), [...approvedListings].sort(), 'Only explicitly approved listings reach production');
assert.equal(visibleListingEntries(true).length, listingEntries.length);
for (const draft of intakeDrafts) {
  const { listing, readiness, previewEligible } = draft;
  assert.match(listing.publicId, /^ap-[a-z0-9]{4,}$/);
  const approved = approvedListings.includes(listing.publicId);
  assert.equal(canPublishListing(listing, readiness), approved, listing.publicId);
  if (!approved) {
    assert.equal(listing.availability, 'unconfirmed');
    assert.equal(listing.energy.rating, null);
  }
  assert.equal(listing.location.precision, 'neighborhood');
  assert.doesNotMatch(JSON.stringify(listing), /narv[aá]ez|baranda|019c90|bestflat|source_revision|sha256|4\s?ci\b|1\s18\b/i);
  assert.equal(intakeListingEntries.includes(draft), previewEligible);
  if (!approved) assert.match(draft.draftNotice, /pendiente/i);
  const tour = intakeTours.find(({ publicId }) => publicId === listing.publicId)!;
  assert.ok(tour);
  assert.equal(tourScripts.includes(tour), previewEligible);
  assert.equal(tour.acts[0]?.template, 'cover');
  assert.equal(tour.acts.at(-1)?.template, 'close');
  assert.equal(new Set(tour.acts.map(({ id }) => id)).size, tour.acts.length);
  for (const act of tour.acts) {
    assert.ok(!('clip' in act), 'New tours remain photographic, without generated clips');
    const shots = 'shots' in act ? act.shots : 'shot' in act ? [act.shot] : [];
    for (const shot of shots) assert.ok(resolveShot(listing, shot).image);
  }
  const images = listingImages(listing);
  assert.ok(images.length >= 7);
  assert.ok(listing.media.gallery.includes(listing.media.hero));
  const directory = join('src/assets/properties', listing.publicId);
  assert.deepEqual(new Set(readdirSync(directory)), new Set(images.flatMap(({ large, compact }) => [large.url, compact.url]).map((url) => url.split('/').at(-1)!)));
  for (const image of images) {
    assert.ok(image.id && image.alt.length > 8);
    for (const media of [image.large, image.compact]) {
      const filename = media.url.split('/').at(-1)!;
      assert.match(filename, /^[a-z-]+-(large|compact)\.webp$/);
      const bytes = readFileSync(join(directory, filename));
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.doesNotMatch(bytes.toString('latin1'), /EXIF|XMP |ICC_PROFILE/);
      assert.ok(media.width > 0 && media.height > 0);
    }
  }
}
console.log(`Intake validated: ${intakeDrafts.length} photographic drafts, ${intakeListingEntries.length} in PRE, only approved listings in production.`);
