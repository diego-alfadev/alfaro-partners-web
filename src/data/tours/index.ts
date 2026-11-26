import { generatedTours } from './generated-batch';
import { generatedListingEntries } from '../listings/generated-batch';
import { appendPreviewTours } from '../../lib/generated-intake';
import { intakeTours } from './intake-batch';
import { intakeListingEntries } from '../listings/intake-batch';
import type { TourScript } from '../../lib/guided-tour';
import { ibizaRetiroTour } from './ibiza-retiro-ap-l8v3';
import { menendezPelayoTour } from './menendez-pelayo-ap-k7r2';

const authoredTours: TourScript[] = [ibizaRetiroTour, menendezPelayoTour, ...intakeTours.filter(({ publicId }) => intakeListingEntries.some(({ listing }) => listing.publicId === publicId))];

export const tourScripts = appendPreviewTours(authoredTours, generatedTours, generatedListingEntries);

/** Transition clips a tour declares, by file name (`<clip>.mp4`). */
export function tourClips(publicId: string): string[] {
  const script = tourScripts.find((tour) => tour.publicId === publicId);
  return (script?.acts ?? []).flatMap((act) => (act.template === 'pair' && act.clip ? [`${act.clip}.mp4`] : []));
}
