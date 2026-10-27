// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// User site (darkframemaster.github.com → darkframemaster.github.io).
// Served from the domain root, so `base` stays `/`.
export default defineConfig({
  site: 'https://darkframemaster.github.io',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  server: { host: true, port: 4321 },
  build: { format: 'directory' },
});
