/**
 * Second key for production: a listing goes live only when its data says ready AND its id is
 * listed here, so publishing always shows up as a reviewed line in the pull request.
 * The property validators fail when the two disagree.
 */
export const approvedListings: readonly string[] = ['ap-l8v3'];
