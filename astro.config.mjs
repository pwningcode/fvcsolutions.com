import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

const SITE = 'https://fvcsolutions.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
    assets: '_assets',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
      manifest: {
        name: 'FVC Solutions',
        short_name: 'FVC',
        description: 'AI-powered software for small business. Custom applications designed, built, and shipped by a small experienced team.',
        theme_color: '#0d0f0d',
        background_color: '#0d0f0d',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['business', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/$|^https:\/\/fvcsolutions\.com\/(portfolio|schedule)$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'pages' },
          },
        ],
      },
    }),
  ],
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },
});
