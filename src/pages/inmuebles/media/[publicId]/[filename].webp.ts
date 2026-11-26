import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { listingEntries, visibleListingEntries } from '../../../../data/listings';
import { canPublishListing, listingImages } from '../../../../lib/listings';

const safeFilename = /^[a-z-]+-(?:large|compact)\.webp$/;
const directory = (publicId: string) => join(process.cwd(), 'src/assets/properties', publicId);
const allowedFiles = (entry: typeof listingEntries[number]) => new Set(
  listingImages(entry.listing).flatMap((image) => [image.large.url, image.compact.url])
    .map((url) => url.split('/').at(-1)!),
);

export const getStaticPaths: GetStaticPaths = async () => {
  const localPreview = import.meta.env.DEV || process.env.PROPERTY_DRAFT_PREVIEW === '1';
  const paths = [];
  for (const entry of visibleListingEntries(localPreview)) {
    const allowed = allowedFiles(entry);
    const files = await readdir(directory(entry.listing.publicId));
    if (files.length !== allowed.size || files.some((file) => !safeFilename.test(file) || !allowed.has(file))) {
      throw new Error(`Property media does not match Listing ${entry.listing.publicId}.`);
    }
    paths.push(...files.map((file) => ({
      params: { publicId: entry.listing.publicId, filename: file.slice(0, -'.webp'.length) },
    })));
  }
  return paths;
};

export const GET: APIRoute = async ({ params }) => {
  const filename = `${params.filename ?? ''}.webp`;
  const entry = listingEntries.find(({ listing }) => listing.publicId === params.publicId);
  const localPreview = import.meta.env.DEV || process.env.PROPERTY_DRAFT_PREVIEW === '1';
  if (!entry || !safeFilename.test(filename) || !allowedFiles(entry).has(filename)
    || (!localPreview && !canPublishListing(entry.listing, entry.readiness))) {
    return new Response('Not found', { status: 404 });
  }

  const bytes = await readFile(join(directory(entry.listing.publicId), filename));
  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': canPublishListing(entry.listing, entry.readiness)
        ? 'public, max-age=31536000, immutable' : 'no-store',
    },
  });
};
