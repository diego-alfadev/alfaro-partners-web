import { expect, test } from 'bun:test';
import { appendPreviewEntries, appendPreviewTours } from './generated-intake';
import { canPublishListing, type Listing } from './listings';
import type { TourScript } from './guided-tour';

const entry = (publicId: string, routeKey = publicId) => ({
  listing: { publicId, routeKey, energy: { rating: 'E' }, availability: 'available' } as Listing,
  readiness: { ready: false, blockers: ['Preview verification pending'] }, draftNotice: 'Preview only',
});

test('empty overlay preserves authored entries and tours', () => {
  const authored = [entry('original')];
  expect(appendPreviewEntries(authored, [])).toEqual(authored);
  const tours = [{ publicId: 'original' } as TourScript];
  expect(appendPreviewTours(tours, [], [])).toEqual(tours);
});

test('a generated PRE entry never becomes publishable even with energy and availability', () => {
  const generated = entry('new');
  const rows = appendPreviewEntries([entry('original')], [generated]);
  expect(rows.map(({ listing }) => listing.publicId)).toEqual(['original', 'new']);
  expect(canPublishListing(generated.listing, generated.readiness)).toBe(false);
  expect(appendPreviewTours([], [{ publicId: 'new' } as TourScript], [generated])).toHaveLength(1);
});

test('IDs, routes, readiness escalation and duplicate batches fail closed', () => {
  const original = entry('original', 'original-route');
  for (const generated of [entry('original'), entry('other', 'original-route'),
    { ...entry('new'), readiness: { ready: true, blockers: [] } },
    { ...entry('new'), readiness: { ready: false, blockers: [] } }]) {
    expect(() => appendPreviewEntries([original], [generated])).toThrow();
  }
  expect(() => appendPreviewEntries([], [entry('new'), entry('new')])).toThrow();
});

test('tours cannot replace an original or appear without their generated listing', () => {
  const tour = { publicId: 'new' } as TourScript;
  expect(() => appendPreviewTours([tour], [tour], [entry('new')])).toThrow();
  expect(() => appendPreviewTours([], [tour], [])).toThrow();
  expect(() => appendPreviewTours([], [tour, tour], [entry('new')])).toThrow();
});

test('explicit adoption replaces only the pinned identity without mutating authored entries', () => {
  const original = entry('original');
  const photo = { id: 'living', alt: 'Living', scene: 'living',
    large: { url: '/large.webp', width: 100, height: 80 },
    compact: { url: '/compact.webp', width: 50, height: 40 } };
  original.listing.media = { hero: photo, gallery: [photo] } as Listing['media'];
  const changed = structuredClone(original);
  changed.draftNotice = 'A new preview';
  const result = appendPreviewEntries([original], [changed], [{ publicId: 'original', routeKey: 'original' }]);
  expect(result).toEqual([changed]);
  expect(original.draftNotice).toBe('Preview only');
  expect(result[0]).not.toBe(original);
});

test('adoption cannot change route, drop original tour media or name unknown entries', () => {
  const original = entry('original');
  const photo = { id: 'living', alt: 'Living', scene: 'living',
    large: { url: '/large.webp', width: 100, height: 80 },
    compact: { url: '/compact.webp', width: 50, height: 40 } };
  original.listing.media = { hero: photo, gallery: [photo] } as Listing['media'];
  for (const bad of [
    [{ publicId: 'missing', routeKey: 'missing' }],
    [{ publicId: 'original', routeKey: 'changed' }],
    [{ publicId: 'original', routeKey: 'original' }, { publicId: 'original', routeKey: 'original' }],
  ]) expect(() => appendPreviewEntries([original], [structuredClone(original)], bad)).toThrow();
  const changed = structuredClone(original);
  changed.listing.media.gallery[0]!.large.url = '/different.webp';
  expect(() => appendPreviewEntries([original], [changed], [{ publicId: 'original', routeKey: 'original' }])).toThrow();
});
