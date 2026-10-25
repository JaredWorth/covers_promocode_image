import { useSyncExternalStore } from 'react';

// Async image work shared by all three canvases. Results are cached by URL and
// subscribers re-render when one lands.

let version = 0;
const listeners = new Set<() => void>();
const bump = () => { version++; listeners.forEach(l => l()); };

/** Re-render whenever a tinted ball or logo measurement becomes available. */
export function useImageCache() {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => { listeners.delete(cb); }; }, () => version);
}

const aspects: Record<string, number> = {};
/** Natural width / height of an image, or 0 until it has loaded. */
export function logoAspect(src: string): number {
  if (aspects[src] == null) {
    aspects[src] = 0;
    const im = new Image();
    im.onload = () => { aspects[src] = im.naturalWidth / im.naturalHeight; bump(); };
    im.src = src;
  }
  return aspects[src];
}

const tinted: Record<string, string | null> = {};
/**
 * Recolour a ball: bake the hue into the image on a canvas ("color" blend,
 * clipped to the ball's alpha) so it looks the same on screen and in the
 * html-to-image export, where CSS blend modes and masks don't survive.
 * Returns the original until the tinted version is ready.
 */
export function recolorBall(src: string, color: string | null): string {
  if (!color) return src;
  const key = color + '|' + src;
  const hit = tinted[key];
  if (hit) return hit;
  if (hit === undefined) {
    tinted[key] = null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || 512, h = img.naturalHeight || 512;
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const x = c.getContext('2d')!;
        x.drawImage(img, 0, 0, w, h);
        x.globalCompositeOperation = 'color';
        x.fillStyle = color; x.fillRect(0, 0, w, h);
        x.globalCompositeOperation = 'destination-in';
        x.drawImage(img, 0, 0, w, h);
        c.toBlob(blob => { tinted[key] = blob ? URL.createObjectURL(blob) : src; bump(); }, 'image/png');
      } catch { tinted[key] = src; bump(); }
    };
    img.onerror = () => { tinted[key] = src; bump(); };
    img.src = src;
  }
  return src;
}

// ---- SI sport backgrounds ----

const hex = (c: string | undefined | null): number[] | null => {
  let h = String(c || '').trim();
  if (/^#[0-9a-f]{3}$/i.test(h)) h = '#' + h.slice(1).split('').map(x => x + x).join('');
  return /^#[0-9a-f]{6}$/i.test(h) ? [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255) : null;
};

/** Dark base from a brand background: hex as-is; linear gradient = first stop; radial/other = last stop. */
const darkOf = (bg: string) => {
  const hs = String(bg || '').match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || [];
  const h = /^linear/.test(bg) ? hs[0] : (hs.length > 1 && !/^#/.test(bg) ? hs[hs.length - 1] : hs[0]);
  return hex(h) || [0.04, 0.04, 0.04];
};

const sportCache: Record<string, string | null> = {};
/**
 * Recolour an SI sport photo to the brand: neutral tones take the brand's dark
 * base (bright backgrounds are darkened unless the brand is light), green
 * pixels take the accent. Baked on a canvas so exports match the preview.
 * Returns the original image until the recoloured one is ready.
 */
export function sportBackground(src: string, bg: string, accent: string, light: boolean): string {
  let D = darkOf(bg);
  const A = hex(accent) || [0.4, 0.7, 0.1];
  const lm = 0.3 * D[0] + 0.59 * D[1] + 0.11 * D[2];
  if (!light && lm > 0.2) D = D.map(v => v * (0.2 / lm));
  const key = src + '|' + D.map(v => v.toFixed(3)) + '|' + A.map(v => v.toFixed(3)) + '|' + light;
  const hit = sportCache[key];
  if (hit) return hit;
  if (hit === undefined) {
    sportCache[key] = null;
    const img = new Image();
    img.onload = () => {
      try {
        const W = img.naturalWidth * 2, H = img.naturalHeight * 2;
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d')!;
        x.imageSmoothingQuality = 'high';
        x.drawImage(img, 0, 0, W, H);
        const id = x.getImageData(0, 0, W, H), p = id.data;
        const lum = (a: number[]) => 0.3 * a[0] + 0.59 * a[1] + 0.11 * a[2];
        const setLum = (a: number[], l: number) => {
          const d = l - lum(a);
          let r = [a[0] + d, a[1] + d, a[2] + d];
          const L = lum(r), n = Math.min(...r), mx = Math.max(...r);
          if (n < 0) r = r.map(v => L + (v - L) * L / (L - n));
          if (mx > 1) r = r.map(v => L + (v - L) * (1 - L) / (mx - L));
          return r;
        };
        for (let i = 0; i < p.length; i += 4) {
          const r = p[i] / 255, g = p[i + 1] / 255, b = p[i + 2] / 255, Ls = 0.3 * r + 0.59 * g + 0.11 * b;
          const gr = Math.max(0, Math.min(1, (g - (r + b) / 2) / 0.4));
          const B = setLum(D, Ls), k = Math.max(0.6, Math.min(1.1, 0.55 + Ls * 1.1));
          let o = [0, 1, 2].map(j => B[j] * (1 - gr) + Math.min(1, A[j] * k) * gr);
          if (light) o = o.map((v, j) => D[j] * 0.85 + v * 0.15);
          p[i] = o[0] * 255; p[i + 1] = o[1] * 255; p[i + 2] = o[2] * 255;
        }
        x.putImageData(id, 0, 0);
        c.toBlob(bl => { sportCache[key] = bl ? URL.createObjectURL(bl) : src; bump(); }, 'image/png');
      } catch { sportCache[key] = src; bump(); }
    };
    img.onerror = () => { sportCache[key] = src; bump(); };
    img.src = src;
  }
  return src;
}
