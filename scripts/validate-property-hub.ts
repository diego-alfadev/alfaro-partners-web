import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ibizaRetiroListing } from '../src/data/listings/ibiza-retiro-ap-l8v3';
import { ibizaListing } from '../src/data/listings/ibiza-ap-k7r2';
import { listingImages, canPublishListing } from '../src/lib/listings';
import { listingEntries } from '../src/data/listings';
import { tourScripts } from '../src/data/tours';

const root = new URL('..', import.meta.url).pathname;

// Media inventory and release gates.
assert.equal(ibizaRetiroListing.media.gallery.length, 13);
assert.equal(ibizaRetiroListing.media.reportImages?.length, 3);
assert.equal(listingImages(ibizaRetiroListing).length, 16);
assert.equal(new Set(listingImages(ibizaRetiroListing).map(({ id }) => id)).size, 16);
assert.equal(listingImages(ibizaListing).length, 12);
for (const { listing, readiness } of listingEntries) {
  assert.equal(canPublishListing(listing, readiness), listing.publicId === 'ap-l8v3', listing.publicId);
  assert.equal(listing.media.dossier, null);
  const images = listingImages(listing);
  assert.deepEqual(new Set(readdirSync(join(root, 'src/assets/properties', listing.publicId))), new Set(images.flatMap(({ compact, large }) => [compact.url, large.url]).map((url) => url.split('/').at(-1)!)));
  for (const image of images) {
    assert.doesNotMatch(JSON.stringify(image), /lope|rueda|112503941|4\s?ci|menendez|pelayo|facade|exterior/i);
    for (const source of [image.compact, image.large]) {
      const data = readFileSync(join(root, 'src/assets/properties', listing.publicId, source.url.split('/').at(-1)!));
      assert.equal(data.toString('ascii', 8, 12), 'WEBP');
      assert.doesNotMatch(data.toString('latin1'), /EXIF|XMP |ICC_PROFILE|Lope de Rueda/i);
    }
  }
  // Every listing in the registry has a guided tour, so every hub shows the tour block.
  assert.ok(tourScripts.some((script) => script.publicId === listing.publicId), `No guided tour for ${listing.publicId}`);
}

// One structure for every hub: hero → introduction → data → guided tour → gallery → contact.
const hub = readFileSync(join(root, 'src/pages/inmuebles/[routeKey].astro'), 'utf8');
const order = ['id="inicio"', 'id="la-vivienda"', 'id="detalles"', 'id="visita-guiada"', 'id="galeria"', 'id="visita"'].map((id) => hub.indexOf(id));
assert.ok(order.every((at) => at > 0), 'Every hub section is present');
assert.deepEqual([...order].sort((a, b) => a - b), order, 'Hub sections keep the shared order');
assert.match(hub, /href=\{tourHref\}>Visita guiada/);
assert.match(hub, /href=\{`\$\{tourHref\}#\$\{stop\.id\}`\}/);
assert.match(hub, /reportaje\/guiada\//);
assert.match(hub, /property-intro--editorial.*listing.publicId === "ap-l8v3"/);
const propertyCSS = readFileSync(join(root, 'src/styles/property.css'), 'utf8');
assert.match(propertyCSS, /\.property-intro--editorial \.property-intro__copy \{ display: grid;/);
assert.match(propertyCSS, /\.property-guided__card/);

// H3–H5: keep the hub quiet without removing navigation or accessible photo names.
const polishFailures: string[] = [];
for (const [name, check] of [
  ['H3', () => {
    const backTop = hub.indexOf('data-property-back-top');
    assert.ok(backTop > hub.indexOf('id="galeria"') && backTop < hub.indexOf('id="visita"'), 'Back-to-top follows the gallery in document flow');
    assert.match(propertyCSS, /@media \(min-width: 761px\)\s*\{\s*\.property-back-top\.is-enhanced\s*\{\s*position: fixed;/, 'Floating enhancement is desktop-only');
  }],
  ['H4', () => {
    assert.doesNotMatch(hub, />Ampliar ↗<\/span>/, 'No repeated visible enlarge labels');
    assert.match(hub, /listing\.media\.gallery\[index - 1\]\?\.scene !== photo\.scene/, 'Scene labels appear only at the start of each consecutive group');
    assert.match(hub, /aria-label=\{`Ampliar fotografía/);
    assert.match(propertyCSS, /\.property-gallery__item a:focus-visible \.property-gallery__inspect/);
  }],
  ['H5', () => {
    assert.equal(ibizaListing.editorial.title, 'Salón y cocina integrados en Ibiza, Retiro');
    assert.equal(ibizaRetiroListing.editorial.title, 'Una vivienda con isla en Ibiza, Retiro');
  }],
] as const) {
  try { check(); } catch (error) { polishFailures.push(`${name}: ${(error as Error).message}`); }
}
assert.deepEqual(polishFailures, [], 'Hub polish regressions');

// Retired routes and their pieces stay archived in pilots/.
for (const retired of [
  'src/pages/inmuebles/[routeKey]/reportaje.astro', 'src/styles/property-report.css',
  'src/pages/inmuebles/[routeKey]/reportaje/visita.astro',
]) assert.ok(!existsSync(join(root, retired)), `Retired file is back: ${retired}`);
assert.doesNotMatch(hub + propertyCSS, /property-tour|property-report|photographicChapters|guidedScenes|reportChapters/);

console.log('Hub validated: shared section order, guided tour block for every listing, media and release gates preserved; report and in-page scene retired.');
