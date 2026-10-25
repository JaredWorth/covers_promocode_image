import type { Brand, CategoryId, TemplateKey, TemplateState } from './data/types';

// One builder, several branded sites. Everything that differs between the
// Covers, Sports Illustrated and Sportsbook Review tools lives here; the layout
// engine, view model and controls read it instead of branching on a site name.

export type SiteId = 'covers' | 'si' | 'sbr';

export interface Site {
  id: SiteId;
  /** Shown in the header tag: "<label> × <CATEGORY> PROMO". */
  label: string;
  categories: CategoryId[];
  templates: TemplateKey[];
  intro: string;
  header: { icon: string; iconStyle: Record<string, number | string>; titleFont: string; titleSpacing: string };
  /** Default template values (merged over the shared base). */
  defaults: Partial<TemplateState>;
  /** House promo code. With `rebrandCodes`, Covers codes (COVERS…) in the brand data become this code. */
  code: string;
  rebrandCodes: boolean;
  /** Brand codes specific to this site, by brand key. */
  codeOverrides?: Record<string, string>;
  /** Brand fields specific to this site (SBR background photos and colours), by brand key. */
  brandOverrides?: Record<string, Partial<Brand>>;
  /** Font for the offer text and promo code. */
  displayFont: string;
  uiFont: string;
  /** Promo label, T&Cs and phone placeholder text. */
  labelFont: string;
  /** Small size labels and the header tag. */
  monoFont: string;
  /** "Show zones" overlay font. */
  debugFont: string;
  /** Covers: balls + wave. SI: recoloured sport photo. SBR: tinted background photo per brand. */
  decor: 'balls' | 'sport' | 'photo';
  /** Covers: tinted pill with ring. SI: plain white pill. SBR: white label band over a brand-colour code band. */
  pill: 'ring' | 'plain' | 'band';
  /** Covers: straight arrow + overlay toggle. SBR: curved arrow with its own on/off toggle. */
  arrow: 'straight' | 'curved';
  /** SI: "No Logo" mode renders the brand name as text. */
  textLogo: boolean;
  footer: { light: string; dark: string; h: Record<TemplateKey, number> };
  footerName: string;
  /** Layout engine tuning (see layout/engine.ts). */
  layout: {
    wideX: [number, number];
    heroMaxWide: number;
    /** SI: sub line sits this × hero size below the headline (ink to ink). */
    subGapRatio: number | null;
    /** SBR: top margin on the sub line as a fraction of hero size. */
    subMarginRatio: number | null;
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
  header: { icon: 'assets/covers-icon-orange.svg', iconStyle: { width: 30, height: 30 }, titleFont: "'Inter', sans-serif", titleSpacing: '-.01em' },
  defaults: {},
  code: 'COVERS',
  rebrandCodes: false,
  displayFont: "'Founders Grotesk'",
  uiFont: "'Inter', sans-serif",
  labelFont: "'Inter', sans-serif",
  monoFont: "'Inter', sans-serif",
  debugFont: "700 26px 'Inter', sans-serif",
  decor: 'balls',
  pill: 'ring',
  arrow: 'straight',
  textLogo: false,
  footer: { light: 'assets/covers-logo.svg', dark: 'assets/covers-logo-dark.svg', h: { t1: 54, t2: 34, t3: 0 } },
  footerName: 'Covers',
  layout: { wideX: [210, 1084], heroMaxWide: 240, subGapRatio: null, subMarginRatio: null, wideNoCodeFill: false, logoGap: 1 },
  theme: COVERS_THEME,
};

export const SI: Site = {
  id: 'si',
  label: 'SI',
  categories: ['sportsbooks', 'predictions'],
  templates: ['t1', 't2'],
  intro: "Two independent ad templates. Pick a sportsbook, pick a sport background, edit the copy and override any colour — every change updates live. Export full-resolution WebP when you're done.",
  header: { icon: 'assets/si-logo.svg', iconStyle: { width: 30, height: 30 }, titleFont: "'Industry', sans-serif", titleSpacing: '.4px' },
  defaults: { code: 'SIBONUS', line1: 'Up to $1,500', sub: 'in bonus bets', showPromo: false, showCovers: true, sport: 'generic', textLogo: false },
  code: 'SIBONUS',
  rebrandCodes: true,
  displayFont: "'Industry', sans-serif",
  uiFont: "'Industry', sans-serif",
  labelFont: "'Industry', sans-serif",
  monoFont: "'Industry', sans-serif",
  debugFont: '700 26px monospace',
  decor: 'sport',
  pill: 'plain',
  arrow: 'straight',
  textLogo: true,
  footer: { light: 'assets/si-logo.svg', dark: 'assets/si-logo-dark.svg', h: { t1: 106, t2: 67, t3: 0 } },
  footerName: 'SI',
  layout: { wideX: [170, 1124], heroMaxWide: 290, subGapRatio: 0.95, subMarginRatio: null, wideNoCodeFill: true, logoGap: 1.5 },
  theme: SI_THEME,
};

/** SI sport backgrounds (Background dropdown). */
export const SPORTS = [
  { id: 'generic', name: 'Generic', src: 'assets/si-bg-generic.png' },
  { id: 'basketball', name: 'Basketball', src: 'assets/si-bg-basketball.png' },
  { id: 'football1', name: 'Football – Helmets', src: 'assets/si-bg-football1.png' },
  { id: 'football2', name: 'Football – Laces', src: 'assets/si-bg-football2.png' },
];

const SBR_THEME = {
  ...COVERS_THEME,
  '--accent': '#0063FF', '--page': '#21252D', '--page-hi': '#21252D', '--chip-on-bg': '#0e1a2e', '--chip-on-text': '#cfe0ff',
};

export const SBR: Site = {
  id: 'sbr',
  label: 'SBR',
  categories: ['sportsbooks', 'predictions'],
  templates: ['t1', 't2', 't3'],
  intro: "Three independent ad templates. Pick a sportsbook, pick a sport background, edit the copy and override any colour — every change updates live. Export a full-resolution WebP when you're done.",
  header: { icon: 'assets/sbr-logo.svg', iconStyle: { height: 24 }, titleFont: "'Founders Grotesk'", titleSpacing: '.4px' },
  defaults: { code: 'SBRBONUS', promoLabel: 'USE BONUS CODE:', showArrow: true },
  code: 'SBRBONUS',
  rebrandCodes: true,
  codeOverrides: { caesars: 'SBRBONUSDYW', fanatics: 'SBREVIEW', kalshi: 'SBR60', novig: 'SBR100' },
  brandOverrides: {
    betmgm: {bgImg: 'football', tint: '#8F7B36', brand: '#A68A3E', dark: 0.38},
    caesars: {bgImg: 'basketball', tint: '#1d4a35', brand: '#0A4FE0'},
    bet365: {bgImg: 'basketball', tint: '#0e6b4a', brand: '#027B5B'},
    fanduel: {bgImg: 'football', tint: '#0A5BE6', brand: '#0A5BE6'},
    fanatics: {bgImg: 'basketball', tint: '#6b6b6b', brand: '#0048E8'},
    draftkings: {bgImg: 'basketball', tint: '#2f7a1c', brand: '#53B02A'},
    hardrock: {bgImg: 'basketball', tint: '#3b36d8', brand: '#5A3FE0'},
    og: {bgImg: 'stars', tint: '#FF5A00', brand: '#FF5A00'},
    kalshi: {bgImg: 'stars', tint: '#16a874', brand: '#00C878'},
    novig: {bgImg: 'basketball', tint: '#1a6bd6', brand: '#0050E0'},
  },
  displayFont: "'Factoria', 'Roboto Slab', serif",
  uiFont: "'Inter', sans-serif",
  labelFont: "'Barlow', sans-serif",
  monoFont: "'IBM Plex Mono', monospace",
  debugFont: "700 26px 'IBM Plex Mono', monospace",
  decor: 'photo',
  pill: 'band',
  arrow: 'curved',
  textLogo: false,
  footer: { light: 'assets/sbr-logo.svg', dark: 'assets/sbr-logo-dark.svg', h: { t1: 54, t2: 34, t3: 0 } },
  footerName: 'SBR',
  layout: { wideX: [210, 1084], heroMaxWide: 240, subGapRatio: null, subMarginRatio: 0.08, wideNoCodeFill: false, logoGap: 1 },
  theme: SBR_THEME,
};

/** SBR background photos (Background dropdown). */
export const SBR_BACKGROUNDS = [
  { id: 'basketball', name: 'Basketball', src: 'assets/bg-basketball.png' },
  { id: 'football', name: 'Football', src: 'assets/bg-football.png' },
  { id: 'stars', name: 'Stars', src: 'assets/bg-stars.png' },
];
