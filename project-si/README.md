# Handoff: SI Sportsbook Promo Code Templates (Promo Graphics Generator)

## Overview
An internal tool for Sports Illustrated that generates promo graphics for partner sportsbooks and prediction markets. The user picks a brand and sport background, edits headline/sub/promo code/T&Cs, optionally overrides colours, previews live, and exports PNG/WebP files in a zip. Adapted from a "Covers" promo builder; all Covers branding is replaced with SI.

## About the Design Files
The files here are **design references built in HTML** (a prototype in a proprietary "Design Component" `.dc.html` format, with `support.js` as its runtime). They show intended look and behaviour; they are **not production code to copy**. Recreate them in the target codebase's environment (React, Vue, etc.) using its established patterns. If there is no environment yet, choose a suitable one (a small React + Vite SPA fits well). The graphics themselves are plain DOM at fixed pixel size, which is rasterised for export.

## Fidelity
**High-fidelity.** Final colours, type, spacing rules and layout algorithms. Recreate the output pixel-faithfully. The auto-fit text sizing logic matters more than any single value: port the algorithm (see Layout engine).

## Screens / Views
One screen: **Promo Template Builder** (dark editor page, `#0a0a0a` page bg).

### Page structure (top to bottom)
1. **Header**: title "Promo Template Builder" (Industry Bold 25px, white, letter-spacing .4px), SI logo, helper text (13px `#8a8a8a`), right-aligned tag "SI × {CATEGORY} PROMO" (11px `#707070`).
2. **Category tabs**: only **Sportsbooks** and **Prediction Markets**. (Casino and Sweepstakes were removed.) Switching category swaps the brand list and the defaults (Prediction Markets uses a different headline/sub layout and slightly smaller hero scale).
3. **Export bar**: per-graphic selection pills (toggle which graphics export) and a red **Export** button (`#D71920`, white 12px/700 text, 8px radius, 10×18 padding).
4. **Preview row**: two independent previews with a label and size caption:
   - **Square Post** — 1080 × 1080
   - **Wide Banner** — 1294 × 728 (internally "t2"; a third template "t3" Banner + App Screen exists in code but is **removed from the UI, do not build**).
   Previews are scaled with CSS `transform: scale()` (Square shown at 420px; scale 0.3889), `border-radius:8px`, shadow `0 6px 24px rgba(0,0,0,.5)`.
5. **Shared controls panel** ("All graphics — edits apply to both") — card `#141414`, 1px `#262626` border, 14px radius, padding 18×20; 3-col auto-fit grid (min 260px, gap 24).
6. **Per-graphic controls** (colour overrides + "Show SI logo" toggle) under each preview.

### Shared controls (exact fields)
Col 1: **Brand** select; **Logo** upload + Reset; **Main colour** colour input + Reset; **Background** select (sport: Basketball, Football 1, Football 2, Generic, etc. mapping to `assets/si-bg-*.png` / ball images); checkbox **"No Logo (use brand name as text)"**; optional checkbox "Brand accent on hero text" (only for brands that define it).
Col 2: **Start from a format** buttons (brand-specific presets); **Eyebrow (optional)**; **Headline line 1**; **Headline line 2 (optional)**; **Sub line (optional)**; checkbox **Use promo code**; checkbox "Show zones (debug, not exported)"; **Promo label** + **Promo code** (only when promo on). Default code `SIBONUS`.
Col 3: **T&Cs** — read-only textarea when the brand has locked T&Cs, plus "State note (optional, appended)"; otherwise an editable textarea.
Hint under headline: "Both headline lines always share one size. Sub line is half that size. Leave a field blank to hide it."
Per-graphic: **Colour Overrides** (Background, Headline, Accent, Code text colour inputs 30px, "Reset to brand"), **Show SI logo** toggle (46×26 pill, red `#D71920` on / `#383838` off, 20px white knob).
All text inputs are uppercase-transformed.

### The graphics (design canvas)
- Font: **Industry** (weights 400/500/600/700/900). All text uppercase for headline/sub.
- Background: brand `bg` (gradient, e.g. `linear-gradient(180deg,#000 0%,#000 45%,<tint> 82%,<tint2> 100%)`) with sport background image layered (`background-size:cover; center`), plus decorative ball images top/bottom positioned per template (see `cfg` below).
- Text colour per brand (`text`), accent per brand (`accent`).
- **SI logo**: shown on BOTH Square and Wide Banner by default (toggle). Two files: `si-logo.svg` (light) and `si-logo-dark.svg`; logo is recoloured at runtime for contrast on the background. Sized 20% larger than the first version.
- **Brand logo** (`assets/logo-*.svg`): height = fraction of canvas height (Square 14% with promo / 10% without; Wide 11%), times per-brand `logoScale`. Width follows aspect ratio, capped.
- **"No Logo" mode**: replaces brand logo with brand name as text, Industry **Bold, caps**, fitted to the same logo box.
- **Spacing**: logo→headline gap is 1.5× the original; headline→sub gap = 0.95 × headline font size (measured ink-to-ink, see `inkIns`); eyebrow→headline similar rule.
- **Promo pill**: always **white** background, **centred text, no stroke**, code text colour defaults to brand `pillText`. Label above/inside per `pillSpec`. Code font size is fitted to the pill width.
- Wide Banner with **promo off**: text block is centred and hero size is scaled to ~**85%** of max so headline + sub fills roughly **75% of banner width**. Prediction Markets scale ×0.8.
- T&Cs: small text anchored at the bottom of the canvas.

