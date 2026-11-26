/** Public property projection. This is not a CRM record or a publication workflow. */
export type ListingMediaSource = {
  url: string;
  width: number;
  height: number;
};

export type ListingImage = {
  /** Authored stable public identity; optional for existing fixtures without a report. */
  id?: string;
  alt: string;
  scene: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'detail' | 'circulation';
  large: ListingMediaSource;
  compact: ListingMediaSource;
};


export type ListingVideo = {
  url: string;
  poster: ListingMediaSource;
  title: string;
  captionsUrl?: string;
};

export type ListingDocument = {
  url: string;
  title: string;
  format: 'pdf';
};

/** Contractual collaboration line, shown only on that supplier's listings. */
export const supplierCollaborationNotice = {
  arctempus: 'Comercialización en colaboración con Labotec Market S.L. y Arctempus.',
} as const;

export type ListingSupplier = keyof typeof supplierCollaborationNotice;

export type Listing = {
  publicId: string;
  routeKey: string;
  supplier?: ListingSupplier;
  propertyType: 'apartment' | 'house';
  transaction: 'sale' | 'rent';
  availability: 'available' | 'reserved' | 'sold' | 'unconfirmed';
  location: {
    displayName: string;
    neighborhood: string;
    district: string;
    city: string;
    precision: 'neighborhood' | 'street' | 'full';
  };
  price: { amount: number; currency: 'EUR' };
  area: { squareMeters: number; measurement: 'built' | 'usable' | 'unspecified' };
  rooms: { bedrooms: number; bathrooms: number };
  energy: {
    rating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
    consumptionKwhPerSquareMeterYear?: number;
    emissionsKgPerSquareMeterYear?: number;
  };
  editorial: {
    title: string;
    summary: string;
    highlights: string[];
    introduction: { title: string; body: string };
  };
  features?: { label: string; value: string }[];
  media: {
    hero: ListingImage;
    gallery: ListingImage[];
    /** Additional approved images, not forced into the traditional gallery. */
    reportImages?: ListingImage[];
    film: ListingVideo | null;
    virtualTour: { url: string; title: string } | null;
    slides: ListingDocument | null;
    dossier: ListingDocument | null;
    floorPlan: ListingImage | null;
  };
  contact: {
    name: string;
    role: string;
    portrait: ListingMediaSource | null;
    profileUrl: string | null;
    kind?: 'professional' | 'team';
    email: string;
    phone: string;
  };
};

/** Kept outside Listing so release blockers cannot become public API fields. */
export type ListingReleaseReadiness = {
  ready: boolean;
  blockers: readonly string[];
};

export function canPublishListing(listing: Listing, readiness: ListingReleaseReadiness): boolean {
  return readiness.ready
    && readiness.blockers.length === 0
    && listing.energy.rating !== null
    && listing.availability !== 'unconfirmed';
}

/** One approved media inventory shared by static serving and the guided tour's references. */
export function listingImages(listing: Listing): ListingImage[] {
  const images = [...listing.media.gallery, ...(listing.media.reportImages ?? [])];
  return images.filter((image, index) => images.findIndex((other) => other.large.url === image.large.url) === index);
}
