import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { listingEntries, visibleListingEntries } from '../src/data/listings';
import { propertyPreviewNotices } from '../src/data/listings/preview-notices';
import { approvedListings } from './approved-listings';

// Preview copy describes remaining evidence, never changes the release decision.
assert.deepEqual(Object.keys(propertyPreviewNotices).sort(), listingEntries.map(({ listing }) => listing.publicId).sort());
assert.deepEqual(visibleListingEntries(false).map(({ listing }) => listing.publicId).sort(), [...approvedListings].sort());
assert.equal(visibleListingEntries(true).length, listingEntries.length);
for (const { listing } of listingEntries) {
  const notice = propertyPreviewNotices[listing.publicId];
  assert.ok(notice.pending.length >= 2, listing.publicId);
  assert.ok(notice.pending.some((text) => /disponibilidad/i.test(text)));
  assert.ok(notice.pending.some((text) => /aprobar|aprobación/i.test(text)));
  assert.doesNotMatch(JSON.stringify(notice), /019c90|bestflat|source_revision|sha256|Narváez|Baranda|Pelayo|Lope de Rueda/);
}
assert.match(propertyPreviewNotices['ap-l8v3'].confirmed!.join(' '), /211.*44/);
assert.doesNotMatch(propertyPreviewNotices['ap-l8v3'].pending.join(' '), /aportar.*energ|falta.*certificado|contrato nuevo/i);
assert.match(propertyPreviewNotices['ap-1744a0'].pending.join(' '), /misma vivienda.*valores/i);

const component = readFileSync(new URL('../src/components/property/PropertyPreviewNotice.astro', import.meta.url), 'utf8');
const hub = readFileSync(new URL('../src/pages/inmuebles/[routeKey].astro', import.meta.url), 'utf8');
assert.match(component, /<details[\s>]/);
assert.match(component, /<summary[\s>]/);
assert.doesNotMatch(component, /<details[^>]*\sopen(?:[\s=>]|$)|<script/);
assert.match(component, /notice\.pending\.map/);
assert.match(hub, /isDraft &&[\s\S]*?<PropertyPreviewNotice/);
assert.match(component, /:focus-visible/);
console.log('Preview notices validated: five factual disclosures, unchanged release gates and native no-JS accordion.');
