import { describe, expect, test } from 'bun:test';
import {
  categoricalOptions,
  factsOf,
  filtersFromParams,
  filtersToParams,
  hasActiveFilters,
  listingMatches,
  type ListingFacts,
} from './listing-search';
import type { Listing } from './listings';

const facts = (overrides: Partial<ListingFacts> = {}): ListingFacts => ({
  price: 929000,
  bedrooms: 2,
  area: 72,
  operation: 'sale',
  type: 'apartment',
  zone: 'ibiza-retiro',
  ...overrides,
});

const listing = (overrides: Partial<Listing> & { zone?: [string, string] }): Listing => {
  const [neighborhood, district] = overrides.zone ?? ['Ibiza', 'Retiro'];
  return {
    publicId: 'ap-x',
    routeKey: 'x',
    propertyType: 'apartment',
    transaction: 'sale',
    availability: 'available',
    location: { displayName: neighborhood, neighborhood, district, city: 'Madrid', precision: 'neighborhood' },
    price: { amount: 929000, currency: 'EUR' },
    area: { squareMeters: 72, measurement: 'usable' },
    rooms: { bedrooms: 2, bathrooms: 2 },
    ...overrides,
  } as Listing;
};

describe('filter params', () => {
  test('reads the Spanish query keys into typed filters', () => {
    const filters = filtersFromParams(new URLSearchParams('precio=1000000&dormitorios=3&superficie=90&tipo=house&zona=chamberi&operacion=rent'));
    expect(filters).toEqual({ priceMax: 1000000, bedroomsMin: 3, areaMin: 90, type: 'house', zone: 'chamberi', operation: 'rent' });
  });

  test('drops values that are not positive numbers or known enums instead of throwing', () => {
    const filters = filtersFromParams(new URLSearchParams('precio=abc&dormitorios=-1&superficie=0&tipo=castle&operacion=swap&zona='));
    expect(filters).toEqual({});
  });

  test('serializes in a stable key order and omits empty filters', () => {
    const params = filtersToParams({ areaMin: 90, priceMax: 1500000, zone: 'ibiza-retiro' });
    expect(params.toString()).toBe('zona=ibiza-retiro&precio=1500000&superficie=90');
    expect(filtersToParams({}).toString()).toBe('');
  });

  test('round-trips', () => {
    const filters = { priceMax: 750000, bedroomsMin: 2, areaMin: 60, operation: 'sale', type: 'apartment', zone: 'a' } as const;
    expect(filtersFromParams(filtersToParams(filters))).toEqual(filters);
  });

  test('reports whether any filter is set', () => {
    expect(hasActiveFilters({})).toBe(false);
    expect(hasActiveFilters({ priceMax: 1 })).toBe(true);
  });
});

describe('listingMatches', () => {
  test('no filters matches everything', () => {
    expect(listingMatches(facts(), {})).toBe(true);
  });

  test('price is an inclusive ceiling', () => {
    expect(listingMatches(facts({ price: 1000000 }), { priceMax: 1000000 })).toBe(true);
    expect(listingMatches(facts({ price: 1000001 }), { priceMax: 1000000 })).toBe(false);
  });

  test('bedrooms and area are inclusive floors', () => {
    expect(listingMatches(facts({ bedrooms: 3 }), { bedroomsMin: 3 })).toBe(true);
    expect(listingMatches(facts({ bedrooms: 2 }), { bedroomsMin: 3 })).toBe(false);
    expect(listingMatches(facts({ area: 90 }), { areaMin: 90 })).toBe(true);
    expect(listingMatches(facts({ area: 89 }), { areaMin: 90 })).toBe(false);
  });

  test('categorical filters need an exact match and combine with AND', () => {
    expect(listingMatches(facts(), { type: 'apartment', zone: 'ibiza-retiro' })).toBe(true);
    expect(listingMatches(facts(), { type: 'house' })).toBe(false);
    expect(listingMatches(facts(), { operation: 'rent' })).toBe(false);
    expect(listingMatches(facts(), { priceMax: 2000000, zone: 'chamberi' })).toBe(false);
  });
});

describe('factsOf', () => {
  test('projects a listing onto the searchable facts with a slug for the zone', () => {
    expect(factsOf(listing({ zone: ['Ibiza', 'Retiro'] }))).toEqual(facts());
    expect(factsOf(listing({ zone: ['Castellana', 'Chamartín'] })).zone).toBe('castellana-chamartin');
  });
});

describe('categoricalOptions', () => {
  test('returns no options for a field with fewer than two distinct values', () => {
    const options = categoricalOptions([listing({}), listing({ price: { amount: 1, currency: 'EUR' } })]);
    expect(options).toEqual({ operation: [], type: [], zone: [] });
  });

  test('lists distinct values with Spanish labels once the catalogue varies', () => {
    const options = categoricalOptions([
      listing({}),
      listing({ propertyType: 'house', transaction: 'rent', zone: ['Castellana', 'Chamartín'] }),
    ]);
    expect(options.type).toEqual([{ value: 'apartment', label: 'Piso' }, { value: 'house', label: 'Casa' }]);
    expect(options.operation).toEqual([{ value: 'sale', label: 'Comprar' }, { value: 'rent', label: 'Alquilar' }]);
    expect(options.zone).toEqual([
      { value: 'ibiza-retiro', label: 'Ibiza · Retiro' },
      { value: 'castellana-chamartin', label: 'Castellana · Chamartín' },
    ]);
  });
});
