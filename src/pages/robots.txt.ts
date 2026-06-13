import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteOrigin = site ?? new URL('https://diego-alfadev.github.io');
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const sitemapUrl = new URL(`${basePath}sitemap-index.xml`, siteOrigin).toString();

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
