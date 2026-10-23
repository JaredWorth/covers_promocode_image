import { toCanvas } from 'html-to-image';
import JSZip from 'jszip';
import type { TemplateKey } from '../data/types';

/** Export size per format. Wide formats are laid out at 1294×728 and scaled to 976×549. */
const OUT: Record<TemplateKey, { w: number; h: number } | null> = {
  t1: null,
  t2: { w: 976, h: 549 },
  t3: { w: 976, h: 549 },
};
/** Wide Banner and Banner + App share a size, so the App file is tagged to keep both in the zip. */
const SIZE_TAG: Record<TemplateKey, string> = { t1: '', t2: '', t3: '-App' };

const clean = (x: string) => x.replace(/[^A-Za-z0-9]/g, '');
const today = () => new Date().toISOString().slice(0, 10);

/** Render one canvas to WebP (quality 0.85), named Brand_WxH_YYYY-MM-DD.webp. */
export async function renderWebp(key: TemplateKey, node: HTMLElement, brandName: string) {
  const out = OUT[key];
  const canvas = await toCanvas(node, {
    pixelRatio: 1,
    width: node.offsetWidth,
    height: node.offsetHeight,
    // The "Show zones" overlay is never exported.
    filter: n => !(n instanceof HTMLElement && n.dataset.debug),
    ...(out ? { canvasWidth: out.w, canvasHeight: out.h } : {}),
  });
  const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', 0.85));
  if (!blob) throw new Error('WebP encoding failed');
  return { blob, name: `${clean(brandName) || 'Brand'}_${canvas.width}x${canvas.height}${SIZE_TAG[key]}_${today()}.webp` };
}

/** Zip the selected canvases and download Brand_YYYY-MM-DD.zip. */
export async function exportZip(items: { key: TemplateKey; node: HTMLElement; brand: string }[], zipBrand: string) {
  const files = await Promise.all(items.map(i => renderWebp(i.key, i.node, i.brand)));
  const zip = new JSZip();
  files.forEach(f => zip.file(f.name, f.blob));
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${clean(zipBrand) || 'Brand'}_${today()}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
