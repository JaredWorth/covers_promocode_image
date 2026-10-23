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
