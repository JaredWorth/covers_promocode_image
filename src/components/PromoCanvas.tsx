import { forwardRef, type CSSProperties } from 'react';
import { asset } from '../data/assets';
import type { TemplateKey } from '../data/types';
import type { View } from '../model/view';

// One export canvas (Square 1080², Wide / Banner + App 1294×728). The layout
// engine positions the [data-zone] elements after render, so the DOM structure
// and data attributes here are part of its contract.

interface BallGeo { style: CSSProperties; shadow: string }
interface FormatGeo {
  W: number; H: number;
  ballTop: BallGeo; ballBottom: BallGeo;
  /** Paint the bottom ball after the Covers footer (Square), so it overlaps it. */
  bottomBallLast: boolean;
  fallback: { box: number; radius: number; border: number; initial: number; word: number; gap: number };
  single: { font: number; letterSpacing: string; width: number; maxH: number };
  labelSize: number;
  /** Footer logo placement (its height comes from the site profile). */
  covers: { bottom: number; gap: number } | null;
}

const SHADOW_SQ = 'drop-shadow(0 24px 44px rgba(0,0,0,.55))';
const SHADOW_WIDE = 'drop-shadow(0 20px 38px rgba(0,0,0,.55))';

const GEO: Record<TemplateKey, FormatGeo> = {
  t1: {
    W: 1080, H: 1080,
    ballTop: { style: { top: -78, left: -118, width: 372, height: 372, zIndex: 1 }, shadow: SHADOW_SQ },
    ballBottom: { style: { left: 620, top: 726, width: 711, height: 531, zIndex: 1 }, shadow: SHADOW_SQ },
    bottomBallLast: true,
    fallback: { box: 88, radius: 12, border: 5, initial: 52, word: 72, gap: 18 },
    single: { font: 250, letterSpacing: '-3px', width: 850, maxH: 365 },
    labelSize: 33,
    covers: { bottom: 18, gap: 18 },
  },
  t2: {
    W: 1294, H: 728,
    ballTop: { style: { top: -66, left: -82, width: 386, height: 386, zIndex: 'auto' }, shadow: SHADOW_WIDE },
    ballBottom: { style: { left: 931, top: 398, width: 482, height: 482, zIndex: 1 }, shadow: SHADOW_WIDE },
    bottomBallLast: false,
    fallback: { box: 64, radius: 10, border: 4, initial: 38, word: 54, gap: 14 },
    single: { font: 205, letterSpacing: '-2px', width: 980, maxH: 300 },
    labelSize: 24,
    covers: { bottom: 20, gap: 12 },
  },
  t3: {
    W: 1294, H: 728,
    ballTop: { style: { top: -102, left: 738, width: 346, height: 364, zIndex: 1 }, shadow: SHADOW_WIDE },
    ballBottom: { style: { left: 948, top: 438, width: 476, height: 476, zIndex: 1 }, shadow: SHADOW_WIDE },
    bottomBallLast: false,
    fallback: { box: 76, radius: 11, border: 5, initial: 44, word: 62, gap: 16 },
    single: { font: 182, letterSpacing: '-2px', width: 650, maxH: 300 },
    labelSize: 24,
    covers: null,
  },
};

const WAVE_MASK = 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)';
// Fonts come from the site profile. Covers licensing: Founders Grotesk Bold is only
// for the offer text and the promo code; everything else is Inter.

function Ball({ geo, url, size, transform }: { geo: BallGeo; url: string; size: string; transform: string }) {
  return (
    <div style={{
      position: 'absolute', ...geo.style, filter: geo.shadow,
      backgroundImage: `url("${url}")`, backgroundSize: size, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', transform,
    }} />
  );
}

