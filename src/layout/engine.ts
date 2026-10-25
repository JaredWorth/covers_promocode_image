import type { CategoryId, TemplateKey, TemplateState } from '../data/types';
import { TWEAKS } from '../model/view';
import type { Site } from '../site';

// Layout engine for the three canvases. It runs after every render, measures
// the real DOM (fonts, glyph ink, logo alpha) and writes positions and sizes
// straight onto the zone elements, as the design prototype did. Keeping it
// imperative is what makes the output pixel-identical to the approved design.

type Circle = { x: number; y: number; s: number };
interface FormatCfg {
  W: number; H: number;
  /** Fine-print font size range (px). */
  tm: number; tp: number;
  /** Covers footer logo: offset from bottom + height. */
  cov: { o: number; h: number } | null;
  /** Text-box x limits. */
  xl: number; xr: number;
  /** Decor ball circles (centre + box size), used as keep-outs on Banner + App. */
  bt: Circle; bb: Circle;
}

const CFG: Record<TemplateKey, FormatCfg> = {
  t1: { W: 1080, H: 1080, tm: 18, tp: 22, cov: { o: 18, h: 54 }, xl: 0, xr: 1080, bt: { x: 68, y: 108, s: 372 }, bb: { x: 975.5, y: 991.5, s: 531 } },
  t2: { W: 1294, H: 728, tm: 16, tp: 19, cov: { o: 20, h: 34 }, xl: 210, xr: 1084, bt: { x: 111, y: 127, s: 386 }, bb: { x: 1172, y: 639, s: 482 } },
  t3: { W: 1294, H: 728, tm: 16, tp: 18, cov: null, xl: 0, xr: 690, bt: { x: 851, y: 80, s: 346 }, bb: { x: 1186, y: 676, s: 476 } },
};

/** Max hero font size per format (canvas px); Wide comes from the site profile. */
const HERO_MAX: Record<TemplateKey, number> = { t1: 220, t2: 240, t3: 220 };

/** Promo pill spec in export px (Wide / Banner + App are 976 wide, canvas is 1294). */
const PILL: Record<TemplateKey, { h: number; min: number; max: number; fs: number; pad: number; lab: number; gap: number; s: number }> = {
  t1: { h: 168, min: 700, max: 900, fs: 122, pad: 52, lab: 30, gap: 16, s: 1 },
  t2: { h: 112, min: 500, max: 650, fs: 80, pad: 38, lab: 21, gap: 10, s: 1294 / 976 },
  t3: { h: 106, min: 420, max: 520, fs: 76, pad: 34, lab: 20, gap: 10, s: 1294 / 976 },
};

const FORMAT_NAMES: Record<TemplateKey, string> = { t1: 'Square', t2: 'Wide', t3: 'Banner + App Screen' };

interface StackFit {
  warn: boolean; h: number; ref?: number; f?: number; baseT?: string; st?: HTMLElement;
}

export interface LayoutInput {
  cat: CategoryId;
  showZones: boolean;
  state: TemplateState;
  root: HTMLElement | null;
}

const vis = (e: Element | null): e is HTMLElement => !!e && getComputedStyle(e).display !== 'none';

export class LayoutEngine {
  private flip: Partial<Record<TemplateKey, { cy: number; ref: number }>> = {};
  private inkCache: Record<string, { t: number; b: number }> = {};
  private measureCtx: CanvasRenderingContext2D | null = null;

  /** Called when an async measurement (logo alpha) lands and layout should re-run. */
  constructor(private site: Site, private onAsync: () => void) {}

  // ---------- shared measurement helpers ----------

  /** Empty space above the cap height and below the baseline inside an element's line box. */
  private inkIns(el: HTMLElement): [number, number] {
    const M = this.measureCtx || (this.measureCtx = document.createElement('canvas').getContext('2d')!);
    const c = getComputedStyle(el), f = parseFloat(c.fontSize);
    M.font = c.fontWeight + ' ' + f + 'px ' + c.fontFamily;
    const m = M.measureText('H'), fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
    let lh = parseFloat(c.lineHeight);
    if (!(lh > 0)) lh = fa + fd;
    const hl = (lh - fa - fd) / 2;
    return [hl + fa - m.actualBoundingBoxAscent, hl + fd];
  }

