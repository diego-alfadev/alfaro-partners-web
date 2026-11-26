import type { Listing, ListingReleaseReadiness } from '../../lib/listings';
import type { ReviewIssue } from '../../lib/review-issues';

/** Replaced only in an isolated PRE staging tree by the validated pipeline overlay. */
export const generatedListingEntries: {
  listing: Listing; readiness: ListingReleaseReadiness; draftNotice: string; reviewIssues?: readonly ReviewIssue[];
}[] = [];

export const generatedAdoptions: { publicId: string; routeKey: string }[] = [];
