// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const site = process.env.PUBLIC_SITE_URL ?? 'https://diego-alfadev.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/alfaro-partners-web';
const sitemapExcludedPaths = ['/aviso-legal/', '/privacidad/', '/cookies/', '/marca/'];

// https://astro.build/config
export default defineConfig({
  site,
  base,
  vite: {
    plugins: [tailwindcss()]
  },

  // SEO hardening (SDD alfaro-seo-hardening, Phase 7). Only Libre Baskerville is
  // self-hosted: it ships under the SIL OFL (self-hosting explicitly permitted).
  // Satoshi stays remote via api.fontshare.com/cdn.fontshare.com -- Fontshare's
  // Free Font EULA (bundled as License/FFL.txt in the download, ITF, section 02)
  // explicitly prohibits "uploading them in a public server" and "transmit[ting]
  // the Font Software over the Internet in font serving", which is exactly what
  // build-time self-hosting would do. Verified by downloading the actual license
  // file from https://api.fontshare.com/v2/fonts/download/satoshi -- do not
  // self-host Satoshi without written consent from Indian Type Foundry.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Libre Baskerville',
      cssVariable: '--font-display-src',
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
    },
  ],

  integrations: [
    sitemap({
      filter: (page) => !sitemapExcludedPaths.some((path) => page.endsWith(path)),
      // SEO hardening (SDD alfaro-seo-hardening, Phase 9): stamp every sitemap
      // entry with a lastmod so crawlers can prioritize revisits. No per-page
      // content-modified tracking exists yet, so every entry gets the build date.
      lastmod: new Date(),
    }),
    icon(),
  ]
});