  /** Visible (non-transparent) top/bottom of a logo image as fractions of its height. */
  private logoInk(src: string | undefined) {
    if (!src) return { t: 0, b: 1 };
    if (!this.inkCache[src]) {
      this.inkCache[src] = { t: 0, b: 1 };
      const im = new Image();
      im.onload = () => {
        try {
          const ar = (im.naturalWidth || 400) / (im.naturalHeight || 160) || 2.5;
          const w = 400, h = Math.max(1, Math.round(w / ar));
          const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
          const x = cv.getContext('2d')!;
          x.drawImage(im, 0, 0, w, h);
          const d = x.getImageData(0, 0, w, h).data;
          let t = -1, b = -1;
          for (let r = 0; r < h; r++) {
            for (let k = 0; k < w; k++) {
              if (d[(r * w + k) * 4 + 3] > 20) { if (t < 0) t = r; b = r; break; }
            }
          }
          if (t >= 0) this.inkCache[src] = { t: t / h, b: (b + 1) / h };
        } catch { /* tainted canvas: keep the full box */ }
        setTimeout(this.onAsync, 0);
      };
      im.src = src;
    }
    return this.inkCache[src];
  }

  /** Shift the code so its glyph ink, not its line box, is centred in the pill (SI). */
  private centerCode(el: HTMLElement) {
    el.style.transform = 'none';
    const k = this.inkIns(el);
    el.style.transform = 'translateY(' + -(k[0] - k[1]) / 2 + 'px)';
  }

  // ---------- Casino / Sweepstakes (single offer text) ----------

