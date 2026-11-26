import type { Listing, ListingImage, ListingReleaseReadiness } from '../../lib/listings';

// Exposed only by the conditional static media endpoint, never copied from public/.
const mediaRoot = '/inmuebles/media/ap-k7r2';

function image(
  id: string,
  name: string,
  alt: string,
  scene: ListingImage['scene'],
  large: [number, number],
  compact: [number, number],
): ListingImage {
  return {
    id,
    alt,
    scene,
    large: { url: `${mediaRoot}/${name}-large.webp`, width: large[0], height: large[1] },
    compact: { url: `${mediaRoot}/${name}-compact.webp`, width: compact[0], height: compact[1] },
  };
}

const photos: ListingImage[] = [
  image('img-q3v8', 'living-overview', 'Salón y comedor con cocina integrada', 'living', [1800, 1201], [800, 534]),
  image('img-r6m2', 'living-kitchen', 'Zona de estar abierta a la cocina', 'living', [1800, 1201], [800, 534]),
  image('img-w4k9', 'kitchen-front', 'Frente de cocina con armarios integrados', 'kitchen', [1800, 1201], [800, 534]),
  image('img-z7p1', 'kitchen-dining', 'Cocina y comedor vistos desde el salón', 'kitchen', [1800, 1201], [800, 534]),
  image('img-h2n6', 'dining-perspective', 'Comedor y cocina desde el extremo opuesto', 'kitchen', [1800, 1201], [800, 534]),
  image('img-u8c3', 'bedroom-one', 'Primer dormitorio con ventana', 'bedroom', [1800, 1201], [800, 534]),
  image('img-y5t7', 'bedroom-two', 'Segundo dormitorio con cama y armario', 'bedroom', [1800, 1201], [800, 534]),
  image('img-g9d4', 'bedroom-two-perspective', 'Segundo dormitorio desde la entrada', 'bedroom', [1800, 1201], [800, 534]),
  image('img-x1f5', 'bathroom-one', 'Primer baño con lavabo y ducha', 'bathroom', [1800, 1201], [800, 534]),
  image('img-v3j8', 'bathroom-two', 'Segundo baño con lavabo y ducha', 'bathroom', [1800, 1201], [800, 534]),
  image('img-b6s1', 'living-detail', 'Detalle de mobiliario en la zona de estar', 'detail', [1800, 1200], [800, 533]),
  image('img-c4w2', 'hallway', 'Pasillo interior de la vivienda', 'circulation', [1200, 1800], [533, 800]),
];

// Inventory facts confirmed by Augusto in the 2026-09-30 publication questionnaire:
// current asking price, sale/viewing availability, usable area, rooms, photo reuse
// without mandatory credit, Augusto contact routing, and neighborhood-only location.
// Room descriptions are limited to what the supplied photographs show.
// Energy label/certificate remains unreceived and unverified; AC is omitted.
// First release omits the provisional PDF; no rights-cleared hero video is supplied.
export const ibizaListing: Listing = {
  publicId: 'ap-k7r2',
  routeKey: 'ibiza-madrid-ap-k7r2',
  propertyType: 'apartment',
  transaction: 'sale',
  availability: 'available',
  location: {
    displayName: 'Ibiza, Madrid',
    neighborhood: 'Ibiza',
    district: 'Retiro',
    city: 'Madrid',
    precision: 'neighborhood',
  },
  price: { amount: 929000, currency: 'EUR' },
  area: { squareMeters: 72, measurement: 'usable' },
  rooms: { bedrooms: 2, bathrooms: 2 },
  energy: { rating: null },
  editorial: {
    title: 'Salón y cocina integrados en Ibiza, Retiro',
    summary: '72 m² útiles con dos dormitorios y dos baños, organizados alrededor de una zona de estar con cocina integrada.',
    highlights: ['Dos dormitorios', 'Dos baños completos', 'Cocina integrada en la zona de estar'],
    introduction: {
      title: 'Salón, comedor y cocina en un solo espacio.',
      body: 'La zona de día reúne salón, comedor y cocina. Dos dormitorios y dos baños completan la distribución.',
    },
  },
  media: {
    hero: photos[0]!,
    gallery: photos,
    film: null,
    virtualTour: null,
    slides: null,
    dossier: null,
    floorPlan: null,
  },
  contact: {
    name: 'Augusto Zeolite',
    role: 'Agente de Representación',
    portrait: { url: '/images/partners/augusto-zeolite.webp', width: 761, height: 1279 },
    profileUrl: '/partners/augusto-zeolite/',
    email: 'augusto@alfaropartners.es',
    phone: '+34624451948',
  },
};

export const ibizaListingReleaseReadiness: ListingReleaseReadiness = {
  ready: false,
  blockers: [
    'Energy label and certificate have not been received and verified.',
  ],
};
