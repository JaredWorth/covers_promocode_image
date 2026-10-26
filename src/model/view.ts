import { asset } from '../data/assets';
import { ballsFor, booksFor, DEFAULT_TCS, isSingleCat } from '../data/catalog';
import type { Brand, CategoryId, TemplateKey, TemplateState } from '../data/types';
import { SBR_BACKGROUNDS, SPORTS, type Site } from '../site';

// Values the prototype exposed in its design-tool "Tweaks" panel, fixed at
// the defaults the design shipped with.
export const TWEAKS = {
  codePillScale: 1.15,
  arrowX: 59,
  arrowY: 0,
  arrowFlipV: false,
  codeX: 17,
  codeY: 44,
  codeSize: 28,
  codeBg: '#ffffff',
  codeMinW: 48,
};

export interface ViewCtx {
  site: Site;
  cat: CategoryId;
  showZones: boolean;
  /** Logo aspect ratio by URL, or 0 while loading. */
  aspect: (src: string) => number;
  /** Tinted ball URL, or the source until the tint is ready. */
  recolor: (src: string, color: string | null) => string;
  /** SI: brand-recoloured sport background URL. */
  sportBg: (src: string, bg: string, accent: string, light: boolean) => string;
  /** SBR: tinted background photo URL. */
  tintPhoto: (src: string, color: string, dark: number) => string;
}

