import type { Listing } from './listings';

export type ListingFilters = {
  priceMax?: number;
  bedroomsMin?: number;
  areaMin?: number;
  operation?: Listing['transaction'];
  type?: Listing['propertyType'];
  zone?: string;
};

/** What a card exposes to the matcher; the server renders it into data attributes, the client reads it back. */
export type ListingFacts = {
  price: number;
  bedrooms: number;
  area: number;
  operation: Listing['transaction'];
  type: Listing['propertyType'];
  zone: string;
};

export type FilterOption = { value: string; label: string };

export const PRICE_STEPS = [500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000] as const;
export const BEDROOM_STEPS = [1, 2, 3, 4] as const;
export const AREA_STEPS = [60, 90, 120, 150, 200] as const;

const OPERATIONS = ['sale', 'rent'] as const;
const TYPES = ['apartment', 'house'] as const;

const OPERATION_LABEL: Record<Listing['transaction'], string> = { sale: 'Comprar', rent: 'Alquilar' };
const TYPE_LABEL: Record<Listing['propertyType'], string> = { apartment: 'Piso', house: 'Casa' };

const positiveNumber = (value: string | null): number | undefined => {
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const oneOf = <T extends string>(allowed: readonly T[], value: string | null): T | undefined =>
  allowed.find((option) => option === value);

export function filtersFromParams(params: URLSearchParams): ListingFilters {
  const filters: ListingFilters = {};
  const priceMax = positiveNumber(params.get('precio'));
  const bedroomsMin = positiveNumber(params.get('dormitorios'));
  const areaMin = positiveNumber(params.get('superficie'));
  const operation = oneOf(OPERATIONS, params.get('operacion'));
  const type = oneOf(TYPES, params.get('tipo'));
  const zone = params.get('zona');
  if (priceMax !== undefined) filters.priceMax = priceMax;
  if (bedroomsMin !== undefined) filters.bedroomsMin = bedroomsMin;
  if (areaMin !== undefined) filters.areaMin = areaMin;
  if (operation) filters.operation = operation;
  if (type) filters.type = type;
  if (zone) filters.zone = zone;
  return filters;
}

export function filtersToParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.operation) params.set('operacion', filters.operation);
  if (filters.type) params.set('tipo', filters.type);
  if (filters.zone) params.set('zona', filters.zone);
  if (filters.priceMax) params.set('precio', String(filters.priceMax));
  if (filters.bedroomsMin) params.set('dormitorios', String(filters.bedroomsMin));
  if (filters.areaMin) params.set('superficie', String(filters.areaMin));
  return params;
}

export const hasActiveFilters = (filters: ListingFilters): boolean => Object.keys(filters).length > 0;

export function listingMatches(facts: ListingFacts, filters: ListingFilters): boolean {
  if (filters.priceMax !== undefined && facts.price > filters.priceMax) return false;
  if (filters.bedroomsMin !== undefined && facts.bedrooms < filters.bedroomsMin) return false;
  if (filters.areaMin !== undefined && facts.area < filters.areaMin) return false;
  if (filters.operation !== undefined && facts.operation !== filters.operation) return false;
  if (filters.type !== undefined && facts.type !== filters.type) return false;
  if (filters.zone !== undefined && facts.zone !== filters.zone) return false;
  return true;
}

const slug = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const zoneOf = (listing: Listing) => ({
  value: slug(`${listing.location.neighborhood} ${listing.location.district}`),
  label: `${listing.location.neighborhood} · ${listing.location.district}`,
});

export function factsOf(listing: Listing): ListingFacts {
  return {
    price: listing.price.amount,
    bedrooms: listing.rooms.bedrooms,
    area: listing.area.squareMeters,
    operation: listing.transaction,
    type: listing.propertyType,
    zone: zoneOf(listing).value,
  };
}

const distinct = (options: FilterOption[]) =>
  options.filter((option, index) => options.findIndex((other) => other.value === option.value) === index);

/** A categorical field is only worth a control once the catalogue offers a real choice. */
const onlyIfChoice = (options: FilterOption[]) => (options.length >= 2 ? options : []);

export function categoricalOptions(listings: Listing[]) {
  return {
    operation: onlyIfChoice(distinct(listings.map((l) => ({ value: l.transaction, label: OPERATION_LABEL[l.transaction] })))),
    type: onlyIfChoice(distinct(listings.map((l) => ({ value: l.propertyType, label: TYPE_LABEL[l.propertyType] })))),
    zone: onlyIfChoice(distinct(listings.map(zoneOf))),
  };
}
