import type { Listing, ListingImage, ListingReleaseReadiness } from '../../lib/listings';

const mediaRoot = '/inmuebles/media/ap-l8v3';
function image(id: string, name: string, alt: string, scene: ListingImage['scene']): ListingImage {
  return {
    id, alt, scene,
    large: { url: `${mediaRoot}/${name}-large.webp`, width: 1800, height: 1201 },
    compact: { url: `${mediaRoot}/${name}-compact.webp`, width: 800, height: 534 },
  };
}
const photos: ListingImage[] = [
  image('img-a7x2', "living-overview", "Zona de estar con sofá y paso al comedor", 'living'),
  image('img-b4r9', "kitchen-dining", "Cocina con isla y mesa de comedor", 'kitchen'),
  image('img-c8n6', "kitchen-front", "Frente de cocina de madera con isla de piedra clara", 'kitchen'),
  image('img-d2v5', "dining-detail", "Mesa de comedor junto a la isla de cocina", 'detail'),
  image('img-e9p3', "hallway", "Pasillo interior con consola y vegetación", 'circulation'),
  image('img-f6t8', "bedroom-one", "Dormitorio con cabecero tapizado y mural vegetal", 'bedroom'),
  image('img-g3w7', "bedroom-two", "Segundo dormitorio con armario integrado", 'bedroom'),
  image('img-h5z1', "bedroom-two-window", "Segundo dormitorio junto a la ventana", 'bedroom'),
  image('img-j8s4', "bedroom-one-perspective", "Primer dormitorio visto desde la entrada", 'bedroom'),
  image('img-k2y6', "bathroom-one", "Baño con dos espejos y lavabo doble", 'bathroom'),
  image('img-m4u9', "bathroom-two", "Segundo baño con lavabo y espejo ovalado", 'bathroom'),
  image('img-n7q2', "bathroom-shower", "Ducha acristalada junto al lavabo doble", 'bathroom'),
  image('img-p1c5', "entrance-hall", "Escalera y vestíbulo de acceso al edificio", 'circulation'),
];

const reportImages: ListingImage[] = [
  image('img-r6a3', 'kitchen-island-oblique', 'Cocina vista desde el lateral de la isla', 'kitchen'),
  image('img-s9d8', 'bedroom-one-front', 'Dormitorio del mural vegetal visto de frente', 'bedroom'),
  image('img-t3f7', 'bedroom-two-front', 'Segundo dormitorio visto de frente', 'bedroom'),
];

// Supplied edited inventory, Hoja1 row 3; price as of the 2026-11-23 capture.
// Area measurement type and assigned agent are not confirmed.
// Advertised energy values were visually checked against the matching portal label;
// neither certificate delivery nor registration is implied. Conflicting orientation
// and community fees are omitted. Source provenance stays in the local task document.
export const ibizaRetiroListing: Listing = {
  publicId: 'ap-l8v3',
  routeKey: 'ibiza-retiro-madrid-ap-l8v3',
  propertyType: 'apartment', transaction: 'sale', availability: 'available',
  location: {
    displayName: 'Ibiza, Retiro, Madrid', neighborhood: 'Ibiza',
    district: 'Retiro', city: 'Madrid', precision: 'neighborhood',
  },
  price: { amount: 1049000, currency: 'EUR' },
  area: { squareMeters: 88, measurement: 'unspecified' },
  rooms: { bedrooms: 2, bathrooms: 2 },
  energy: { rating: 'E', consumptionKwhPerSquareMeterYear: 211, emissionsKgPerSquareMeterYear: 44 },
  editorial: {
    title: 'Una vivienda con isla en Ibiza, Retiro',
    summary: '88 m², dos dormitorios y dos baños. Una cocina con isla conecta el comedor con la zona de estar.',
    highlights: ['Cocina con isla', 'Dos dormitorios y dos baños', 'Amueblada y equipada'],
    introduction: {
      title: 'La cocina, en el centro de la casa.',
      body: 'La zona de día reúne cocina, comedor y estar alrededor de una isla de acabado claro y un frente de madera. El pasillo conecta este espacio con dos dormitorios y dos baños.\n\nLa vivienda se presenta amueblada y equipada, con aire acondicionado y calefacción individual de gas. El edificio dispone de ascensor y portero.',
    },
  },
  features: [
    { label: 'Climatización', value: 'Aire acondicionado' },
    { label: 'Calefacción', value: 'Individual de gas' },
    { label: 'Edificio', value: 'Ascensor y portero' },
    { label: 'Situación', value: 'Interior' },
    { label: 'Equipamiento', value: 'Amueblada y equipada' },
  ],
  media: {
    hero: photos[1]!, gallery: photos, reportImages, film: null, virtualTour: null,
    slides: null, dossier: null, floorPlan: null,
  },
  contact: {
    kind: 'team', name: 'Alfaro & Partners', role: 'Representación inmobiliaria',
    portrait: null, profileUrl: null,
    email: 'hola@alfaropartners.es', phone: '+34672504642',
  },
};

// Office approved this exact page ("OK para publicar"); live since 2026-11-16.
export const ibizaRetiroReleaseReadiness: ListingReleaseReadiness = {
  ready: true,
  blockers: [],
};
