import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { copyFileSync } from 'fs';

export default defineConfig({
  site: 'https://www.pixmidas.com',

  integrations: [
    react(),
    sitemap({
      serialize(item) {
        item.lastmod = '2026-05-18';
        item.changefreq = 'monthly';
        if (item.url === 'https://www.pixmidas.com/') {
          item.priority = 1.0;
        } else if (item.url.includes('/tools/')) {
          item.priority = 0.9;
        } else if (item.url.includes('/categories/')) {
          item.priority = 0.85;
        } else if (item.url.includes('/about/') || item.url.includes('/contact/')) {
          item.priority = 0.6;
        } else {
          item.priority = 0.5;
        }
        return item;
      },
    }),
    {
      name: 'sitemap-alias',
      hooks: {
        'astro:build:done': ({ dir }) => {
          copyFileSync(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
        },
      },
    },
  ],
});
