import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeMark } from './src/plugins/remark-mark.mjs';

export default defineConfig({
  site: 'https://rockclimb.netlify.app',
  integrations: [sitemap(), pagefind()],
  vite: {
    build: {
      rollupOptions: {
        external: [/\/pagefind\//],
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeMark],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
