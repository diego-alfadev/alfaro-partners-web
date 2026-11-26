import assert from 'node:assert/strict';
import { ibizaListing } from '../src/data/listings/ibiza-ap-k7r2';
import { listingEntries } from '../src/data/listings';
import { listingMetadata, listingSchema, offerAvailability } from '../src/lib/listing-seo';

assert.equal(listingMetadata(ibizaListing).title, 'Piso en venta en Ibiza, Retiro, Madrid | Alfaro & Partners');
for (const transaction of ['sale', 'rent'] as const) {
  for (const availability of ['available', 'reserved', 'sold', 'unconfirmed'] as const) {
    const listing = { ...ibizaListing, transaction, availability };
    const seo = listingSchema(listing, 'https://example.test/pre/inmuebles/example/', 'https://example.test/pre/', 'https://example.test/pre/photo.webp');
    const [property, offer] = seo.entities;
    assert.equal(offer.itemOffered['@id'], property['@id']);
    assert.equal(seo.page.mainEntity['@id'], property['@id']);
    assert.equal(offer.availability, offerAvailability(availability));
    assert.equal('availability' in offer, availability !== 'unconfirmed');
    assert.equal('additionalProperty' in property, false);
    assert.equal(offer.seller['@id'], 'https://example.test/pre/#organization');
    assert.match(offer.businessFunction, transaction === 'sale' ? /#Sell$/ : /#LeaseOut$/);
    assert.match(listingMetadata(listing).title, transaction === 'sale' ? /en venta/ : /en alquiler/);
  }
}
assert.equal(offerAvailability('reserved'), 'https://schema.org/Reserved');
const synthetic = listingSchema({ ...ibizaListing, propertyType: 'house', energy: { rating: 'A' } }, 'https://example.test/property/', 'https://example.test/', 'https://example.test/photo.webp');
assert.equal(synthetic.entities[0]['@type'], 'House');
assert.equal(synthetic.entities[0].additionalProperty?.value, 'A');
assert.equal(listingMetadata({ ...ibizaListing, location: { ...ibizaListing.location, city: 'Madrid', district: 'Madrid' } }).title.match(/Madrid/g)?.length, 1);
console.log('Property SEO variants passed: sale/rent, all availability states, linked identities, energy omission, public title.');

for (const { listing } of listingEntries) {
  assert.equal(listingMetadata(listing).title, 'Piso en venta en Ibiza, Retiro, Madrid | Alfaro & Partners');
  assert.doesNotMatch(JSON.stringify(listingMetadata(listing)), /lope|rueda|men[eé]ndez|pelayo/i);
  for (const transaction of ['sale', 'rent'] as const) {
    for (const availability of ['available', 'reserved', 'sold', 'unconfirmed'] as const) {
      const variant = { ...listing, transaction, availability };
      const url = `https://example.test/pre/inmuebles/${listing.routeKey}/`;
      const graph = listingSchema(variant, url, 'https://example.test/pre/', `https://example.test${listing.media.hero.large.url}`);
      assert.equal(graph.entities[0]['@id'], `${url}#property`);
      assert.equal(graph.entities[1]['@id'], `${url}#offer`);
      assert.equal(graph.page.mainEntity['@id'], graph.entities[0]['@id']);
      assert.equal(graph.entities[1].availability, offerAvailability(availability));
      assert.equal(graph.entities[1].itemOffered['@id'], graph.entities[0]['@id']);
      assert.equal(graph.entities[0].additionalProperty?.value, listing.energy.rating ?? undefined);
      assert.equal(graph.entities[0].floorSize.value, listing.area.squareMeters);
    }
  }
}
console.log('Both independent property SEO identities and variants passed.');
