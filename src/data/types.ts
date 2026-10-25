export type CategoryId = 'sportsbooks' | 'predictions' | 'casino' | 'sweepstakes';
export type TemplateKey = 't1' | 't2' | 't3';

export const TEMPLATE_KEYS: TemplateKey[] = ['t1', 't2', 't3'];

/** Offer copy a brand can preset (Sportsbooks / Prediction Markets only). */
export interface OfferDefaults {
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  code: string;
  showPromo: boolean;
}

export interface Brand {
  name: string;
  logo?: string;
  /** Any CSS background (solid colour or gradient). */
  bg: string;
  text: string;
  accent: string;
  pillBg: string;
  pillText: string;
  /** Wordmark fallback, used only when a brand has no logo file. */
  w1: string;
  w2: string;
  w1c: string;
  w2c: string;
  ballTint?: string;
  promoLabelColor?: string;
  /** Light-background brand (dark text, dark pill, dark Covers logo). */
  darkWord?: boolean;
  /** Default phone screenshot for Banner + App Screen. */
  screen?: string;
  /** Offers the "Brand accent on hero text" option. */
  heroAccent?: boolean;
  /** Default promo code. */
  code?: string;
  /** Locked T&Cs (structured categories). */
  tcs?: string;
  defaults?: Partial<OfferDefaults>;
  logoScale?: number;
  ownPill?: boolean;
  pillEdge?: string;
}

export interface Ball {
  name: string;
  src: string;
  /** Visual scale inside its box (1 = contain). */
  scale?: number;
  /** Keep original colours, skip the brand tint. */
  notint?: boolean;
}

/** Editable state of one template card. */
export interface TemplateState {
  book: string;
  /** Casino / Sweepstakes single offer text. */
  amount: string;
  offer: string;
  brandText: Record<string, { amount?: string; offer?: string }>;
  screenByBrand: Record<string, string>;
  promoLabel: string;
  code: string;
  /** Casino / Sweepstakes free-text T&Cs. */
  tcs: string;
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  stateNote: string;
  heroAccentOn: boolean;
  showPromo: boolean;
  showOverlay: boolean;
  showCovers: boolean;
  ballTop: string;
  ballBottom: string;
  /** SI sport background id. */
  sport: string;
  /** SI "No Logo" mode: brand name as text. */
  textLogo: boolean;
  arrowX: number;
  arrowY: number;
  arrowFlipV: boolean;
  ballTopDX: number;
  ballTopDY: number;
  ballBottomDX: number;
  ballBottomDY: number;
  bgC: string | null;
  textC: string | null;
  accentC: string | null;
  pillBgC: string | null;
  pillTextC: string | null;
  ballColorC: string | null;
  logoOv: string | null;
  ballTopOv: string | null;
  ballBottomOv: string | null;
}

export type Templates = Record<TemplateKey, TemplateState>;
