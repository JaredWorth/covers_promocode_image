# Handoff: SBR Sportsbook Promo Code Templates (Promo Builder)

## Overview
An internal tool for Sportsbook Review (SBR) staff to generate promo-code ad creatives. The user picks a brand (sportsbook or prediction market), a sport background, edits the offer copy / promo code / T&Cs, and exports full-resolution WebP images for three templates:

| Template | Export size | Notes |
|---|---|---|
| Square Post | 1080 × 1080 | Optional SBR logo footer |
| Wide Banner | 1294 × 728 canvas (card labelled "976 × 549") | Centered column |
| Banner + App Screen | 1294 × 728 canvas | Left text column, iPhone mockup right, curved arrow pointing at phone, promo code overlaid on app's bonus-code field |

Categories (top tabs): **Sportsbooks**, **Prediction Markets**. (Casino and Sweepstakes were removed from the UI; their data remains in `baseBooks` but is unused.)

## About the Design Files
Files here are **design references built in HTML** (a proprietary "Design Component" `.dc.html` format using `{{ }}` templating plus a small logic class). They are prototypes showing intended look and behavior — **not production code to copy**. Recreate them in the target codebase's environment (React/Vue/etc.) using its established patterns; if none exists, choose a suitable framework (React + a canvas/`html-to-image` export is a natural fit). Open `Promo Builder.dc.html` in a browser (with `support.js` alongside) to see the reference live.

## Fidelity
**High-fidelity.** Colors, fonts, sizes, and layout are final. Recreate pixel-accurately.

## Fonts (required)
- **Factoria Bold** (700) — offer headline/eyebrow/sub-line, no-logo fallback wordmark, phone code overlay. **File not in this bundle** — must be supplied at `fonts/Factoria-Bold.otf`. Fallback: Roboto Slab 700.
- **Barlow** 400–800 (Google Fonts) — promo-code pill label (700), code (800), T&Cs (400).
- **Founders Grotesk Bold** — tool UI title only. **Inter** 400/500/600 — tool UI. **IBM Plex Mono** 500 — tool UI mono labels. Aeonik Fono is bundled but only declared.
- All template text is rendered uppercase for offer lines.

## Template anatomy (all three, in z-order)
1. **Base colour** `bg` per brand (solid or gradient).
2. **Background image** (`bg-basketball.png`, `bg-football.png`, `bg-stars.png`), `inset:-6px`, `background-size:cover`, centered. The image is **recoloured to the brand's main colour** (`tint`/`brand`) — it replaces the old ball artwork. Each brand declares `bgImg` (`basketball|football|stars`) and `tint`. BetMGM adds a `dark: .38` (38% black overlay on gold) so football imagery stays visible.
3. **Content column** (z-index 2): logo → offer stack → promo pill → T&Cs. Zones are absolutely positioned by layout logic (`data-zone="logo|offer|code|tcs"`), with safe margin 6%. A debug overlay (`data-debug`) draws the zones/safe area.
4. **SBR logo footer** (Square/Wide): `sbr-logo.svg` or `sbr-logo-dark.svg` (chosen by background luminance), 54px tall (Square) / 34px (Wide), 18–20px from bottom.
5. **Template 3 only:** arrow (z 9999) and phone (z 5).

### Offer text ("structured" mode)
Stack, centred, Factoria 700 uppercase, `white-space:nowrap`:
- eyebrow (small, line-height .75)
- hero line 1 & 2 (letter-spacing −.01em, line-height .88)
- sub-line / qualifier (line-height .75). A **gap is inserted between sub-line segments for comma separation**.
On **Banner + App Screen** the fitted hero size is multiplied by an extra **0.8** (offer text 20% smaller; stacks with the existing ×0.8 for prediction markets / no-promo; see `fitStack`). The stack is auto-scaled (`transform`) to fit the offer zone. Hero colour = `heroColor` (brand accent when `heroAccent:true`, e.g. bet365, DraftKings; otherwise text colour). Legacy "single" mode: amount 250px (Square) / 205px (Wide) / 182px (App), offer line 68/57/52px, letter-spacing −2/−3px.

### Promo-code pill
Vertical unit, radius 10px, overflow hidden, shadow `0 8px 19px rgba(0,0,0,.25)`, `width:fit-content`:
- **Label band**: white `#fff`, text `#1b1b1b`, Barlow 700 uppercase, letter-spacing .01em, padding 14px 56px; font-size 33px (Square) / 24px (Wide, App).
- **Code band**: padding 26px 64px, background = **brand-colour gradient** (`pillGrad`, derived from `brand`), Barlow 800, **96px** (≈30% larger than prior), letter-spacing .01em; text white or dark (`pillText`) chosen for contrast. Code text auto-shrinks to fit `pillMaxW`. Scalable via `codePillScale` (default 1.15; range .4–1.2). Vertical alignment prop `codeVAlign` (top/center/bottom).
- Default code: `SBRBONUS` (some brands override, e.g. Caesars `SBRBONUSDYW`, Fanatics `SBREVIEW`). Toggle `showPromo` per brand default.

