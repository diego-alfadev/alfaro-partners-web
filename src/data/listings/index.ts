import { generatedListingEntries, generatedAdoptions } from './generated-batch';
import { appendPreviewEntries } from '../../lib/generated-intake';
import { intakeListingEntries } from './intake-batch';
import { ibizaListing, ibizaListingReleaseReadiness } from './ibiza-ap-k7r2';
import { ibizaRetiroListing, ibizaRetiroReleaseReadiness } from './ibiza-retiro-ap-l8v3';
import { canPublishListing, type Listing, type ListingReleaseReadiness } from '../../lib/listings';

/** Static fixtures use the future public projection; release state stays local. */
const authoredListingEntries: { listing: Listing; readiness: ListingReleaseReadiness; draftNotice: string }[] = [
  { listing: ibizaListing, readiness: ibizaListingReleaseReadiness,
    draftNotice: 'Borrador local · no publicar · información energética pendiente de verificar' },
  { listing: ibizaRetiroListing, readiness: ibizaRetiroReleaseReadiness,
    draftNotice: 'Borrador local · no publicar · datos y permisos pendientes de confirmar' },
  ...intakeListingEntries,
];

export const listingEntries = appendPreviewEntries(authoredListingEntries, generatedListingEntries, generatedAdoptions);

export function visibleListingEntries(includeDrafts: boolean) {
  return listingEntries.filter(({ listing, readiness }) => includeDrafts || canPublishListing(listing, readiness));
}

/** Same rule the property routes use to decide whether drafts are generated in this build. */
export function buildListingEntries() {
  return visibleListingEntries(import.meta.env.DEV || process.env.PROPERTY_DRAFT_PREVIEW === '1');
}
