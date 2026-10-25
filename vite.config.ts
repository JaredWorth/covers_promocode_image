import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Two pages from one codebase: the Covers builder at / and the SI builder at /si/.
const PAGES = { main: 'index.html', si: 'si/index.html' };

// `--mode standalone` inlines every script, font and image into one HTML file
// that editors can open offline. It builds one site at a time: `--mode standalone-si` for SI.
export default defineConfig(({ mode }) => {
  const standalone = mode.startsWith('standalone');
  const site = mode === 'standalone-si' ? 'si' : 'main';
  return {
    base: './',
    plugins: [react(), ...(standalone ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: {
      outDir: standalone ? 'dist-standalone' : 'dist',
      emptyOutDir: !standalone,
      assetsInlineLimit: standalone ? Number.MAX_SAFE_INTEGER : 4096,
      chunkSizeWarningLimit: standalone ? 40000 : 1000,
      rollupOptions: { input: standalone ? PAGES[site] : PAGES },
    },
  };
});
