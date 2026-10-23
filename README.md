# Covers Promo Template Builder

An internal tool for building promo graphics. An editor picks a category and a brand, edits the offer copy, and exports three graphics at once as WebP files in a zip:

| Graphic | Export size |
|---|---|
| Square Post | 1080 × 1080 |
| Wide Banner | 976 × 549 |
| Banner + App Screen | 976 × 549 |

Built with Vite, React and TypeScript. It implements the Claude Design prototype in `project/Promo Builder.dc.html`.

## Running it

```bash
npm install
npm run dev               # local dev server
npm run build             # static site in dist/
npm run build:standalone  # one self-contained HTML file in dist-standalone/index.html
```

The standalone file (about 18 MB) bundles every logo, ball, font and library. Editors can open it straight from disk with no network connection, the same way the prototype's `Covers Promo Builder.html` was used.

## How it works

- **Categories:** Sportsbooks and Prediction Markets use the structured offer layout: eyebrow, up to two headline lines, a sub line, a promo code and locked T&Cs. Casino and Sweepstakes use a single offer-text field and free-text T&Cs.
- **All graphics panel:** brand, logo upload, main colour, balls, offer copy, promo code and T&Cs. These apply to all three graphics.
- **Per-graphic panels:** ball position, colour overrides, the Covers logo toggle, and on Banner + App Screen only, the phone screenshot plus the arrow and code overlay.
- **Show zones:** draws the zone grid and a size readout on the structured layouts. It is never included in exports.

## Code map

| Path | What it holds |
|---|---|
| `src/data/brands.ts` | Brand database: name, logo, colours, default code, locked T&Cs, offer defaults. Category membership is set by the `PREDICTION_KEYS`, `CASINO_KEYS` and `SWEEP_KEYS` lists; any brand in none of them is a Sportsbook. |
| `src/data/catalog.ts` | Categories, ball lists, format presets, default template state. |
| `src/model/view.ts` | Derives everything a graphic renders from its state and brand (colours, logo sizing, pill tint and so on). |
| `src/model/store.ts` | Editor state and actions. |
| `src/layout/engine.ts` | Layout engine. After each render it measures the real DOM (fonts, glyph ink, logo transparency) to fit the text and place the logo, offer, code and fine-print zones. |
| `src/components/PromoCanvas.tsx` | The three graphic layouts. The engine depends on the `data-zone`, `data-role`, `data-pill` and `data-code` attributes here. |
| `src/model/export.ts` | WebP rendering (html-to-image) and the zip download. |

**Adding a brand:** put its logo in `src/assets/` (Casino logos go in `assets/casino/`, Sweepstakes in `assets/sweeps/`), add an entry to `BRANDS` in `src/data/brands.ts`, then add its key to the right category list.

## Design source

- `project/`: the Claude Design export (prototypes, assets, fonts).
- `chats/`: the design conversation transcripts.
- `project/HANDOFF.md`: the original handoff notes from Claude Design.

These are kept for reference only, and the app doesn't load anything from them. `src/data/brands.ts` was generated once from the prototype's brand table, and from now on it should be edited directly.