## Layout engine (port this)
All sizing is done by binary search at runtime against DOM measurements (`fit*` methods in `SI Promo Builder.dc.html`, ~lines 830–930):
- Per template config `cfg`: Square `{W:1080,H:1080,hmin:70,hmax:410}`, Wide `{W:1294,H:728,hmin:55,hmax:230,xl:170,xr:1124}`. Headline font = largest size (18 iterations bisect between hmin/hmax) such that block height ≤ zone height, line count ≤ max lines, and no horizontal overflow. Sub and eyebrow = 0.5 × headline size (clamped to width).
- If copy can't fit at hmin, show red warning: "Text can't fit at minimum size: … Shorten the copy." (`#2a0f10` bg, `#d83a3a` border, `#ff8a8a` text).
- `inkIns(el)` measures top/bottom empty space in a text line box (cap-height trimming) so gaps are visual, not line-box based. Re-implement via canvas `measureText` actualBoundingBox or the same DOM trick.
- Promo code font fit: bisect until `scrollWidth ≤` pill text width, then vertically centre by ink insets.
- Re-run fit after fonts load (`document.fonts.ready`) and on every state change.
- Known refinement needed: "No Logo" text sizing for very long brand names.

## Interactions & Behaviour
- All fields update both previews live; Brand change resets colour overrides and loads brand defaults (`defaults`: eyebrow/line1/line2/sub/code/showPromo), T&Cs, logo, sport background.
- Colour overrides are per graphic; "Reset to brand" clears them. Main colour override replaces the brand bg.
- Uploaded logo is stored in state as an object URL and overrides the brand logo until Reset.
- Background/ball images are recoloured on canvas (cached by key) when a ball colour override is set; images are loaded as blob URLs.
- **Export**: for each selected graphic, rasterise the full-size node (not the scaled preview) with `html-to-image` (`toCanvas`, pixelRatio 1, width/height = node size; debug overlays filtered out), then encode **WebP at quality 0.85**; zip with JSZip and download. Filename pattern: `{BrandName}_{…}` (brand name stripped to alphanumerics + category/size). Verify filenames and quality with the team. Show loading state on the button while exporting (`exporting` flag).
- Button hover/active: none specified beyond cursor pointer; add standard states.

## State Management
Root state: `cat` (sportsbooks | predictions), `t1`/`t2` each `{book, sport, line1, line2, eyebrow, sub, code, promoLabel, showPromo, showCovers (SI logo), textLogo, logoOv, bgC, textC, accentC, pillTextC, ballColorC, tcs, stateNote, heroAccentOn}`, `exportSel {t1,t2}`, `exporting`, `showZones`. Shared fields (copy) write to both graphics. Derived values (fitted font sizes, logo box) are computed after render.

## Design Tokens
- Brand red: `#D71920` (SI accent, toggles, checkboxes accent-color, Export button, "All graphics" label)
- Editor surfaces: page `#0a0a0a`, panel `#141414`, borders `#262626`, input bg `#101010`, input border `#333333`, button bg `#1a1a1a`/`#262626` with border `#383838`
- Editor text: primary `#ededed`, body `#d6d6d6`, muted `#9a9a9a`, `#8a8a8a`, `#808080`; labels 11px uppercase letter-spacing .08–.1em, weight 600–700
- Input: 8px radius, padding 9×11, 13px; buttons 12px/600–700, radius 6–8px
- Panel radius 14px; pills 999px
- Graphic defaults: text `#ffffff`, pill bg `#ffffff`, per-brand accent/bg in the `books` data (see source ~lines 340–430; ignore Casino/Sweeps entries)
- Type: **Industry** (Book 400, Medium 500, Demi 600, Bold 700, Black 900), fallback `sans-serif`

## Assets
- `assets/si-logo.svg`, `si-logo-dark.svg` — SI logo
- `assets/si-bg-*.png` — sport backgrounds; `ball-*.png/svg` — decorative ball images (per brand/metal variants)
- `assets/logo-*.svg` — partner brand logos
- `assets/wave-square.svg`, `wave-wide.svg`, `promo-arrow.svg`
- **Fonts: Industry font files are NOT included.** Add `fonts/Industry-{Book,Medium,Demi,Bold,Black}.otf` (referenced by `@font-face` in the main file); until then it falls back to sans-serif and all measurements will be off. Re-tune after the real font loads.
- Casino/Sweepstakes/Covers assets were intentionally removed.

## Files
- `SI Promo Builder.dc.html` — main page, brand data, templates, fit engine, export
- `SISharedControls.dc.html` — shared controls panel
- `SIPromoControls.dc.html` — per-graphic colour overrides + SI logo toggle
- `support.js` — prototype runtime (reference only; do not port)
- `assets/` — images and logos

## Open items
- Upload Industry fonts and re-verify sizing; test "No Logo" with long brand names; verify Wide Banner headline hits ~75% width with promo off; confirm export quality/filenames. Dead code for the removed t3 template and unused brands can be dropped.
