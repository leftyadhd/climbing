import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://rockclimb.netlify.app',
  integrations: [sitemap(), pagefind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
