import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One codebase, one page per site: Covers at /, SI at /si/, SBR at /sbr/, plus the
// Commercial Editor Tools landing page at /tools/.
const PAGES = { main: 'index.html', si: 'si/index.html', sbr: 'sbr/index.html', tools: 'tools/index.html' };

// Vite never inlines <link> icons, so the standalone build swaps the emitted files for data URIs itself.
const toBase64 = (src: string | Uint8Array) => {
  const bytes = typeof src === 'string' ? new TextEncoder().encode(src) : src;
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const inlineIcons = (): Plugin => ({
  name: 'inline-icons',
  enforce: 'post',
  generateBundle(_, bundle) {
    for (const page of Object.values(bundle)) {
      if (page.type !== 'asset' || !page.fileName.endsWith('.html') || typeof page.source !== 'string') continue;
      page.source = page.source.replace(/(<link rel="[\w-]*icon"[^>]*href=")[^"]*?([\w-]+\.(svg|png))"/g, (m, pre: string, name: string, ext: string) => {
        const icon = bundle[name];
        if (!icon || icon.type !== 'asset') return m;
        delete bundle[name];
        return `${pre}data:image/${ext === 'svg' ? 'svg+xml' : 'png'};base64,${toBase64(icon.source)}"`;
      });
    }
  },
});

// `--mode standalone` inlines every script, font and image into one HTML file
// that editors can open offline. It builds one site at a time: `--mode standalone-si` / `standalone-sbr`.

export default defineConfig(({ mode }) => {
  const standalone = mode.startsWith('standalone');
  const site = mode === 'standalone-si' ? 'si' : mode === 'standalone-sbr' ? 'sbr' : 'main';
  return {
    base: './',
    plugins: [react(), ...(standalone ? [inlineIcons(), viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: {
      outDir: standalone ? 'dist-standalone' : 'dist',
      emptyOutDir: !standalone,
      assetsInlineLimit: standalone ? Number.MAX_SAFE_INTEGER : 4096,
      chunkSizeWarningLimit: standalone ? 40000 : 1000,
      rollupOptions: { input: standalone ? PAGES[site] : PAGES },
    },
  };
});
