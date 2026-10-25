import { useCallback, useMemo, useState } from 'react';
import { BRANDS } from '../data/brands';
import { baseTemplate, booksFor, brandCode, brandDefaults, DEFAULT_AMOUNT, DEFAULT_OFFER, FORMATS, isSingleCat, SINGLE_DEFAULTS } from '../data/catalog';
import { TEMPLATE_KEYS, type CategoryId, type TemplateKey, type Templates, type TemplateState } from '../data/types';
import type { Site } from '../site';

export interface BuilderState extends Templates {
  cat: CategoryId;
  showZones: boolean;
  /** Each category keeps its own edits while you switch tabs (reset on reload). */
  saved: Partial<Record<CategoryId, Templates>>;
}

const initial = (site: Site): BuilderState => ({
  cat: 'sportsbooks', showZones: false, saved: {},
  t1: baseTemplate({ ...site.defaults, showCovers: true }), t2: baseTemplate(site.defaults), t3: baseTemplate(site.defaults),
});

/** Apply the same change to all three templates. */
const each = (s: BuilderState, fn: (t: TemplateState, k: TemplateKey) => Partial<TemplateState>): Templates =>
  Object.fromEntries(TEMPLATE_KEYS.map(k => [k, { ...s[k], ...fn(s[k], k) }])) as unknown as Templates;

/** Fields the shared "All graphics" panel writes to every template. */
export type SharedField = 'ballTop' | 'ballBottom' | 'sport' | 'eyebrow' | 'line1' | 'line2' | 'sub' | 'stateNote' | 'promoLabel' | 'code' | 'tcs' | 'bgC' | 'logoOv';
/** Fields set on one template only. */
export type CardField = 'textC' | 'accentC' | 'pillBgC' | 'pillTextC' | 'ballColorC' | 'ballTopDX' | 'ballTopDY' | 'ballBottomDX' | 'ballBottomDY' | 'arrowX' | 'arrowY';

export function useBuilder(site: Site) {
  const [st, setSt] = useState(() => initial(site));

  const setAll = useCallback((field: SharedField, val: string | null) => setSt(s => ({ ...s, ...each(s, () => ({ [field]: val })) })), []);
  const setCard = useCallback((key: TemplateKey, patch: Partial<TemplateState>) => setSt(s => ({ ...s, [key]: { ...s[key], ...patch } })), []);

  const actions = useMemo(() => ({
    setAll,
    setCard,
    setField: (key: TemplateKey, field: CardField, val: string | number | null) => setCard(key, { [field]: val }),

    switchCat: (id: CategoryId) => setSt(s => {
      if (id === s.cat) return s;
      const saved = { ...s.saved, [s.cat]: { t1: s.t1, t2: s.t2, t3: s.t3 } };
      let next = saved[id];
      if (!next) {
        const first = Object.keys(booksFor(id))[0];
        const over: Partial<TemplateState> = { ...site.defaults, ...(isSingleCat(id) ? SINGLE_DEFAULTS : brandDefaults(site, BRANDS[first])) };
        next = {
          t1: baseTemplate({ ...over, showCovers: true, book: first }),
          t2: baseTemplate({ ...over, book: first }),
          t3: baseTemplate({ ...over, book: first }),
        };
      }
      return { ...s, cat: id, saved, ...next };
    }),

    /** Brand applies to all three; each template remembers its offer text per brand. */
    changeBook: (book: string) => setSt(s => {
      const single = isSingleCat(s.cat), b = BRANDS[book];
      return {
        ...s, ...each(s, t => {
          const brandText = { ...t.brandText, [t.book]: { amount: t.amount, offer: t.offer } };
          const saved = brandText[book] || {};
          return {
            book,
            code: single ? t.code : brandCode(site, b),
            ...(single ? {} : brandDefaults(site, b)),
            amount: saved.amount ?? DEFAULT_AMOUNT,
            offer: saved.offer ?? DEFAULT_OFFER,
            brandText,
          };
        }),
      };
    }),

    /** Casino / Sweeps offer text, remembered per brand. */
    setOfferText: (val: string) => setSt(s => ({
      ...s, ...each(s, t => ({ amount: val, brandText: { ...t.brandText, [t.book]: { ...t.brandText[t.book], amount: val } } })),
    })),

    applyFormat: (i: number) => setSt(s => ({ ...s, ...each(s, () => FORMATS[i].f) })),
    toggleHeroAccent: () => setSt(s => { const v = !s.t1.heroAccentOn; return { ...s, ...each(s, () => ({ heroAccentOn: v })) }; }),
    togglePromo: () => setSt(s => { const v = !s.t1.showPromo; return { ...s, ...each(s, () => ({ showPromo: v })) }; }),
    toggleTextLogo: () => setSt(s => { const v = !s.t1.textLogo; return { ...s, ...each(s, () => ({ textLogo: v })) }; }),
    toggleZones: () => setSt(s => ({ ...s, showZones: !s.showZones })),

    resetColors: (key: TemplateKey) => setCard(key, { bgC: null, textC: null, accentC: null, pillBgC: null, pillTextC: null, ballColorC: null }),
    toggleCovers: (key: TemplateKey) => setSt(s => ({ ...s, [key]: { ...s[key], showCovers: !s[key].showCovers } })),
    resetBallPos: (key: TemplateKey) => setCard(key, { ballTopDX: 0, ballTopDY: 0, ballBottomDX: 0, ballBottomDY: 0 }),

    /** Phone screenshot, saved to the current brand. */
    uploadScreen: (key: TemplateKey, url: string) => setSt(s => ({ ...s, [key]: { ...s[key], screenByBrand: { ...s[key].screenByBrand, [s[key].book]: url } } })),
    clearScreen: (key: TemplateKey) => setSt(s => {
      const m = { ...s[key].screenByBrand }; delete m[s[key].book];
      return { ...s, [key]: { ...s[key], screenByBrand: m } };
    }),
    toggleOverlay: () => setSt(s => ({ ...s, t3: { ...s.t3, showOverlay: !s.t3.showOverlay } })),
    toggleArrowFlipV: (key: TemplateKey) => setSt(s => ({ ...s, [key]: { ...s[key], arrowFlipV: !s[key].arrowFlipV } })),
    resetArrow: () => setCard('t3', { arrowX: 0, arrowY: 0, arrowFlipV: false }),
  }), [setAll, setCard, site]);

  return [st, actions] as const;
}

export type Actions = ReturnType<typeof useBuilder>[1];
