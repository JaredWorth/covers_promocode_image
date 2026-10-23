# Handoff: Covers Promo Builder

## Overview
An internal tool that produces branded sportsbook / prediction-market / casino / sweepstakes promo-code creatives for Covers. The user picks a **category**, a **brand**, edits offer copy and a promo code, tweaks ball art / colors / positions, then exports the selected templates as **WebP images in a single zip**.

Three templates render live side-by-side from one shared brand/offer model:

| Key | Template | Canvas |
|---|---|---|
| `t1` | Square | 1080 × 1080 |
| `t2` | Wide Banner | 1294 × 728 |
| `t3` | Banner + App Screen | 1294 × 728 (offer column + phone mock) |

## About the Design Files
The files in `reference/` are **design references built in HTML** (Design Component `.dc.html` format + a small runtime `support.js`). They show intended look and behavior; they are **not production code to copy**. Recreate them in the target codebase's existing environment (React/Vue/etc.) using its patterns and libraries. If no environment exists, pick a suitable framework (React + TypeScript recommended). `support.js` and the `DCLogic` / `<sc-if>` / `<sc-for>` / `{{ }}` syntax are the prototype runtime only; do not port them.

## Fidelity
**High-fidelity.** Colors, sizes, spacing and text-fitting rules below are final. Recreate pixel-accurately.

## Files
- `reference/Promo Builder.dc.html` – main page: templates, brand data (`baseBooks`), category logic, text fitting (`fit`/`compute`), export (`exportNode`, `exportZip`).
- `reference/PromoControls.dc.html` – per-template control panel (arrow/overlay, ball position, colour overrides, phone screen). Used for all 3 templates; "Phone Screen" and "Arrow & Code Overlay" only render for `t3`.
- `reference/SharedControls.dc.html` – shared copy controls (brand picker, eyebrow/headline/subline, promo code, T&Cs).
- `reference/support.js` – prototype runtime (ignore).
- `reference/assets/` – all logos, balls, coins, phone frame, app screens (≈225 files).
- `reference/fonts/` – Founders Grotesk Bold and Inter. (Aeonik Fono files are unused leftovers; IBM Plex Mono is no longer used.)
- `reference/Covers Promo Builder.html` – older self-contained build (does NOT include coins or arrow/overlay toggle; do not use as source of truth).

## Categories & brands
Four categories, each filtering the same brand dictionary (`baseBooks`, keyed by id):
- **Sportsbooks** (default; any brand not in the other lists), **Prediction Markets** (`predKeys`: kalshi, novig, dkpredictions, underdog, polymarket, gemini, fanduelpredicts, fanaticsmarkets, cryptocom, onyx, prophetx, og), **Casino** (`casinoKeys`, ~65 brands), **Sweepstakes** (`sweepKeys`, ~62 brands).
- Switching category saves the three templates' state per category and restores it when returning. First brand of the new category is selected. Casino/Sweeps default to balls `cherries` + `dice` and amount `Up to $1,500 + 200 free spins`.

Brand record fields: `name, logo, bg (solid or 180° gradient: base 0–45%, accent-mix 28% at 82%, 50% at 100%), text, accent, pillBg, pillText, w1/w2 (+ w1c/w2c wordmark fallback), ballTint, promoLabelColor, darkWord, heroAccent, logoScale, code, tcs (locked brand T&Cs), defaults {eyebrow,line1,line2,sub,code,showPromo}, screen (phone screenshot)`.
Export the full brand table from `baseBooks` in the reference file into JSON/TS data; values are authoritative.

Notable per-brand rules: Bet99 (CAN) `logoScale .7`; DraftKings Predictions logo +40%; Stake.us uses `#0079FF` for balls, accent and gradient bottom; prediction/kalshi-style brands carry locked T&Cs (read-only, optional appended state note).

## Balls
- Sports (Sportsbooks, Predictions): football, basketball, baseball, soccer, golf (scale .74), boxing, mma → `assets/ball-*-metal.png`.
- Casino & Sweeps: cherries, dice. **Sweeps only** additionally: Coin 1/2/3 (`assets/ball-coin-{1,2,3}.png`, `notint:true` – never tinted, gold by default).
- Other balls are tinted with the brand `ballTint`/override.
- Each template has Ball A (top) and Ball B (bottom): position offsets X/Y (−400…400, step 2) and Reset; upload override images; colour override.

