import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ListingImage, ListingMediaSource } from '../src/lib/listings';
import { ibizaListing, ibizaListingReleaseReadiness } from '../src/data/listings/ibiza-ap-k7r2';
import { canPublishListing, listingImages } from '../src/lib/listings';
import { listingEntries, visibleListingEntries } from '../src/data/listings';
import { ibizaRetiroListing, ibizaRetiroReleaseReadiness } from '../src/data/listings/ibiza-retiro-ap-l8v3';
import { approvedListings } from './approved-listings';

const root = new URL('..', import.meta.url).pathname;
const serialized = JSON.stringify(ibizaListing);

assert.match(ibizaListing.publicId, /^ap-[a-z0-9]{4,}$/);
assert.equal(ibizaListing.routeKey, `ibiza-madrid-${ibizaListing.publicId}`);
assert.equal(ibizaListing.location.precision, 'neighborhood');
assert.doesNotMatch(serialized, /men[eé]ndez|pelayo|(?:^|\D)27(?:\D|$)|5\s?d\b/i);
assert.equal(ibizaListing.availability, 'available');
assert.equal(ibizaListing.energy.rating, null);
assert.equal(ibizaListing.area.measurement, 'usable');
assert.equal(ibizaListing.price.amount, 929000);
assert.equal(ibizaListing.area.squareMeters, 72);
assert.deepEqual(ibizaListing.rooms, { bedrooms: 2, bathrooms: 2 });
assert.match(ibizaListing.editorial.summary, /72 m² útiles/);
assert.doesNotMatch(serialized, /aire acondicionado|air.condition/i);
assert.equal(ibizaListing.media.film, null);
assert.equal(ibizaListing.media.virtualTour, null);
assert.equal(ibizaListing.media.slides, null);
assert.equal(ibizaListing.media.dossier, null);
assert.equal(ibizaListing.media.floorPlan, null);
assert.equal(ibizaListingReleaseReadiness.ready, false);
assert.deepEqual(ibizaListingReleaseReadiness.blockers, [
  'Energy label and certificate have not been received and verified.',
]);
assert.equal(canPublishListing(ibizaListing, ibizaListingReleaseReadiness), false);
const formerPublicDirectory = join(root, 'public/images/properties', ibizaListing.publicId);
assert.ok(!existsSync(formerPublicDirectory) || readdirSync(formerPublicDirectory).length === 0);

function checkSource(source: ListingMediaSource) {
  assert.match(source.url, /^\/(?:inmuebles\/media\/[a-z0-9/-]+|images\/[a-z0-9/-]+)\.webp$/);
  assert.ok(source.width > 0 && source.height > 0);
  const filePath = source.url.startsWith('/inmuebles/media/')
    ? join(root, 'src/assets/properties', source.url.split('/').slice(-2).join('/'))
    : join(root, 'public', source.url);
  assert.ok(existsSync(filePath), `Missing ${source.url}`);
  const bytes = readFileSync(filePath);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.doesNotMatch(bytes.toString('latin1'), /EXIF|XMP |ICC_PROFILE|menendez|pelayo/i);
}

function checkImage(image: ListingImage) {
  assert.ok(image.alt.length > 8);
  checkSource(image.large);
  checkSource(image.compact);
}

assert.equal(ibizaListing.media.gallery.length, 12);
checkImage(ibizaListing.media.hero);
for (const image of ibizaListing.media.gallery) checkImage(image);
if (ibizaListing.contact.portrait) checkSource(ibizaListing.contact.portrait);

console.log(`Validated ${ibizaListing.routeKey}: ${ibizaListing.media.gallery.length} public-safe photographs, release blocked.`);

assert.equal(new Set(listingEntries.map(({ listing }) => listing.publicId)).size, listingEntries.length);
assert.equal(new Set(listingEntries.map(({ listing }) => listing.routeKey)).size, listingEntries.length);
assert.deepEqual(visibleListingEntries(false).map(({ listing }) => listing.publicId).sort(), [...approvedListings].sort());
assert.equal(visibleListingEntries(true).length, listingEntries.length);
assert.equal(ibizaRetiroListing.publicId, 'ap-l8v3');
assert.equal(ibizaRetiroListing.routeKey, 'ibiza-retiro-madrid-ap-l8v3');
assert.equal(ibizaRetiroListing.price.amount, 1049000);
assert.equal(ibizaRetiroListing.area.squareMeters, 88);
assert.equal(ibizaRetiroListing.area.measurement, 'unspecified');
assert.equal(ibizaRetiroListing.availability, 'available');
assert.deepEqual(ibizaRetiroListing.rooms, { bedrooms: 2, bathrooms: 2 });
assert.deepEqual(ibizaRetiroListing.energy, {
  rating: 'E', consumptionKwhPerSquareMeterYear: 211, emissionsKgPerSquareMeterYear: 44,
});
assert.equal(ibizaRetiroListing.contact.kind, 'team');
assert.equal(ibizaRetiroListing.contact.portrait, null);
assert.equal(ibizaRetiroListing.contact.profileUrl, null);
assert.equal(ibizaRetiroReleaseReadiness.ready, true);
assert.equal(canPublishListing(ibizaRetiroListing, ibizaRetiroReleaseReadiness), true);
assert.equal(canPublishListing({ ...ibizaRetiroListing, availability: 'available' }, { ready: true, blockers: [] }), true,
  'Qualified unspecified area is not a separate publication gate');
assert.doesNotMatch(JSON.stringify(ibizaRetiroListing), /lope|rueda|4\s?ci\b|suroeste|sureste|130|112503941|019c90b7/i);
assert.deepEqual(ibizaRetiroListing.features?.map(({ label }) => label), ['Climatización', 'Calefacción', 'Edificio', 'Situación', 'Equipamiento']);
assert.equal(ibizaRetiroListing.media.gallery.length, 13);
for (const { listing, readiness } of listingEntries) {
  assert.match(listing.publicId, /^ap-[a-z0-9]{4,}$/);
  assert.equal(listing.location.precision, 'neighborhood');
  assert.equal(canPublishListing(listing, readiness), approvedListings.includes(listing.publicId), listing.publicId);
  assert.equal(listing.media.film, null);
  assert.equal(listing.media.dossier, null);
  const expected = new Set(listingImages(listing).flatMap((photo) => [photo.large.url, photo.compact.url])
    .map((url) => url.split('/').at(-1)!));
  const files = readdirSync(join(root, 'src/assets/properties', listing.publicId));
  assert.deepEqual(new Set(files), expected, `Media directory differs for ${listing.publicId}`);
  for (const photo of listingImages(listing)) {
    for (const source of [photo.large, photo.compact]) assert.ok(source.url.startsWith(`/inmuebles/media/${listing.publicId}/`));
    checkImage(photo);
  }
  assert.ok(listing.media.gallery.includes(listing.media.hero));
  console.log(`Registry validated ${listing.publicId}: ${listing.media.gallery.length} images, independent draft.`);
}
