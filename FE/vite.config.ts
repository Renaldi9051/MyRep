import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  envDir: '..',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'MyReps',
        short_name: 'MyReps',
        description: 'Catat latihan gym tanpa mengetik',
        lang: 'id',
        start_url: '/latihan',
        display: 'standalone',
        theme_color: '#FFFFFF',
        background_color: '#FFFFFF',
        // TODO: tambah ikon PNG 192 dan 512 setelah desain dipilih
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
        // Font Barlow dari Google Fonts disimpan supaya tampilan tetap sama saat offline
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    // Samakan dengan produksi: FE dan API satu origin, /api diteruskan ke BE
    proxy: { '/api': 'http://localhost:3000' },
  },
});
