// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://veritas-software.net',
  adapter: cloudflare(),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacy') && !page.includes('/support'),
    }),
  ],
});