function LogoZone({ v, g }: { v: View; g: FormatGeo }) {
  const f = g.fallback, b = v.book, FG = v.site.displayFont;
  return (
    <div data-zone="logo" style={{ position: v.zPos, height: v.logoBoxH, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {v.textLogo ? (
        <div data-textlogo="1" style={{ width: v.textLogoW, height: v.logoH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FG, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1, letterSpacing: '.01em', color: v.textLogoC, fontSize: v.textLogoFS }}>{v.textLogoName}</div>
      ) : v.logoSrc ? (
        <div style={{ width: v.logoW, height: v.logoH, backgroundImage: `url("${v.logoSrc}")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: f.gap }}>
          <div style={{ width: f.box, height: f.box, borderRadius: f.radius, border: `${f.border}px solid ${b.w2c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FG, fontWeight: 700, fontSize: f.initial, color: b.w2c }}>
            {b.name[0].toUpperCase()}
          </div>
          <div style={{ fontFamily: FG, fontWeight: 700, fontSize: f.word, lineHeight: 1, letterSpacing: '.5px' }}>
            <span style={{ color: b.w1c }}>{b.w1}</span><span style={{ color: b.w2c }}>{b.w2}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function OfferStack({ v }: { v: View }) {
  const lineBase: CSSProperties = { fontFamily: v.site.displayFont, fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' };
  return (
    <div data-zone="offer" style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div data-stack="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: v.heroColor, transformOrigin: 'center' }}>
        <div data-role="small" style={{ ...lineBase, display: v.eyeOn ? 'block' : 'none', lineHeight: 0.75 }}>{v.eyebrow}</div>
        <div data-role="heroes" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div data-role="hero" style={{ ...lineBase, display: v.l1 ? 'block' : 'none', letterSpacing: '-.01em', lineHeight: 0.88 }}>{v.l1}</div>
          <div data-role="hero" style={{ ...lineBase, display: v.l2 ? 'block' : 'none', letterSpacing: '-.01em', lineHeight: 0.88 }}>{v.l2}</div>
        </div>
        <div data-role="qual" style={{ ...lineBase, display: v.sub ? 'block' : 'none', lineHeight: 0.75 }}>{v.sub}</div>
      </div>
    </div>
  );
}

function SingleOffer({ v, g }: { v: View; g: FormatGeo }) {
  const sg = g.single;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80, maxHeight: sg.maxH }}>
      <div data-hl="1" style={{
        fontFamily: v.site.displayFont, fontWeight: 700, fontSize: sg.font, lineHeight: v.hlLH, textTransform: v.hlTT, color: v.text, marginTop: 0,
        letterSpacing: sg.letterSpacing, width: sg.width, textAlign: 'center', boxSizing: 'border-box', overflowWrap: 'normal', wordBreak: 'normal',
      }}>{v.amount}</div>
    </div>
  );
}

function CodeZone({ v, g }: { v: View; g: FormatGeo }) {
  if (v.site.pill === 'band') return <BandCode v={v} g={g} />;
  // SI: plain white pill without border or ring; the engine centres the code on its ink.
  const plain = v.site.pill === 'plain';
  return (
    <div data-zone="code" style={{ position: v.zPos, display: v.zDisp, alignItems: 'center', justifyContent: 'center' }}>
      <div data-unit="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transformOrigin: 'center' }}>
        <div style={{ fontFamily: v.site.labelFont, fontSize: g.labelSize, color: v.promoLabelC, letterSpacing: '.14em', marginTop: v.lblMT, fontWeight: 400, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{v.promoLabel}</div>
        <div data-pill="1" data-ring={v.pillRing} style={{
          marginTop: v.pillMT, width: 'fit-content', maxWidth: v.pillMaxW, overflow: 'hidden', padding: '26px 64px', background: v.pillBg, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: plain ? 'none' : `8px solid ${v.pillBorder}`,
          boxShadow: plain ? '0 18px 50px rgba(0,0,0,.45)' : `0 0 0 14px ${v.pillRing},0 18px 50px rgba(0,0,0,.45)`,
        }}>
          <span data-code="1" style={plain
            ? { fontFamily: v.site.displayFont, fontWeight: 900, fontSize: 96, color: v.pillText, letterSpacing: '.01em', whiteSpace: 'nowrap', lineHeight: 0.712, transform: 'none' }
            : { fontFamily: v.site.displayFont, fontWeight: 700, fontSize: 96, color: v.pillText, letterSpacing: '.01em', whiteSpace: 'nowrap', lineHeight: 0.712, position: 'relative', top: '0.185em', transform: 'none' }}>{v.code}</span>
        </div>
      </div>
    </div>
  );
}

/** SBR: white label band over a brand-gradient code band; the engine sizes both from the unit's width. */
function BandCode({ v, g }: { v: View; g: FormatGeo }) {
  const barlow = v.site.labelFont;
  return (
    <div data-zone="code" style={{ position: v.zPos, display: v.zDisp, alignItems: 'center', justifyContent: 'center' }}>
      <div data-unit="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', transformOrigin: 'center', marginTop: v.lblMT, width: 'fit-content', maxWidth: v.pillMaxW, borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 19px rgba(0,0,0,.25)' }}>
        <div data-role="lbl" style={{ fontFamily: barlow, fontWeight: 700, fontSize: g.labelSize, color: '#1b1b1b', background: '#ffffff', textAlign: 'center', padding: '14px 56px', textTransform: 'uppercase', whiteSpace: 'nowrap', letterSpacing: '.01em', lineHeight: 1.1 }}>{v.promoLabel}</div>
        <div data-pill="1" style={{ padding: '26px 64px', background: v.pillGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span data-code="1" style={{ fontFamily: barlow, fontWeight: 800, fontSize: 96, color: v.pillText, letterSpacing: '.01em', whiteSpace: 'nowrap', lineHeight: 1 }}>{v.code}</span>
        </div>
      </div>
    </div>
  );
}

function TcsZone({ v }: { v: View }) {
  return (
    <div data-zone="tcs" style={{ position: v.zPos, display: v.zDisp, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div data-role="tcs" style={{
        fontFamily: v.site.labelFont, fontSize: v.tcsFS, lineHeight: 1.25, color: v.text, opacity: 0.62, marginTop: v.tcsMT,
        width: v.tcsW, height: 'auto', overflow: 'visible', textAlign: 'center',
      }}>{v.tcs}</div>
    </div>
  );
}

const DEBUG_ZONES: [string, string, string, boolean][] = [
  ['safe', '#ffffff', 'SAFE 6%', true],
  ['logo', '#ff4fd8', 'LOGO', false],
  ['offer', '#35e0ff', 'OFFER', false],
  ['box', '#ff7a1a', 'TEXT BOX', true],
  ['code', '#ffd23a', 'CODE', false],
  ['tcs', '#6dff7a', 'FINE PRINT', false],
];

function DebugLayer({ on, font }: { on: boolean; font: string }) {
  return (
    <div data-debug="1" style={{ position: 'absolute', inset: 0, zIndex: 10000, pointerEvents: 'none', display: on ? 'block' : 'none' }}>
      <div data-dz="readout" style={{ position: 'absolute', zIndex: 2, font, color: '#ffffff', background: 'rgba(0,0,0,.75)', border: '2px solid #ffffff', padding: '4px 10px', whiteSpace: 'nowrap' }} />
      {DEBUG_ZONES.map(([id, c, label, dashed]) => (
        <div key={id} data-dz={id} style={{ position: 'absolute', border: `3px ${dashed ? 'dashed' : 'solid'} ${c}`, boxSizing: 'border-box' }}>
          <span style={{ position: 'absolute', left: 6, top: 3, font, color: c, background: 'rgba(0,0,0,.6)', padding: '0 6px', whiteSpace: 'nowrap' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function CoversFooter({ v, g }: { v: View; g: FormatGeo }) {
  if (!g.covers || !v.showCovers) return null;
  return (
    <div style={{ position: 'absolute', bottom: g.covers.bottom, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: g.covers.gap }}>
      <img src={asset(v.lightLogo ? v.site.footer.dark : v.site.footer.light)} style={{ height: v.site.footer.h[v.key] }} alt="" />
    </div>
  );
}

/** Banner + App Screen: iPhone mockup with the brand screenshot and the code overlay. */
function Phone({ v }: { v: View }) {
  const screenBox: CSSProperties = { position: 'absolute', top: '2.2%', left: '6.2%', width: '87.3%', height: '95.5%', borderRadius: 34 };
  return (
    <div style={{ position: 'absolute', zIndex: 5, right: 48, top: 11, width: 460, height: 912, filter: 'drop-shadow(0 30px 60px rgba(0,0,0,.55))' }}>
      {v.screen ? (
        <div style={{ ...screenBox, overflow: 'hidden', backgroundColor: '#fff', backgroundImage: `url("${v.screen}")`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }} />
      ) : (
        <div style={{ ...screenBox, background: '#f1f3f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#9aa3ad', fontFamily: v.site.uiFont, textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: 34 }}>＋</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Upload a screen<br />for this brand</div>
        </div>
      )}
      <img src={asset('assets/iphone-frame.png')} alt="" style={{ position: 'absolute', inset: 0, width: 438, height: 839, pointerEvents: 'none', left: 15, top: 3 }} />
      {v.overlayOn && (
        <div style={{ position: 'absolute', left: v.phoneCode.left, top: v.phoneCode.top, maxWidth: '82%', minWidth: v.phoneCode.minW, background: v.phoneCode.bg, borderRadius: 7, display: 'inline-flex', alignItems: 'center', padding: '4px 14px 2px', boxSizing: 'border-box' }}>
          <span style={{ fontFamily: v.site.displayFont, fontWeight: 700, fontSize: v.phoneCode.font, color: '#15202b', letterSpacing: '.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.12 }}>{v.code}</span>
        </div>
      )}
    </div>
  );
}

const CURVED_ARROW = 'M213.533 107.494L187.089 69.0626C186.212 67.7885 184.866 66.9149 183.345 66.6338C181.824 66.3528 180.254 66.6874 178.98 67.5641L140.548 94.0077C139.274 94.8844 138.4 96.2313 138.119 97.7521C137.838 99.2729 138.173 100.843 139.05 102.117C139.926 103.391 141.273 104.265 142.794 104.546C144.315 104.827 145.885 104.492 147.159 103.616L173.941 85.1877L169.691 107.763C167.388 120.24 161.437 131.754 152.59 140.849C143.743 149.944 132.398 156.21 119.989 158.856C107.581 161.502 94.6658 160.409 82.8785 155.715C71.0912 151.02 60.9608 142.936 53.7687 132.483C52.892 131.209 51.5451 130.335 50.0243 130.054C48.5035 129.773 46.9333 130.108 45.6593 130.985C44.3852 131.861 43.5115 133.208 43.2305 134.729C42.9495 136.25 43.2841 137.82 44.1608 139.094C52.6595 151.446 64.6302 161.001 78.5591 166.549C92.488 172.098 107.749 173.391 122.413 170.266C137.078 167.141 150.486 159.738 160.942 148.992C171.398 138.247 178.433 124.642 181.158 109.898L185.427 87.221L203.925 114.105C204.802 115.379 206.148 116.253 207.669 116.534C209.19 116.815 210.76 116.48 212.034 115.604C213.308 114.727 214.182 113.38 214.463 111.859C214.744 110.338 214.409 108.768 213.533 107.494Z';

function Arrow({ v }: { v: View }) {
  if (!v.overlayOn) return null;
  if (v.site.arrow === 'curved') {
    return (
      <svg style={{ position: 'absolute', left: 624, top: 416, width: 180, height: 120, zIndex: 9999, transform: v.arrowTransform, transformOrigin: 'center', filter: 'drop-shadow(0 12px 8px rgba(0,0,0,.45))' }} viewBox="38 62 182 116" fill="none">
        <path d={CURVED_ARROW} fill={v.accent} />
      </svg>
    );
  }
  return (
    <svg style={{ position: 'absolute', left: 632, top: 432, width: 165, height: 88, zIndex: 9999, transform: v.arrowTransform, transformOrigin: 'center' }} viewBox="0 0 165 88" fill="none">
      <path d="M0 74.5161V63.6344H73.7786C89.5714 63.6344 95.7 61.0323 106.779 49.914L146.143 11.1183H77.0786V0H165V88H153.921V18.9247L114.086 58.1936C98.7643 73.5699 89.8071 74.5161 74.25 74.5161H0Z" fill={v.accent} />
    </svg>
  );
}

export const PromoCanvas = forwardRef<HTMLDivElement, { fmt: TemplateKey; v: View }>(function PromoCanvas({ fmt, v }, ref) {
  const g = GEO[fmt];
  const t3 = fmt === 't3';
  const column: CSSProperties = t3
    ? { left: v.colBox.l, top: v.colBox.t, width: v.colBox.w, height: v.colBox.h }
    : { inset: 0, left: v.colLeft, top: v.colTop };
  const balls = v.site.decor === 'balls';
  const bottomBall = balls && <Ball geo={g.ballBottom} url={v.ballBottomUrl} size={v.ballBottomSize} transform={v.ballBottomTransform} />;
  return (
    <div ref={ref} style={{ width: g.W, height: g.H, position: 'relative', overflow: 'hidden', background: v.bg, fontFamily: v.site.uiFont }}>
      {v.site.decor === 'photo' ? (
        <div style={{ position: 'absolute', zIndex: 0, inset: -6, backgroundImage: `url("${v.photoUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      ) : balls ? (
        <>
          <img src={asset('assets/comm-bg-wave.svg')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', WebkitMaskImage: WAVE_MASK, maskImage: WAVE_MASK }} />
          <Ball geo={g.ballTop} url={v.ballTopUrl} size={v.ballTopSize} transform={v.ballTopTransform} />
        </>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url("${v.sportBgUrl}")` }} />
      )}
      {!g.bottomBallLast && bottomBall}
      <div style={{ position: 'absolute', zIndex: 2, ...column, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: v.colPad, justifyContent: v.colJustify }}>
        <LogoZone v={v} g={g} />
        {v.structured && <OfferStack v={v} />}
        {v.single && <SingleOffer v={v} g={g} />}
        {v.showPromo && <CodeZone v={v} g={g} />}
        <TcsZone v={v} />
      </div>
      <DebugLayer on={v.showDebug} font={v.site.debugFont} />
      <CoversFooter v={v} g={g} />
      {t3 && <Arrow v={v} />}
      {t3 && <Phone v={v} />}
      {g.bottomBallLast && bottomBall}
    </div>
  );
});