## Template content model (per template state)
`book, eyebrow, line1, line2, sub, code, promoLabel ("USE PROMO CODE:"), tcs, stateNote, showPromo, showOverlay, showCovers, ballTop/ballBottom (+DX/DY, Ov), colour overrides (bgC, textC, accentC, pillBgC, pillTextC, ballColorC), logoOv, arrowX, arrowY, arrowFlipV, codeX, codeY, codeSize`.
- `showPromo` ("Use promo code") is global: toggling it sets all three templates.
- `showOverlay` (t3 only) – **new**: "Show arrow + promo code overlay". Hides the arrow and the promo code drawn on the phone screen together. Effective visibility = `showPromo && showOverlay`.
- **Arrow position (new)**: t3 Arrow X / Arrow Y sliders (−400…400, step 2, px translate), "Flip vertically" (scaleY −1), Reset. Arrow base position `left:632px; top:432px; 165×88`, `z-index:9999`, `transform: translate(x,y) scale(1, ±1)`, SVG from `assets/promo-arrow.svg`/inline path.

## Text rules (offer block)
**Fonts (licensing): Founders Grotesk Bold is used ONLY for the eyebrow/headline/subline offer text and the promo code (pill + phone overlay). Everything else – editor UI, page title, size labels, debug readout, "USE PROMO CODE:" label, T&Cs – is Inter.** Promo code text is optically centered in the pill: span `line-height:.712; position:relative; top:.185em`. Offer text is auto-fit by a binary search (16 iterations) to the largest size that fits the text window; then:
- Result is scaled to **80%** on banners and all Prediction Markets templates (and when `showPromo` is off on non-square templates).
- Eyebrow and Subline are **mutually exclusive**: when one has text the other is disabled with placeholder "Not enough room for this".
- Predictions Square + Wide: subline/eyebrow max width **82%** of text width.
- Sportsbooks & Predictions Wide Banner: offer text window **874px**, headline capped at **230px**.
- Casino/Sweeps Wide Banner: window **980px**; offer shrinks to fit **2 lines** (Square allows **3 lines**). Banner + App Screen: window stays **650px** (phone placement), 2 lines.
- Casino/Sweeps "USE PROMO CODE:" label→pill gap: Square 14px, Wide 20px, Banner+App 22px (label top margin 32/14/18px); pill max-width 850/700/540px.
- Casino/Sweeps column box: left 24, top 15, 697 × 709 (Banner variants); other categories use 1294 × 728.
- Logo zone height ≈ 14% (Square with promo; 10% without) / 11% (banners) of canvas height × `logoScale`.

## Phone screen (t3)
`assets/iphone-frame.png` at 438 × 839, left 15, top 3 over a per-brand app screenshot (`screen`, default `assets/app-screen-betmgm.png`; user can upload per-brand). Promo code box overlaid on the bonus-code field: `left:codeX% (15.7)`, `top:codeY% (43.4)`, max-width 82%, white `#fff` bg, radius 7px, Founders Grotesk 700, `#15202b`, letter-spacing .02em, size `codeSize` (18).

## Controls UI
Dark panel: bg `#0e1318`, section borders `#1b2530`, section titles 11px/.1em uppercase `#5f6b78` 700, labels 11px `#8a93a0`, body 13px `#cdd6df`, inputs bg `#10151b` border `#283340` radius 8px, accent (checkbox/range/toggle) **`#FD5000`**, secondary buttons bg `#141a20` border `#2b3947`. "Show zones" is a debug overlay (safe area, logo, offer, box, code, T&Cs) and is never exported.

## Export
One "Export selected (.zip)" button with chips for Square / Wide Banner / Banner + App Screen. Each selected template is rasterised at native size to **WebP**; files are zipped and named `Brand_WxH_YYYY-MM-DD.webp` (e.g. `BetMGM_1080x1080_2026-10-23.webp`). Button shows "Exporting…" and is dimmed when nothing is selected. Debug overlays must be excluded. (Page header copy still says "PNG" in the reference – should read "WebP".)

## Interactions & state
- All edits update the 3 live previews immediately; fit runs after render/fonts load and on any text/brand/toggle change.
- State: `cat`, per-template state above, `showZones`, `exportSel {t1,t2,t3}`, `exporting`, `fitWarn`; saved-per-category map.
- Font-load must complete before fit/export.
- No backend; all client-side. Uploaded images are read as data URLs.

## Design tokens
Controls: see Controls UI. Creative colors come per brand (accent, pill, gradient) and CAN be overridden per template. Common: text `#ffffff`, pill `#ffffff` with brand-dark text, orange UI accent `#FD5000`, Casino Stake.us `#0079FF`.

## Known gaps
Standalone HTML in reference is stale; header says "PNG"; export flow and Wide Banner / Prediction Markets headline sizing were not fully regression-tested.
