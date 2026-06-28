// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// Canonical origin. Every absolute URL (canonical tag, OG, sitemap) is built
// from this. Override per-host with the SITE env var (e.g. a GitHub Pages URL)
// without touching code: `SITE=https://… pnpm build`.
const site = process.env.SITE ?? 'https://brunoloureiro.dev';

export default defineConfig({
  output: 'static',
  site,

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [preact(), sitemap()],
  adapter: cloudflare(),
});