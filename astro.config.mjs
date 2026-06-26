// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

export default defineConfig({
  output: 'static',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [preact()],
});