const hex6 = (v: string | null | undefined) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v! : null);
/** WCAG relative luminance of a #rrggbb colour. */
const luminance = (h: string) => {
  const c = [1, 3, 5].map(i => { const v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const BALL_XFORM: Record<TemplateKey, { top: string; bottom: string }> = {
  t1: { top: 'rotate(-9deg)', bottom: '' },
  t2: { top: 'rotate(-14deg)', bottom: '' },
  t3: { top: 'translate(-60px, 0px) rotate(-18deg)', bottom: 'rotate(8deg)' },
};

const nz = (v: unknown) => String(v == null ? '' : v).trim();
const px = (n: number) => Math.round(n) + 'px';

export type View = ReturnType<typeof computeView>;

/** Everything a template and its controls render, derived from state + brand. */
export function computeView(key: TemplateKey, s: TemplateState, ctx: ViewCtx) {
  const single = isSingleCat(ctx.cat);
  const books = booksFor(ctx.site, ctx.cat), balls = ballsFor(ctx.cat);
  const b0: Brand = books[s.book] || books.betmgm || Object.values(books)[0];
  const accent = s.accentC || b0.accent;

  // Balls: brand tint unless overridden, uploaded, or a no-tint coin.
  const ballTop = balls[s.ballTop] || Object.values(balls)[0];
  const ballBottom = balls[s.ballBottom] || Object.values(balls)[1] || ballTop;
  const ballTopSrc = s.ballTopOv || asset(ballTop.src);
  const ballBottomSrc = s.ballBottomOv || asset(ballBottom.src);
  const brandTint = b0.ballTint || b0.accent;
  const topTint = s.ballColorC || ((s.ballTopOv || ballTop.notint) ? null : brandTint);
  const botTint = s.ballColorC || ((s.ballBottomOv || ballBottom.notint) ? null : brandTint);
  const sizeFor = (ball: typeof ballTop, ov: string | null) => {
    const sc = (!ov && ball.scale) || 1;
    return sc === 1 ? 'contain' : sc * 100 + '%';
  };

  // Pill colours. Covers: a light tint of the accent, and light-background brands keep their
  // own dark pill. SI: always a white pill.
  const own = !!b0.darkWord, plain = ctx.site.pill === 'plain', band = ctx.site.pill === 'band';
  const pillFill = plain ? '#ffffff' : s.pillBgC || (own ? b0.pillBg : `color-mix(in srgb, ${accent} 30%, #ffffff)`);
  const pillLabel = own ? (b0.promoLabelColor || (plain ? b0.text : pillFill)) : `color-mix(in srgb, ${accent} 50%, #ffffff)`;

  // SBR: one brand colour drives the background tint and the code band; code text picks
  // white or near-black by contrast.
  const photo = ctx.site.decor === 'photo';
  const brandC = hex6(s.bgC) || b0.brand || (hex6(b0.bg) && luminance(b0.bg) > 0.02 ? b0.bg : hex6(b0.accent) || '#0078FF');
  const bandFill = hex6(s.pillBgC) || brandC, bl = luminance(bandFill);
  const bandText = 1.05 / (bl + 0.05) >= (bl + 0.05) / 0.054 ? '#ffffff' : '#0b0f0d';
  const bgPhoto = SBR_BACKGROUNDS.find(x => x.id === s.ballTop) || SBR_BACKGROUNDS[0];
  const overlay = hex6(s.ballColorC) || hex6(s.bgC);

  // Logo box sizing from the logo's aspect ratio.
  const logoFile = s.logoOv || asset(b0.logo);
  const textLogo = ctx.site.textLogo && s.textLogo;
  const ar = (logoFile && ctx.aspect(logoFile)) || 2.5;
  let lg: { box: string; h: string; w: string };
  if (single) {
    const P = { t1: [110000, 190, 640], t2: [55000, 130, 480], t3: [56000, 120, 460] }[key];
    const cs = b0.logoScale || 1;
    const h = Math.min(P[1] * cs, Math.sqrt(P[0] / ar) * cs), w = Math.min(P[2] * cs, h * ar);
    lg = { box: P[1] + 'px', h: px(h), w: px(w) };
  } else {
    const D = { t1: [1080, 1080], t2: [1294, 728], t3: [1294, 728] }[key];
    const sqn = key === 't1' && !s.showPromo, ls = b0.logoScale || 1;
    const zh = (key === 't1' ? (sqn ? 0.1 : 0.14) : 0.11) * D[1] * ls;
    const mw = Math.min((key === 't1' ? (sqn ? 0.45 : 0.4) : 0.32) * D[0] * ls, key === 't3' ? 520 * ls : 1e9);
    const h = Math.min(zh, mw / ar);
    lg = { box: px(zh), h: px(h), w: px(h * ar) };
  }

  const eyebrow = nz(s.eyebrow), l1 = nz(s.line1), l2 = nz(s.line2), qual = nz(s.sub);
  const brandTcs = s.tcsByBrand[s.book] ?? (b0.tcs || DEFAULT_TCS);
  const fullTcs = brandTcs + (nz(s.stateNote) ? ' ' + nz(s.stateNote) : '');
  const tcsMTSingle = { t1: '22px', t2: '14px', t3: '20px' }[key];
  const textLogoW = { t1: 640, t2: 600, t3: 520 }[key];
  const sport = SPORTS.find(x => x.id === s.sport) || SPORTS[0];
  const screen = s.screenByBrand[s.book] || (b0.screen ? asset(b0.screen) : '');

  return {
    key, site: ctx.site, single, structured: !single, book: b0,
    bg: s.bgC || b0.bg, text: s.textC || b0.text, accent,
    lightLogo: own, showCovers: s.showCovers,

    // Offer (Casino / Sweepstakes)
    amount: s.amount,

    // Offer (structured)
    eyebrow: s.eyebrow ?? '', eyeOn: !!eyebrow, l1, l2, sub: qual,
    eyeLock: !eyebrow && !!qual, subLock: !qual && !!eyebrow,
    eyePh: !eyebrow && qual ? 'Not enough room for this' : 'e.g. EXCLUSIVE',
    subPh: !qual && eyebrow ? 'Not enough room for this' : 'e.g. IN BONUS BETS',
    heroColor: s.textC || (s.heroAccentOn && b0.heroAccent ? accent : (own ? b0.text : '#ffffff')),
    hasHeroAccent: !single && !!b0.heroAccent,
    brandTcs, tcsEdited: s.tcsByBrand[s.book] !== undefined,

    // Fine print
    tcs: single ? s.tcs : fullTcs,
    tcsFS: single ? { t1: '25px', t2: '17px', t3: '21px' }[key] : undefined,
    tcsW: single ? 'auto' : '100%',
    tcsMT: single ? tcsMTSingle : '0px',

    // Column / zones
    colPad: single ? { t1: '0 80px', t2: '0 60px', t3: '0 44px' }[key] : '0px',
    colJustify: single ? 'center' : 'flex-start',
    colLeft: single ? { t1: '6px', t2: '14px', t3: '0px' }[key] : '0px',
    colTop: single ? { t1: '-49px', t2: '3px', t3: '0px' }[key] : '0px',
    colBox: single ? { l: '24px', t: '15px', w: '697px', h: '709px' } : { l: '0px', t: '0px', w: '1294px', h: '728px' },
    zPos: (single ? 'static' : 'absolute') as 'static' | 'absolute',
    zDisp: single ? 'contents' : 'flex',
    lblMT: single ? { t1: '32px', t2: '14px', t3: '18px' }[key] : '0px',
    pillMT: single ? { t1: '14px', t2: '20px', t3: '22px' }[key] : '12px',
    pillMaxW: single ? { t1: '850px', t2: '700px', t3: '540px' }[key] : 'none',
    hlLH: single ? '1' : '.9',
    hlTT: (single ? 'uppercase' : 'none') as 'uppercase' | 'none',
    showDebug: !single && ctx.showZones,

    // Promo code
    showPromo: s.showPromo, promoLabel: s.promoLabel, code: s.code,
    promoLabelC: pillLabel, pillBg: band ? bandFill : pillFill,
    pillGrad: `linear-gradient(90deg, color-mix(in srgb, ${bandFill} 72%, #000000) 0%, ${bandFill} 50%, color-mix(in srgb, ${bandFill} 72%, #000000) 100%)`,
    pillText: s.pillTextC || (band ? bandText : own && !plain ? b0.pillText : '#0c0a06'),
    pillBorder: own ? b0.bg : '#ffffff',
    pillRing: `color-mix(in srgb, ${pillFill} 25%, transparent)`,

    // Balls
    ballTopUrl: ctx.recolor(ballTopSrc, topTint),
    ballBottomUrl: ctx.recolor(ballBottomSrc, botTint),
    ballTopSize: sizeFor(ballTop, s.ballTopOv),
    ballBottomSize: sizeFor(ballBottom, s.ballBottomOv),
    ballTopTransform: `translate(${s.ballTopDX || 0}px, ${s.ballTopDY || 0}px) ${BALL_XFORM[key].top}`,
    ballBottomTransform: `translate(${s.ballBottomDX || 0}px, ${s.ballBottomDY || 0}px) ${BALL_XFORM[key].bottom}`,
    ballColorInput: s.ballColorC || ctx.site.theme['--accent'],
    bgInput: s.bgC || (photo ? b0.brand || hex6(b0.bg) || hex6(b0.accent) || '#000000' : hex6(b0.bg) || '#000000'),
    photoUrl: photo ? ctx.tintPhoto(asset(bgPhoto.src), overlay || b0.tint || brandC, overlay ? 0 : b0.dark || 0) : '',

    // Logo
    logoSrc: textLogo ? '' : logoFile, logoW: lg.w, logoH: lg.h, logoBoxH: lg.box,
    textLogo, textLogoName: b0.name, textLogoC: own ? b0.text : '#ffffff', textLogoW: textLogoW + 'px',
    textLogoFS: Math.round(Math.min(parseFloat(lg.h) * 0.9, textLogoW / (Math.max(4, b0.name.length) * 0.6))) + 'px',

    // SI sport background
    sportBgUrl: ctx.site.decor === 'sport' ? ctx.sportBg(asset(sport.src), s.bgC || b0.bg, s.accentC || b0.ballTint || b0.accent, own) : '',

    // Banner + App Screen
    screen,
    overlayOn: s.showPromo && (ctx.site.arrow === 'curved' ? s.showArrow !== false : s.showOverlay !== false),
    arrowTransform: `translate(${TWEAKS.arrowX + (s.arrowX || 0)}px, ${TWEAKS.arrowY + (s.arrowY || 0)}px) scale(1, ${TWEAKS.arrowFlipV !== !!s.arrowFlipV ? -1 : 1})`,
    phoneCode: {
      left: TWEAKS.codeX + '%', top: TWEAKS.codeY + '%', font: TWEAKS.codeSize + 'px',
      bg: TWEAKS.codeBg, minW: TWEAKS.codeMinW + '%',
    },
  };
}
