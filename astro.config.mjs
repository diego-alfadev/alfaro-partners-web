// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const site = process.env.PUBLIC_SITE_URL ?? 'https://diego-alfadev.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/alfaro-partners-web';
const sitemapExcludedPaths = ['/aviso-legal/', '/privacidad/', '/cookies/', '/actualidad/'];

// https://astro.build/config
export default defineConfig({
  site,
  base,
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) => !sitemapExcludedPaths.some((path) => page.endsWith(path)),
    }),
    icon(),
  ]
});
