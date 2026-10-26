# Covers Promo Template Builder

An internal tool for building promo graphics. An editor picks a category and a brand, edits the offer copy, and exports three graphics at once as WebP files in a zip:

| Graphic | Export size |
|---|---|
| Square Post | 1080 × 1080 |
| Wide Banner | 976 × 549 |
| Banner + App Screen | 976 × 549 |

Built with Vite, React and TypeScript. It implements the Claude Design prototype in `project/Promo Builder.dc.html`.

### SI Promo Template Builder

The same tool, rebranded for Sports Illustrated, lives at `/si/` (from `project-si/SI Promo Builder.dc.html`). It has Sportsbooks and Prediction Markets only, two graphics (Square Post and Wide Banner), a sport background picker in place of the balls, a "No Logo" text mode, a white promo pill and `SIBONUS` as every brand's code. 

### SBR Promo Template Builder

The Sportsbook Review version lives at `/sbr/` (from `project-sbr/SBR Promo Builder.dc.html`). It keeps all three graphics, with Sportsbooks and Prediction Markets only. Changes from Covers:
- a tinted background photo per brand (basketball, football or stars) instead of balls
- a two-band promo block: a white label band over a brand-colour code band
- a curved arrow with its own on/off toggle
- Barlow for the code and T&Cs, Factoria for the offer text
- `SBRBONUS` codes, with brand-specific ones where the design sets them

Everything that differs between the sites is in `src/site.ts`. On rebranded sites, Covers house codes (`COVERS…`) in the brand data become the site's code; brand-specific codes such as Kalshi's `MAX60` are kept.

### Commercial Editor Tools (landing page)

`/tools/` (from `project-tools/Editor Tools.dc.html`) is the entry point for editors. They pick Covers, Sports Illustrated or Sportsbook Review; the pick is remembered in the browser, and keys 1/2/3 switch it. The page then links to that brand's tools: the Logo Generator, the matching Promo Code Image Editor on this site, and the Mobile Screenshot Generator. Links are set in `src/tools/Tools.tsx`. The guide links and the "Request on Slack" link are still placeholders (`#`).

### Favicon

All four pages use the Legend swan mark (`src/assets/icons/`): `favicon.svg`, which turns white when the browser is in dark mode, plus `favicon-32.png` and a 180 px `apple-touch-icon.png` on white for browsers and home screens that don't take SVG. If the SVG changes, re-render the PNGs from it. The standalone builds inline all three.

## Running it

```bash
npm install
npm run dev               # local dev server
npm run build             # static site in dist/
npm run build:standalone     # Covers as one self-contained HTML file: dist-standalone/index.html
npm run build:standalone:si  # SI as one self-contained HTML file: dist-standalone/si/index.html
npm run build:standalone:sbr # SBR as one self-contained HTML file: dist-standalone/sbr/index.html
```

Every push to `promo-builder-app` also builds both pages and publishes them to GitHub Pages (`.github/workflows/pages.yml`): Covers at `/`, SI at `/si/`, SBR at `/sbr/`, and the landing page at `/tools/`. That site is public: anyone with the URL can open it.

The standalone file (about 18 MB) bundles every logo, ball, font and library. Editors can open it straight from disk with no network connection, the same way the prototype's `Covers Promo Builder.html` was used.

## How it works

- **Categories:** Sportsbooks and Prediction Markets use the structured offer layout: eyebrow, up to two headline lines, a sub line, a promo code and T&Cs. The T&Cs start from the brand's default text. Editors can change them, and the edit is kept for that brand only, until the page is reloaded or Reset is pressed. Casino and Sweepstakes use a single offer-text field and free-text T&Cs.
- **All graphics panel:** brand, logo upload, main colour, balls, offer copy, promo code and T&Cs. These apply to all three graphics.
- **Per-graphic panels:** ball position, colour overrides, the Covers logo toggle, and on Banner + App Screen only, the phone screenshot plus the arrow and code overlay.
- **Show zones:** draws the zone grid and a size readout on the structured layouts. It is never included in exports.

## Fonts

Licensing: **Founders Grotesk Bold** is used only for the offer text (eyebrow, headline, sub line) and the promo code (pill and phone overlay). Everything else, including the editor UI, the "USE PROMO CODE:" label, T&Cs and the debug readout, uses **Inter**. Both live in `src/fonts/` and are bundled into the build. Don't add other paid fonts without checking their web licence.

The SI page uses **Industry** (Hold Fast Foundry) for everything. Its files are **not committed** (see `.gitignore`) until a web licence is confirmed. To use it, put `Industry-Light/Book/Medium/Demi/Bold/Black.ttf` in `src/fonts/`; `src/fonts.ts` picks them up automatically. Without them, the SI page falls back to a locally installed Industry or to sans-serif, and the text fitting adjusts to whatever font is used.

The SBR page uses **Factoria Bold** for the offer text and phone code overlay. It's commercial and not in the design bundle, so it's handled the same way as Industry: put `Factoria-Bold.otf` (or `.ttf`) in `src/fonts/` and it loads automatically; until then the page uses Roboto Slab. **Barlow**, **Roboto Slab** and **IBM Plex Mono** are free (SIL Open Font License) and bundled from npm. The SBR page title uses Founders Grotesk Bold, as in its design.

## Code map

| Path | What it holds |
|---|---|
| `src/data/brands.ts` | Brand database: name, logo, colours, default code, default T&Cs, offer defaults. Category membership is set by the `PREDICTION_KEYS`, `CASINO_KEYS` and `SWEEP_KEYS` lists; any brand in none of them is a Sportsbook. |
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
