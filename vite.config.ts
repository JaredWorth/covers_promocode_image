import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `--mode standalone` inlines every script, font and image into one HTML file
// that editors can open offline (the prototype's "Covers Promo Builder.html").
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone';
  return {
    base: './',
    plugins: [react(), ...(standalone ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: {
      outDir: standalone ? 'dist-standalone' : 'dist',
      assetsInlineLimit: standalone ? Number.MAX_SAFE_INTEGER : 4096,
      chunkSizeWarningLimit: standalone ? 40000 : 1000,
    },
  };
});
