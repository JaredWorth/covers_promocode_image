import type { CategoryId, TemplateKey, TemplateState } from './data/types';

// One builder, two branded sites. Everything that differs between the Covers
// and Sports Illustrated tools lives here; the layout engine, view model and
// controls read it instead of branching on a site name.

export type SiteId = 'covers' | 'si';

export interface Site {
  id: SiteId;
  /** Shown in the header tag: "<label> × <CATEGORY> PROMO". */
  label: string;
  categories: CategoryId[];
  templates: TemplateKey[];
  intro: string;
  headerIcon: string;
  /** Default template values (merged over the shared base). */
  defaults: Partial<TemplateState>;
  /** Fallback promo code; when set, it also replaces every brand's own code. */
  code: string;
  forceCode: boolean;
  /** Font for the offer text and promo code (and for the editor UI on SI). */
  displayFont: string;
  uiFont: string;
  labelFont: string;
  /** "Show zones" overlay font. */
  debugFont: string;
  /** Covers: balls + wave background. SI: recoloured sport photo background. */
  decor: 'balls' | 'sport';
  /** SI: white pill, no border or ring, ink-centred code. */
  plainPill: boolean;
  /** SI: "No Logo" mode renders the brand name as text. */
  textLogo: boolean;
  footer: { light: string; dark: string; h: Record<TemplateKey, number> };
  footerName: string;
  /** Layout engine tuning (see layout/engine.ts). */
  layout: {
    wideX: [number, number];
    heroMaxWide: number;
    /** SI: sub line sits 0.95 × hero size below the headline (ink to ink). */
    subGapRatio: number | null;
    /** SI: Wide Banner with no promo code uses the full width at 85% of the largest fit. */
    wideNoCodeFill: boolean;
    /** Extra gap between logo and offer, as a multiple of the base gap. */
    logoGap: number;
  };
  theme: Record<string, string>;
}

const COVERS_THEME = {
  '--accent': '#FD5000', '--page': '#080b0e', '--page-hi': '#11161c', '--panel': '#0e1318', '--border': '#1b2530',
  '--input': '#10151b', '--input-border': '#283340', '--text': '#e8edf2', '--body': '#cdd6df', '--muted': '#8a93a0',
  '--dim': '#5f6b78', '--hint': '#6b7682', '--tag': '#4c5763', '--btn': '#141a20', '--btn-border': '#2b3947',
  '--upload': '#1b2530', '--preview': '#06080a', '--toggle-off': '#2b3947', '--chip-on-bg': '#1c130e',
  '--chip-on-text': '#ffd9c6', '--chip-off-border': '#2a3542', '--scroll': '#222c36',
};

const SI_THEME = {
  '--accent': '#D71920', '--page': '#0a0a0a', '--page-hi': '#161616', '--panel': '#141414', '--border': '#262626',
  '--input': '#101010', '--input-border': '#333333', '--text': '#ededed', '--body': '#d6d6d6', '--muted': '#9a9a9a',
  '--dim': '#808080', '--hint': '#8a8a8a', '--tag': '#707070', '--btn': '#1a1a1a', '--btn-border': '#383838',
  '--upload': '#262626', '--preview': '#070707', '--toggle-off': '#383838', '--chip-on-bg': '#240d0e',
  '--chip-on-text': '#ffd1d3', '--chip-off-border': '#383838', '--scroll': '#333333',
};

export const COVERS: Site = {
  id: 'covers',
  label: 'COVERS',
  categories: ['sportsbooks', 'predictions', 'casino', 'sweepstakes'],
  templates: ['t1', 't2', 't3'],
  intro: 'Three ad templates from one set of edits. Pick a brand, swap the ball graphics, edit the copy and fine-tune each graphic. Every change updates live. Export the selected graphics as WebP in one zip.',
  headerIcon: 'assets/covers-icon-orange.svg',
  defaults: {},
  code: 'COVERS',
  forceCode: false,
  displayFont: "'Founders Grotesk'",
  uiFont: "'Inter', sans-serif",
  labelFont: "'Inter', sans-serif",
  debugFont: "700 26px 'Inter', sans-serif",
  decor: 'balls',
  plainPill: false,
  textLogo: false,
  footer: { light: 'assets/covers-logo.svg', dark: 'assets/covers-logo-dark.svg', h: { t1: 54, t2: 34, t3: 0 } },
  footerName: 'Covers',
  layout: { wideX: [210, 1084], heroMaxWide: 240, subGapRatio: null, wideNoCodeFill: false, logoGap: 1 },
  theme: COVERS_THEME,
};

export const SI: Site = {
  id: 'si',
  label: 'SI',
  categories: ['sportsbooks', 'predictions'],
  templates: ['t1', 't2'],
  intro: "Two independent ad templates. Pick a sportsbook, pick a sport background, edit the copy and override any colour — every change updates live. Export full-resolution WebP when you're done.",
  headerIcon: 'assets/si-logo.svg',
  defaults: { code: 'SIBONUS', line1: 'Up to $1,500', sub: 'in bonus bets', showPromo: false, showCovers: true, sport: 'generic', textLogo: false },
  code: 'SIBONUS',
  forceCode: true,
  displayFont: "'Industry', sans-serif",
  uiFont: "'Industry', sans-serif",
  labelFont: "'Industry', sans-serif",
  debugFont: '700 26px monospace',
  decor: 'sport',
  plainPill: true,
  textLogo: true,
  footer: { light: 'assets/si-logo.svg', dark: 'assets/si-logo-dark.svg', h: { t1: 106, t2: 67, t3: 0 } },
  footerName: 'SI',
  layout: { wideX: [170, 1124], heroMaxWide: 290, subGapRatio: 0.95, wideNoCodeFill: true, logoGap: 1.5 },
  theme: SI_THEME,
};

/** SI sport backgrounds (Background dropdown). */
export const SPORTS = [
  { id: 'generic', name: 'Generic', src: 'assets/si-bg-generic.png' },
  { id: 'basketball', name: 'Basketball', src: 'assets/si-bg-basketball.png' },
  { id: 'football1', name: 'Football – Helmets', src: 'assets/si-bg-football1.png' },
  { id: 'football2', name: 'Football – Laces', src: 'assets/si-bg-football2.png' },
];
