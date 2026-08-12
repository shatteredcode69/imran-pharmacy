import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// NOTE: Replace 'imrans-pharmacy' below with your actual GitHub repo name.
// Base path must match the repo name for GitHub Pages project sites,
// e.g. https://<username>.github.io/imrans-pharmacy/
export default defineConfig({
  base: 'https://shatteredcode69.github.io/imrans-pharmacy/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: "Imran Pharmacy",
        short_name: "Imran Pharma",
        description: 'Pharmacy inventory and ordering system',
        theme_color: '#0E6E5D',
        background_color: '#F6F7F4',
        display: 'standalone',
        start_url: '/imrans-pharmacy/',
        scope: '/imrans-pharmacy/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
});
