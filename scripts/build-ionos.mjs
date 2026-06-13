import { spawnSync } from 'node:child_process';

const siteUrl = process.env.PUBLIC_SITE_URL;

if (!siteUrl || !siteUrl.startsWith('https://') || siteUrl.includes('tu-dominio')) {
  console.error('Set PUBLIC_SITE_URL to the final HTTPS IONOS domain before building.');
  console.error('Example: PUBLIC_SITE_URL=https://www.alfaropartners.es bun run build:ionos');
  process.exit(1);
}

process.env.PUBLIC_BASE_PATH = process.env.PUBLIC_BASE_PATH || '/';

const result = spawnSync('bun', ['run', 'astro', 'build'], {
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
