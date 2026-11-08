// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://beehivebookmarketing.com',
  trailingSlash: 'never',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()],
  redirects: {
    '/blog/business-book-as-a-comic': { status: 301, destination: '/blog/writing-a-book-as-a-consultant' },
  },
});
