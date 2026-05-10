// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://freddie-portfolio.pages.dev',

  devToolbar: {
    enabled: false,
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  integrations: [mdx()],
});