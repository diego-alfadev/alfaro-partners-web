import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { listingEntries, visibleListingEntries } from '../../../../data/listings';
import { tourClips } from '../../../../data/tours';
import { canPublishListing } from '../../../../lib/listings';

// Same gate as the photographs: only clips a tour declares, only while the listing is
// visible (local preview or published), and the folder must hold nothing else.
const safeFilename = /^[a-z0-9-]+\.mp4$/;
const directory = (publicId: string) => join(process.cwd(), 'src/assets/property-clips', publicId);

async function filesIn(publicId: string) {
  try { return await readdir(directory(publicId)); } catch { return []; }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const localPreview = import.meta.env.DEV || process.env.PROPERTY_DRAFT_PREVIEW === '1';
  const paths = [];
  for (const { listing } of visibleListingEntries(localPreview)) {
    const declared = new Set(tourClips(listing.publicId));
    const files = await filesIn(listing.publicId);
    if (files.some((file) => !safeFilename.test(file) || !declared.has(file)) || [...declared].some((file) => !files.includes(file))) {
      throw new Error(`Tour clips do not match the tour script of ${listing.publicId}.`);
    }
    paths.push(...files.map((file) => ({ params: { publicId: listing.publicId, filename: file.slice(0, -'.mp4'.length) } })));
  }
  return paths;
};

export const GET: APIRoute = async ({ params }) => {
  const filename = `${params.filename ?? ''}.mp4`;
  const entry = listingEntries.find(({ listing }) => listing.publicId === params.publicId);
  const localPreview = import.meta.env.DEV || process.env.PROPERTY_DRAFT_PREVIEW === '1';
  if (!entry || !safeFilename.test(filename) || !tourClips(entry.listing.publicId).includes(filename)
    || (!localPreview && !canPublishListing(entry.listing, entry.readiness))) {
    return new Response('Not found', { status: 404 });
  }

  const bytes = await readFile(join(directory(entry.listing.publicId), filename));
  return new Response(bytes, {
    headers: {
      'Content-Type': 'video/mp4',
      'Cache-Control': canPublishListing(entry.listing, entry.readiness)
        ? 'public, max-age=31536000, immutable' : 'no-store',
    },
  });
};
