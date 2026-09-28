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
        name: 'MyRep',
        short_name: 'MyRep',
        description: 'Pencatat latihan gym',
        lang: 'id',
        start_url: '/latihan',
        display: 'standalone',
        theme_color: '#111111',
        background_color: '#111111',
        // TODO: tambah ikon PNG 192 dan 512 setelah desain dipilih
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
  server: {
    // Samakan dengan produksi: FE dan API satu origin, /api diteruskan ke BE
    proxy: { '/api': 'http://localhost:3000' },
  },
});
