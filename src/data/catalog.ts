import { BRANDS, CASINO_KEYS, PREDICTION_KEYS, SWEEP_KEYS } from './brands';
import type { Site } from '../site';
import type { Ball, Brand, CategoryId, OfferDefaults, TemplateState } from './types';

export const CATEGORIES: { id: CategoryId; name: string }[] = [
  { id: 'sportsbooks', name: 'Sportsbooks' },
  { id: 'predictions', name: 'Prediction Markets' },
  { id: 'casino', name: 'Casino' },
  { id: 'sweepstakes', name: 'Sweepstakes' },
];

/** Casino and Sweepstakes use the single "offer text" layout; the others use the structured zone grid. */
export const isSingleCat = (cat: CategoryId) => cat === 'casino' || cat === 'sweepstakes';

const bookCache: Partial<Record<CategoryId, Record<string, Brand>>> = {};
export function booksFor(cat: CategoryId): Record<string, Brand> {
  const hit = bookCache[cat];
  if (hit) return hit;
  const keys =
    cat === 'predictions' ? PREDICTION_KEYS :
    cat === 'casino' ? CASINO_KEYS :
    cat === 'sweepstakes' ? SWEEP_KEYS :
    Object.keys(BRANDS).filter(k => !PREDICTION_KEYS.includes(k) && !CASINO_KEYS.includes(k) && !SWEEP_KEYS.includes(k));
  // Keep the prototype's source order (dropdowns for Casino/Sweeps sort by name separately).
  const out: Record<string, Brand> = {};
  Object.keys(BRANDS).forEach(k => { if (keys.includes(k)) out[k] = BRANDS[k]; });
  return (bookCache[cat] = out);
}

export function bookList(cat: CategoryId) {
  const books = booksFor(cat);
  const list = Object.keys(books).map(id => ({ id, name: books[id].name }));
  if (isSingleCat(cat)) list.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
  return list;
}

const SPORT_BALLS: Record<string, Ball> = {
  football: { name: 'Football', src: 'assets/ball-football-metal.png' },
  basketball: { name: 'Basketball', src: 'assets/ball-basketball-metal.png' },
  baseball: { name: 'Baseball', src: 'assets/ball-baseball-metal.png' },
  soccer: { name: 'Soccer', src: 'assets/ball-soccer-metal.png' },
  golf: { name: 'Golf', src: 'assets/ball-golf-metal.png', scale: 0.74 },
  boxing: { name: 'Boxing', src: 'assets/ball-boxing-metal.png' },
  mma: { name: 'MMA', src: 'assets/ball-mma-metal.png' },
};
const CASINO_BALLS: Record<string, Ball> = {
  cherries: { name: 'Cherries', src: 'assets/ball-cherries.png' },
  dice: { name: 'Dice', src: 'assets/ball-dice.png' },
};
const COIN_BALLS: Record<string, Ball> = {
  coin1: { name: 'Coin 1', src: 'assets/ball-coin-1.png', notint: true },
  coin2: { name: 'Coin 2', src: 'assets/ball-coin-2.png', notint: true },
  coin3: { name: 'Coin 3', src: 'assets/ball-coin-3.png', notint: true },
};

export function ballsFor(cat: CategoryId): Record<string, Ball> {
  if (cat === 'sweepstakes') return { ...CASINO_BALLS, ...COIN_BALLS };
  if (cat === 'casino') return CASINO_BALLS;
  return SPORT_BALLS;
}

export const DEFAULT_AMOUNT = '$1,500';
export const DEFAULT_OFFER = 'FIRST BET OFFER';
export const DEFAULT_TCS = '21+. New customers only. T&Cs apply.';
export const SINGLE_DEFAULTS = { ballTop: 'cherries', ballBottom: 'dice', amount: 'Up to $1,500 + 200 free spins' };

/** A brand's offer defaults, with the site's promo code where the site overrides brand codes. */
export function brandDefaults(site: Site, b: Brand | undefined): Partial<OfferDefaults> {
  const d = { ...(b?.defaults || {}) };
  if (site.forceCode && d.code != null) d.code = site.code;
  return d;
}

/** The promo code a brand starts with on this site. */
export const brandCode = (site: Site, b: Brand | undefined) => (site.forceCode ? site.code : b?.code || site.code);

/** "Start from a format" buttons (structured categories). */
export const FORMATS = [
  { name: 'Bet & Get', f: { eyebrow: '', line1: 'BET $5', line2: 'GET $150', sub: 'IN BONUS BETS' } },
  { name: 'Amount', f: { eyebrow: '', line1: '$1,500', line2: '', sub: 'FIRST BET OFFER' } },
  { name: 'Match', f: { eyebrow: '', line1: '100% MATCH', line2: '', sub: 'UP TO $1,000' } },
];

export function baseTemplate(over: Partial<TemplateState> = {}): TemplateState {
  return {
    book: 'betmgm', amount: DEFAULT_AMOUNT, offer: DEFAULT_OFFER,
    brandText: {}, screenByBrand: {},
    promoLabel: 'USE PROMO CODE:', code: 'COVERS', tcs: 'T&Cs apply',
    eyebrow: '', line1: '$1,500', line2: '', sub: 'FIRST BET OFFER', stateNote: '', heroAccentOn: false,
    showPromo: true, showOverlay: true,
    showCovers: false, ballTop: 'football', ballBottom: 'basketball', sport: 'generic', textLogo: false,
    arrowX: 0, arrowY: 0, arrowFlipV: false,
    ballTopDX: 0, ballTopDY: 0, ballBottomDX: 0, ballBottomDY: 0,
    bgC: null, textC: null, accentC: null, pillBgC: null, pillTextC: null, ballColorC: null,
    logoOv: null, ballTopOv: null, ballBottomOv: null,
    ...over,
  };
}