  /** Largest code font that fits the pill's text width. */
  fitCode(el: HTMLElement | null, textMax: number, maxF: number) {
    if (!el) return;
    let lo = 14, hi = maxF, best = 14;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      if (el.scrollWidth <= textMax) { best = mid; lo = mid; } else hi = mid;
    }
    el.style.fontSize = Math.floor(best) + 'px';
  }

  /** Largest offer font that keeps within the box width, max height and line count. */
  fitSingle(hl: HTMLElement | null, maxF: number, maxH: number, maxLines: number) {
    if (!hl) return;
    let lo = 20, hi = maxF, best = 20;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      hl.style.fontSize = mid + 'px';
      const lh = parseFloat(getComputedStyle(hl).lineHeight) || mid;
      if (hl.scrollHeight <= maxH + 1 && hl.scrollHeight <= lh * (maxLines + 0.05) && hl.scrollWidth <= hl.clientWidth + 1) { best = mid; lo = mid; } else hi = mid;
    }
    hl.style.fontSize = Math.floor(best) + 'px';
  }

  /** Undo the structured layout's inline pill/logo sizing when switching to a single-offer category. */
  private resetSingle(roots: Record<TemplateKey, HTMLElement | null>) {
    (Object.keys(roots) as TemplateKey[]).forEach(k => {
      const r = roots[k]; if (!r) return;
      const lz = r.querySelector<HTMLElement>('[data-zone="logo"]');
      if (lz) { lz.style.left = ''; lz.style.top = ''; lz.style.width = ''; }
      const pill = r.querySelector<HTMLElement>('[data-pill]'); if (!pill) return;
      Object.assign(pill.style, { height: '', minWidth: '', padding: '26px 64px', boxShadow: '0 0 0 14px ' + pill.dataset.ring + ',0 18px 50px rgba(0,0,0,.45)' });
      const lb = pill.previousElementSibling as HTMLElement | null;
      if (lb) lb.style.fontSize = { t1: '33px', t2: '24px', t3: '24px' }[k];
      if (pill.parentElement) pill.parentElement.style.transform = 'none';
    });
  }

  private runSingle(roots: Record<TemplateKey, HTMLElement | null>) {
    this.resetSingle(roots);
    const q = (k: TemplateKey, sel: string) => roots[k]?.querySelector<HTMLElement>(sel) ?? null;
    // textMax = pill max-width minus its horizontal padding.
    const sc = TWEAKS.codePillScale;
    this.fitCode(q('t1', '[data-code]'), 706, 102 * sc);
    this.fitCode(q('t2', '[data-code]'), 556, 102 * sc);
    this.fitCode(q('t3', '[data-code]'), 396, 102 * sc);
    this.fitSingle(q('t1', '[data-hl]'), 200, 330, 3);
    this.fitSingle(q('t2', '[data-hl]'), 140, 220, 2);
    this.fitSingle(q('t3', '[data-hl]'), 120, 190, 2);
  }

  // ---------- Sportsbooks / Prediction Markets (zone grid) ----------

  /** Hero lines share one size, maximised to the zone; sub/eyebrow = ½ hero, one line, shrink to width. */
  private fitStack(key: TemplateKey, inp: LayoutInput, W: number, avail: number): StackFit {
    const oz = inp.root!.querySelector<HTMLElement>('[data-zone="offer"]');
    if (!oz) return { warn: false, h: 0 };
    const st = oz.querySelector<HTMLElement>('[data-stack]')!, wrap = st.querySelector<HTMLElement>('[data-role="heroes"]')!;
    st.style.width = W + 'px'; st.style.transition = 'none'; st.style.transform = 'none';
    const eye = st.querySelector<HTMLElement>('[data-role="small"]'), sub = st.querySelector<HTMLElement>('[data-role="qual"]');
    const ev = vis(eye), sv = vis(sub);
    const heroes = ([...wrap.children] as HTMLElement[]).filter(vis);
    const fs = (e: HTMLElement, p: number) => { e.style.fontSize = p + 'px'; };
    const capW = inp.cat === 'predictions' && key !== 't3' ? W * 0.82 : W;
    const apply = (h: number) => {
      heroes.forEach(e => fs(e, h));
      [ev ? eye : null, sv ? sub : null].forEach(e => {
        if (!e) return;
        e.style.margin = '0px';
        const f = 0.5 * h; fs(e, f);
        const w = e.offsetWidth;
        if (w > capW) fs(e, Math.floor(f * capW / w * 10) / 10);
      });
      const gapR = this.site.layout.subGapRatio;
      if (gapR != null && sv && sub && heroes.length) {
        // SI: sub line sits gapR × hero size below the headline, measured ink to ink.
        const last = heroes[heroes.length - 1], c = this.inkIns(last), s0 = this.inkIns(sub), cap = last.offsetHeight - c[0] - c[1];
        sub.style.marginTop = gapR * h - cap - (c[1] + s0[0]) + 'px';
      }
      if (ev && eye && heroes.length) {
        // Gap eyebrow→headline matches the headline→sub line gap, measured on glyph ink.
        const a = this.inkIns(eye), b = this.inkIns(heroes[0]), c = this.inkIns(heroes[heroes.length - 1]);
        eye.style.marginBottom = (c[1] + a[0]) - (a[1] + b[0]) + 'px';
      }
    };
    const ok = () => st.offsetHeight <= avail + 1 && heroes.every(e => e.offsetWidth <= W + 1) && (!ev || eye!.offsetWidth <= W + 1);
    // SI Wide Banner with no code: let the offer fill the full width, then settle at 85%.
    const fill = this.site.layout.wideNoCodeFill && key === 't2' && !inp.state.showPromo;
    let lo = 40, hi = fill ? 700 : key === 't2' ? this.site.layout.heroMaxWide : HERO_MAX[key], warn = false;
    apply(lo); if (!ok()) warn = true;
    for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; apply(m); if (ok()) lo = m; else hi = m; }
    if (!warn && (inp.cat === 'predictions' || (key !== 't1' && !inp.state.showPromo))) lo *= fill ? 0.85 : 0.8;
    const ref = Math.floor(lo); apply(ref);
    const h = st.offsetHeight, mw = Math.max(0, ...heroes.map(e => e.offsetWidth), ev ? eye!.offsetWidth : 0);
    const f = warn ? Math.min(1, h ? avail / h : 1, mw ? W / mw : 1) : 1;
    const baseT = f < 0.999 ? 'scale(' + f + ')' : 'none';
    st.style.transform = baseT;
    return { warn, h: h * f, ref, f, baseT, st };
  }

  /** Ease the offer stack from its previous size/position when the layout changes (e.g. code toggle). */
  private flipStack(key: TemplateKey, res: StackFit, cy: number) {
    if (!res.st || res.ref == null) return;
    const { st, ref, f = 1, baseT = 'none' } = res;
    const prev = this.flip[key];
    this.flip[key] = { cy, ref };
    if (prev && (Math.abs(prev.ref - ref) > 1 || Math.abs(prev.cy - cy) > 1)) {
      st.style.transform = 'translateY(' + (prev.cy - cy) + 'px) scale(' + (prev.ref / ref * f) + ')';
      void st.offsetWidth;
      st.style.transition = 'transform 260ms ease';
      st.style.transform = baseT;
    }
  }

  /** Size the promo pill from the fixed spec; shrink the code only if it would overflow. */
  private stylePill(key: TemplateKey, cz: HTMLElement, colW: number) {
    const P = PILL[key], s = P.s, h = P.h * s, ring = 0.08 * h, pad = P.pad * s, lab = P.lab * s;
    const max = Math.min(P.max * s, colW - 2 * ring), min = Math.min(P.min * s, max);
    const u = cz.firstElementChild as HTMLElement, lb = u.children[0] as HTMLElement;
    const pill = u.querySelector<HTMLElement>('[data-pill]')!, cp = pill.querySelector<HTMLElement>('[data-code]')!;
    u.style.transform = 'none';
    lb.style.fontSize = lab + 'px'; lb.style.marginTop = '0px';
    Object.assign(pill.style, {
      height: h + 'px', minWidth: min + 'px', maxWidth: max + 'px', padding: '0 ' + pad + 'px', boxSizing: 'border-box',
      marginTop: P.gap * s + ring + 'px',
      boxShadow: this.site.plainPill ? '0 18px 50px rgba(0,0,0,.45)' : '0 0 0 ' + ring + 'px ' + (pill.dataset.ring || 'transparent') + ',0 18px 50px rgba(0,0,0,.45)',
    });
    let f = P.fs * s; cp.style.fontSize = f + 'px';
    const inner = max - 2 * pad - 16;
    while (cp.scrollWidth > inner && f > lab + 1) { f--; cp.style.fontSize = f + 'px'; }
    if (this.site.plainPill) this.centerCode(cp);
    return { need: u.offsetHeight + 2 * ring, w: pill.offsetWidth, h: pill.offsetHeight, f, P, maxU: max / s };
  }

  /** Zone grid for one format. Returns a warning label ('' when everything fits). */
  private layoutKey(key: TemplateKey, inp: LayoutInput): string {
    const root = inp.root; if (!root) return '';
    const q = (n: string) => root.querySelector<HTMLElement>('[data-zone="' + n + '"]');
    const lz = q('logo'), oz = q('offer'), cz = q('code'), tz = q('tcs');
    if (!lz || !oz || !tz) return '';
    const tl = lz.querySelector<HTMLElement>('[data-textlogo]');
    if (tl) {
      // SI "No Logo": shrink the brand name until it fits its box.
      let f = parseFloat(tl.style.fontSize) || 60; tl.style.fontSize = f + 'px';
      while (tl.scrollWidth > tl.clientWidth + 1 && f > 10) { f--; tl.style.fontSize = f + 'px'; }
    }
    const C = CFG[key], s = inp.state, W = C.W, H = C.H, L = this.site.layout;
    const xl = key === 't2' ? L.wideX[0] : C.xl, xr = key === 't2' ? L.wideX[1] : C.xr;
    const sq = key === 't1' && !cz;
    const mW = (key === 't3' ? 0.06 : sq ? 0.03 : 0.045) * W, mH = (sq ? 0.05 : 0.06) * H;
    const place = (el: HTMLElement, x0: number, x1: number, y0: number, y1: number, noH?: boolean) => {
      const o = el.style; o.left = x0 + 'px'; o.top = y0 + 'px'; o.width = x1 - x0 + 'px'; if (!noH) o.height = y1 - y0 + 'px';
    };
    const wideFill = L.wideNoCodeFill && key === 't2' && !s.showPromo;
    const base: [number, number] = wideFill ? [mW, W - mW] : [Math.max(mW, xl), Math.min(W - mW, xr)], mid = (base[0] + base[1]) / 2;
    const circ = ([[C.bt, s.ballTopDX, s.ballTopDY], [C.bb, s.ballBottomDX, s.ballBottomDY]] as [Circle, number, number][])
      .map(([c, dx, dy]) => ({ x: c.x + (dx || 0), y: c.y + (dy || 0), r: 0.46 * c.s + 24 }));
    // Horizontal span between y0..y1; on Banner + App it narrows to clear the balls.
    const span = (y0: number, y1: number): [number, number] => {
      if (key !== 't3') return [base[0], base[1]];
      let ins = 0;
      circ.forEach(c => {
        const dy = y1 < c.y ? c.y - y1 : (y0 > c.y ? y0 - c.y : 0);
        if (dy < c.r) { const hh = Math.sqrt(c.r * c.r - dy * dy); ins = Math.max(ins, c.x <= mid ? c.x + hh - base[0] : base[1] - (c.x - hh)); }
      });
      ins = Math.min(Math.max(ins, 0), (base[1] - base[0]) * 0.3);
      return [base[0] + ins, base[1] - ins];
    };
    const bot = H - Math.max(mH, (s.showCovers && C.cov) ? C.cov.o + C.cov.h + 0.02 * H : 0), top = mH;
    const te = tz.firstElementChild as HTMLElement;
    const meas = (w: number) => {
      tz.style.width = w + 'px'; tz.style.height = 'auto';
      let f = C.tp; te.style.fontSize = f + 'px';
      let h = te.offsetHeight;
      while (h > 0.25 * H && f > C.tm) { f--; te.style.fontSize = f + 'px'; h = te.offsetHeight; }
      return h;
    };
    const cl = (h: number) => Math.min(Math.max(h, 1), 0.25 * H);
    const V = { lf: sq ? 0.1 : key === 't1' ? 0.14 : 0.11, gf: 60 / 1080 };

    // Pass 1: reserve logo, fine print and code zones; the offer gets the rest.
    const g = V.gf * H, logoH = V.lf * H;
    place(lz, base[0], base[1], top, top + logoH);
    lz.style.transition = 'none';
    const lf = sq ? Math.min(V.lf / 0.1, 0.45 * W / Math.max(1, ...([...lz.children] as HTMLElement[]).map(e => e.offsetWidth))) : 1;
    ([...lz.children] as HTMLElement[]).forEach(e => { e.style.transition = 'transform 260ms ease'; e.style.transform = lf > 1.001 ? 'scale(' + lf + ')' : 'none'; });
    let sp = base, h0 = 0, fine = 0.08 * H;
    for (let i = 0; i < 3; i++) { h0 = meas(sp[1] - sp[0]); fine = cl(h0); sp = span(bot - fine, bot); }
    const warnF = h0 > 0.25 * H + 1;
    place(tz, sp[0], sp[1], bot - fine, bot);
    const fy0 = bot - fine;
    let cH = 0, pv: ReturnType<LayoutEngine['stylePill']> | null = null;
    if (cz) { pv = this.stylePill(key, cz, base[1] - base[0]); cH = pv.need; }
    const gc = 60 / 1080 * H;
    const oH = Math.max(60, fy0 - top - logoH - (1 + L.logoGap) * g - (cz ? gc : 0) - cH), oy0p = top + logoH + g, oy1p = oy0p + oH;
    let osp: [number, number] = [base[0], base[1]], res: StackFit = { warn: false, h: 0 };
    const yc0 = (oy0p + oy1p) / 2, maxI = (base[1] - base[0]) * 0.3;
    const tryIns = (ins: number) => {
      osp = [base[0] + ins, base[1] - ins]; place(oz, osp[0], osp[1], oy0p, oy1p);
      res = this.fitStack(key, inp, osp[1] - osp[0], oH);
      return span(yc0 - res.h / 2, yc0 + res.h / 2)[0] - base[0];
    };
    if (tryIns(0) > 1) { let lo = 0, hi = maxI; for (let i = 0; i < 7; i++) { const m = (lo + hi) / 2; if (tryIns(m) <= m + 1) hi = m; else lo = m; } tryIns(hi); }
    // Empty space around the offer when it is centred in its zone (debug readout).
    const sh = Math.max(0, oH - res.h) / 2, pOb1 = oy1p - sh, pCy1 = oy1p + gc - sh + cH;
    const above = pOb1 - res.h - (top + logoH), below = cz ? fy0 - pCy1 : fy0 - pOb1;

    // Pass 2: stack logo / offer / code / fine print with equal gaps between their
    // visible ink (not their boxes), then centre the whole block vertically.
    const le = lz.firstElementChild as HTMLElement | null;
    const um = le && /url\("?([^")]+)"?\)/.exec(getComputedStyle(le).backgroundImage || '');
    const lk = this.logoInk(um ? um[1] : undefined);
    const lT = le ? le.offsetTop + lk.t * le.offsetHeight : 0, lB = le ? le.offsetTop + lk.b * le.offsetHeight : logoH;
    const sv = ([...oz.querySelectorAll('[data-role="small"],[data-role="hero"],[data-role="qual"]')] as HTMLElement[]).filter(vis);
    const oi0 = sv.length ? this.inkIns(sv[0])[0] : 0, oi1 = sv.length ? this.inkIns(sv[sv.length - 1])[1] : 0, ti = this.inkIns(te);
    const ring = cz ? 0.08 * PILL[key].h * PILL[key].s : 0;
    const uH = pv ? pv.need - 2 * ring : 0, Ch = pv ? pv.need - ring : 0, nG = cz ? 3 : 2;
    const G = 60 / 1080 * H, Lh = lB - lT, Oh = res.h - oi0 - oi1, Th = fine - ti[0] - ti[1];
    const tot = Lh + Oh + Th + Ch + nG * G + (L.logoGap - 1) * G;
    const y0 = top + (bot - top - tot) / 2;
    const lt = y0 - lT;
    const ob0 = y0 + Lh + L.logoGap * G - oi0, ob1 = ob0 + res.h;
    let nb = ob1 - oi1, cs: [number, number] | null = null, cy0 = 0, cy1 = 0;
    if (cz) {
      const cv0 = nb + G; cy0 = cv0 + uH / 2 - cH / 2; cy1 = cy0 + cH;
      cs = span(cy0, cy1); place(cz, cs[0], cs[1], cy0, cy1); nb = cv0 + Ch;
    }
    const fy = nb + G - ti[0];
    place(lz, base[0], base[1], lt, lt + logoH); place(oz, osp[0], osp[1], ob0, ob1); place(tz, sp[0], sp[1], fy, fy + fine);
    this.flipStack(key, res, (ob0 + ob1) / 2);

    if (inp.showZones) this.drawZones(key, root, { mW, mH, W, H, base, lt, logoH, ob0, ob1, osp, cs, cy0, cy1, sp, fy, bot, above, below, res, pv, oz });
    return [warnF && 'fine print', res.warn && 'offer'].filter(Boolean).join(' + ');
  }

  private drawZones(key: TemplateKey, root: HTMLElement, z: {
    mW: number; mH: number; W: number; H: number; base: [number, number]; lt: number; logoH: number;
    ob0: number; ob1: number; osp: [number, number]; cs: [number, number] | null; cy0: number; cy1: number;
    sp: [number, number]; fy: number; bot: number; above: number; below: number; res: StackFit;
    pv: ReturnType<LayoutEngine['stylePill']> | null; oz: HTMLElement;
  }) {
    const dz = (n: string, x0: number, y0: number, x1: number, y1: number) => {
      const e = root.querySelector<HTMLElement>('[data-dz="' + n + '"]');
      if (e) { const o = e.style; o.left = x0 + 'px'; o.top = y0 + 'px'; o.width = x1 - x0 + 'px'; o.height = y1 - y0 + 'px'; }
    };
    const { W, H, base } = z;
    dz('safe', z.mW, z.mH, W - z.mW, H - z.mH); dz('logo', base[0], z.lt, base[1], z.lt + z.logoH);
    dz('offer', base[0], z.ob0, base[1], z.ob1); dz('box', z.osp[0], z.ob0, z.osp[1], z.ob1);
    if (z.cs) dz('code', z.cs[0], z.cy0, z.cs[1], z.cy1);
    const cd = root.querySelector<HTMLElement>('[data-dz="code"]'); if (cd) cd.style.display = z.cs ? 'block' : 'none';
    dz('tcs', z.sp[0], z.fy, z.sp[1], z.bot);
    const rd = root.querySelector<HTMLElement>('[data-dz="readout"]'); if (!rd) return;
    const S = key === 't1' ? 1 : 1294 / 976, st = z.oz.querySelector<HTMLElement>('[data-stack]')!, ff = z.res.f || 1;
    const hs = ([...st.querySelectorAll('[data-role="hero"]')] as HTMLElement[]).filter(vis).map(e => Math.round(parseFloat(e.style.fontSize) * ff / S));
    const same = hs.every(v => v === hs[0]);
    const ln = (txt: string, bad: boolean) => '<div style="color:' + (bad ? '#ff4d4d' : '#ffffff') + '">' + txt + (bad ? '  ✕' : '') + '</div>';
    const badE = Math.max(z.above, z.below) > 0.12 * H;
    let html = ln('EMPTY ↑ ' + Math.round(z.above / S) + 'px (' + (z.above / H * 100).toFixed(1) + '%)  ↓ ' + Math.round(z.below / S) + 'px (' + (z.below / H * 100).toFixed(1) + '%)', badE)
      + ln('HERO ' + (hs.length ? hs[0] + 'px × ' + hs.length + (same ? ' · lines match' : ' · MISMATCH ' + hs.join('/')) : '—'), !same);
    if (z.pv) {
      const pw = Math.round(z.pv.w / S), ph = Math.round(z.pv.h / S), cf = Math.round(z.pv.f / S), T = z.pv.P;
      html += ln('PILL ' + pw + ' × ' + ph + 'px (min ' + T.min + ' × ' + T.h + ')', ph < T.h - 0.5 || pw < Math.min(T.min, z.pv.maxU) - 0.5)
        + ln('CODE ' + cf + 'px (target ' + T.fs + ') · label ' + T.lab + 'px', cf < T.fs - 0.5);
    }
    html += '<div style="color:#8a93a0;font-size:.75em">px at export size' + (S === 1 ? '' : ' (976 × 549)') + '</div>';
    rd.innerHTML = html; rd.style.whiteSpace = 'pre'; rd.style.borderColor = /✕/.test(html) ? '#ff4d4d' : '#ffffff';
    rd.style.left = base[0] + 10 + 'px'; rd.style.top = z.ob1 - rd.offsetHeight - 8 + 'px';
  }

  /** Lay out all three canvases. Returns the fit warning for the shared panel ('' when all fit). */
  run(cat: CategoryId, showZones: boolean, states: Record<TemplateKey, TemplateState>, roots: Record<TemplateKey, HTMLElement | null>): string {
    if (cat === 'casino' || cat === 'sweepstakes') { this.runSingle(roots); return ''; }
    return this.site.templates
      .map(k => { const r = this.layoutKey(k, { cat, showZones, state: states[k], root: roots[k] }); return r ? FORMAT_NAMES[k] + ' (' + r + ')' : ''; })
      .filter(Boolean).join(', ');
  }
}
