import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base: the site is served from https://fevra-dev.github.io/North-Bay/, so every asset
// URL needs that repository path segment in front of it. Vite bakes this into the built
// HTML/CSS/JS. If this ever moves to a custom domain or a root-level host, set it to '/'.
export default defineConfig({
  base: '/North-Bay/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