### T&Cs
Barlow, line-height 1.25, colour = text colour at **.62 opacity**, centred; size/box set by layout logic (`tcsFS/tcsW/tcsH`), overflow clipped. Brand-specific legal copy is stored in `baseBooks[x].tcs` (Polymarket, Onyx, OG, and "T&Cs apply" defaults for several prediction markets).

### Banner + App Screen specifics
- Canvas 1294 × 728. Left text column box (`colBoxL/T/W/H`). Offer headline box width 650, offer text 52px.
- **Phone**: container `right:48px; top:11px; 460×912`, drop-shadow `0 30px 60px rgba(0,0,0,.55)`. App screenshot (brand's `screen`, e.g. `app-screen-betmgm.png`) sits behind frame at top 2.2%, left 6.2%, 87.3% × 95.5%, radius 34px. `iphone-frame.png` on top, 438×839 at left 15 / top 3. If no screen for brand: placeholder "Upload a screen for this brand".
- **Promo code overlay** on phone's bonus-code field: position `codeX`% (default 17) / `codeY`% (default 44), size `codeSize` (default 28px), Factoria 700, colour `#15202b`, white-ish bg `codeBg`, radius 7px, padding 4px 14px 2px.
- **Arrow** (curved SVG from `assets/promo-arrow.svg`, inline path in file): 180×120 at left 624 / top 416, viewBox `38 62 182 116`, filled with brand accent, `drop-shadow(0 12px 8px rgba(0,0,0,.45))`. Controls: **Show arrow** toggle (**off also hides the phone code overlay**), X offset (default 59, ±400px), Y offset (default 0, ±400px), vertical flip toggle.

## Brand data model (`baseBooks`)
Per brand: `name, logo, logoScale, bg, text, accent, pillBg, pillText, w1/w2/w1c/w2c (text-fallback wordmark), ballTint, bgImg, tint, brand, dark, heroAccent, code, tcs, screen, defaults{eyebrow,line1,line2,sub,code,showPromo}, promoLabelColor`.

Key sportsbook colours (`brand` → pill gradient/bg tint):
- BetMGM `#A68A3E` (tint `#8F7B36`, bg `#131313`, football, dark .38)
- Caesars `#0A4FE0` (tint `#1d4a35`, bg `#173432`, basketball)
- bet365 `#027B5B` (tint `#0e6b4a`, bg `#013328`, accent `#ffe100`, basketball)
- FanDuel `#0A5BE6` (bg `#0078FF`, football)
- Fanatics `#0048E8` (tint `#6b6b6b`, bg `#000`, basketball)
- DraftKings `#53B02A` (tint `#2f7a1c`, bg `#000`, basketball)
- Hard Rock Bet `#5A3FE0` (tint `#3b36d8`, bg `#0a0512`, basketball)
- BetRivers bg `#122A53`
- OG (prediction) `#FF5A00`, stars background
Other prediction markets use gradient bgs (see source) — Polymarket `#2a55f5→#1a3fd0`, Gemini black→teal, Kalshi/Novig/Underdog logos included.

## Interactions & Behavior
- Brand picker, sport-background picker, category tabs (state per category is saved/restored when switching).
- Shared controls (apply to all 3) + per-template `PromoControls` (offer lines, code, T&Cs, colour overrides, show promo, logo size, debug overlay, SBR footer toggle & light/dark).
- Live preview: each template is a fixed-size canvas scaled with CSS `transform: scale(.3889)` (Square) / `.3246` (Wide, App) into a 420px preview.
- **Export**: checkboxes choose templates; button renders each canvas with `html-to-image` at full resolution to **WebP** and zips with JSZip. Preview scale is removed during capture.
- Fixes in place: text auto-fit (stack scale, code shrink), "$1,500"/"FIRST BET OFFER" tight line-spacing is intentional.

## State
`cat`, `t1/t2/t3` (per-template settings objects: book, ballTop (bg image), colours, copy lines, code, tcs, toggles, sizes), arrow props (`arrowOn/arrowX/arrowY/arrowFlipV`), phone code props (`codeX/codeY/codeSize`), export selection. Data is static (no fetching).

## Design tokens (tool chrome)
Page bg `#21252D`; card bg `#0e1318`, border `#1b2530`, radius 16px; stage bg `#06080a`; text `#e8edf2`, muted `#5f6b78`/`#6b7682`; primary button `#0063FF`; chips radius 999px. Template border radius 8px in preview.

## Assets
`assets/`: `bg-basketball|football|stars.png` (backgrounds), `logo-*.svg` (brand logos), `sbr-logo(.svg|-dark.svg)`, `iphone-frame.png`, `app-screen-betmgm.png`, `promo-arrow.svg`. Brand logos were supplied by the user (uploads); app screens exist only for BetMGM — others need upload. Only a subset of logos is bundled (sportsbooks + prediction markets); casino/sweeps logos omitted.

## Files
- `Promo Builder.dc.html` — main page: three templates, brand data, export logic
- `PromoControls.dc.html` — per-template controls
- `SharedControls.dc.html` — global controls
- `support.js` — runtime for the .dc.html format (not needed in a real implementation)
- `fonts/`, `assets/`

Not included: `fonts/Factoria-Bold.otf` (must be provided), a re-exported standalone HTML.
