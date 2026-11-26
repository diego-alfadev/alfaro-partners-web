import { listingImages, type Listing, type ListingImage } from './listings';

/** `travel` walks the camera into a single photograph, towards `to` (a point in the image). */
export type TourTravel = { to: string; scale?: number; caption: string };

/**
 * A guided tour is an ordered script of acts. Each act picks one of a small set
 * of templates; the template owns layout and choreography, the script only owns
 * copy, photographs and focal points. A script can be authored by hand or drafted
 * by inference from the listing, as long as it only references approved images.
 */
export type TourShot = { mediaId: string; focus?: string; caption?: string; travel?: TourTravel };

/**
 * How a single photograph arrives: an inset frame that opens, or (wide screens only)
 * a full-height panel on the right half that widens to full bleed. Narrow screens
 * always use the inset frame.
 */
export type RevealEntry = 'inset' | 'side';

/**
 * How far the photograph starts shifted right so its focal point sits in the middle
 * of the right-half panel (75 % of the width). Clamped so the panel never shows past
 * the photograph's left edge and the shift shrinks to zero exactly as the panel opens.
 */
export function sidePanelShift(focus: string | undefined): string {
  const x = Number.parseFloat(focus ?? '50');
  return `${Math.min(50, Math.max(0, 75 - (Number.isFinite(x) ? x : 50)))}%`;
}
/**
 * What the second photograph adds, which decides how it is shown on wide screens
 * (narrow screens always slide one photograph after the other):
 * - detail: a premium view plus one that completes it (overlaid card);
 * - perspective: two views of the same room (the second slides in over the first);
 * - rooms: two different rooms (the first panel yields half the screen to the second).
 */
export type PairRelation = 'detail' | 'perspective' | 'rooms';

/** `dissolve` fades the act in over the previous one, which stays pinned (a match cut between similar frames). */
export type TourEnter = 'dissolve';

export type TourAct = (
  | { template: 'cover'; id: string; label: string; eyebrow: string; title: string; lede: string; shot: TourShot }
  | { template: 'arrival'; id: string; label: string; eyebrow: string; title: string; text: string; shot: TourShot }
  | { template: 'reveal'; id: string; label: string; title: string; text: string; shot: TourShot; entry?: RevealEntry }
  | { template: 'pair'; id: string; label: string; title: string; text: string; shots: [TourShot, TourShot]; relation: PairRelation
      /** Optional generated camera move from the first photograph to the second (`<clip>.mp4`), scrubbed by scroll. */
      clip?: string }
  | { template: 'close'; id: string; label: string; title: string; text: string; action: string }
) & { enter?: TourEnter };

export type TourScript = { publicId: string; title: string; description: string; acts: TourAct[] };

export type ResolvedShot = TourShot & { image: ListingImage };

export function resolveShot(listing: Listing, shot: TourShot): ResolvedShot {
  const image = listingImages(listing).find((candidate) => candidate.id === shot.mediaId);
  if (!image) throw new Error(`Unknown tour image ${shot.mediaId} in ${listing.publicId}.`);
  return { ...shot, image };
}

const areaLabel = { built: 'construidos', usable: 'útiles', unspecified: '' } as const;

/** Facts shown in the cover come from the listing, never from the script. Place and price lead. */
export function tourFacts(listing: Listing) {
  const { squareMeters, measurement } = listing.area;
  const { bedrooms, bathrooms } = listing.rooms;
  const price = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(listing.price.amount) + ' €';
  return {
    primary: [
      { label: 'Zona', value: `${listing.location.neighborhood}, ${listing.location.district}` },
      { label: listing.transaction === 'sale' ? 'Precio de venta' : 'Alquiler mensual', value: price },
    ],
    secondary: [
      `${squareMeters} m²${areaLabel[measurement] ? ` ${areaLabel[measurement]}` : ''}`,
      `${bedrooms} ${bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`,
      `${bathrooms} ${bathrooms === 1 ? 'baño' : 'baños'}`,
    ],
  };
}
