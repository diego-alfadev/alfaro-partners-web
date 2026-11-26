import { listingImages, type Listing, type ListingReleaseReadiness } from './listings';
import type { TourScript } from './guided-tour';
import { validateReviewIssues, type ReviewIssue } from './review-issues';

type Entry = { listing: Listing; readiness: ListingReleaseReadiness; draftNotice: string; reviewIssues?: readonly ReviewIssue[] };

export type PreviewAdoption = { publicId: string; routeKey: string };

/** Only explicit baseline-validated adoptions may replace an authored PRE entry. */
export function appendPreviewEntries(authored: Entry[], generated: Entry[], adoptions: PreviewAdoption[] = []): Entry[] {
  const ids = new Set(authored.map(({ listing }) => listing.publicId));
  const routes = new Set(authored.map(({ listing }) => listing.routeKey));
  const authorized = new Map<string, PreviewAdoption>();
  for (const adoption of adoptions) {
    const matches = authored.filter(({ listing }) => listing.publicId === adoption.publicId);
    if (authorized.has(adoption.publicId) || matches.length !== 1
      || matches[0]!.listing.routeKey !== adoption.routeKey) {
      throw new Error('Generated PRE adoption does not match one authored identity.');
    }
    authorized.set(adoption.publicId, adoption);
  }
  const replacements = new Map<string, Entry>();
  const additions: Entry[] = [];
  for (const entry of generated) {
    validateReviewIssues(entry.reviewIssues, entry.listing);
    const { publicId, routeKey } = entry.listing;
    if (entry.readiness.ready !== false || entry.readiness.blockers.length === 0) {
      throw new Error('Generated PRE entries collide or claim production readiness.');
    }
    const adoption = authorized.get(publicId);
    if (adoption) {
      if (routeKey !== adoption.routeKey || replacements.has(publicId)) {
        throw new Error('Generated PRE adoption is duplicated or changes its route.');
      }
      const original = authored.find(({ listing }) => listing.publicId === publicId)!;
      const images = listingImages(entry.listing);
      for (const before of listingImages(original.listing)) {
        if (!images.some((image) => image.id === before.id
          && image.large.url === before.large.url && image.compact.url === before.compact.url)) {
          throw new Error('Generated PRE adoption removes or changes original tour media.');
        }
      }
      replacements.set(publicId, entry);
    } else {
      if (ids.has(publicId) || routes.has(routeKey)) {
        throw new Error('Generated PRE entries collide or claim production readiness.');
      }
      ids.add(publicId);
      routes.add(routeKey);
      additions.push(entry);
    }
  }
  if (replacements.size !== authorized.size) {
    throw new Error('Generated PRE adoption has no replacement.');
  }
  return [...authored.map((entry) => replacements.get(entry.listing.publicId) ?? entry), ...additions];
}

export function appendPreviewTours(authored: TourScript[], generated: TourScript[], entries: Entry[]): TourScript[] {
  const ids = new Set(authored.map(({ publicId }) => publicId));
  const available = new Set(entries.map(({ listing }) => listing.publicId));
  for (const tour of generated) {
    if (ids.has(tour.publicId) || !available.has(tour.publicId)) {
      throw new Error('Generated PRE tour collides or has no generated listing.');
    }
    ids.add(tour.publicId);
  }
  return [...authored, ...generated];
}
