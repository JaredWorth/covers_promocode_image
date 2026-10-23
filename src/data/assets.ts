// Brand data refers to images by their prototype path ("assets/logo-x.svg").
// Resolve those through Vite so they are hashed in `dist` and inlined in the
// standalone build.
const files = import.meta.glob('../assets/**/*.{svg,png,jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// The standalone build inlines SVGs as URL-encoded data URIs. html-to-image
// scans CSS url() values and would try to fetch SVG-internal refs such as
// url(#clip0), so hand it base64 instead.
const toBase64Svg = (url: string) => {
  if (!url.startsWith('data:image/svg+xml,')) return url;
  const bytes = new TextEncoder().encode(decodeURIComponent(url.slice('data:image/svg+xml,'.length)));
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return 'data:image/svg+xml;base64,' + btoa(bin);
};

const byPath: Record<string, string> = {};
for (const [k, url] of Object.entries(files)) byPath[k.replace(/^\.\.\//, '')] = toBase64Svg(url);

/** Resolve an `assets/...` path; blob/data URLs (uploads) pass through. */
export function asset(path: string | null | undefined): string {
  if (!path) return '';
  if (/^(blob:|data:|https?:)/.test(path)) return path;
  const url = byPath[path];
  if (!url && import.meta.env.DEV) console.warn('[assets] missing', path);
  return url || path;
}
