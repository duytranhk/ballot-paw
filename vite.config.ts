import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/ballot-paw/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Ballot Counter',
        short_name: 'Ballot',
        description: 'Offline ballot counting app',
        theme_color: '#ffffff',
        display: 'standalone',
        start_url: '/ballot-paw/',
        icons: [
          {
            src: '/ballot-paw/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/ballot-paw/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});

