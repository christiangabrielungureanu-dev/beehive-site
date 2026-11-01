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
    '/podcast': '/',
    '/self-help': '/',
    '/business': '/',
    '/blog': '/',
    '/blog/amazon-ads-for-business-books': '/',
    '/blog/business-book-that-grows-your-business': '/',
    '/blog/why-write-a-business-book': '/',
  },
});
