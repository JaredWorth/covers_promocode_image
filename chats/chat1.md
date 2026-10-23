# Interactive Sportsbook Promo Templates

_Started 2026-06-24 13:45 UTC_

---

## User

Build three interactive image templates based on the three promo code designs provided. Each template should be independently editable with the following controls:

Sportsbook selector — a dropdown populated from a built-in database of sportsbook brands, each with its associated logo and brand colour palette. Selecting a sportsbook automatically updates the logo and colour scheme.
Ball type selector — a dropdown to swap the sports ball graphic (e.g. football, basketball, tennis ball, golf ball, etc.).
Promo code field — editable text input for the code displayed on the image.
Headline / body text fields — editable inputs for any text overlaid on the template.
Colour overrides — manual colour pickers for key elements (background, text, accents) that default to the selected sportsbook's brand colours but can be overridden.

The three templates should match the layouts in the uploaded images. All changes should update the preview in real time.

## Assistant

I'll start by examining the uploaded images and the existing project file.

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: list_files]_

_[tool: list_files]_

Only the three reference images are present (the "Covers Email" edits in the system note are from elsewhere — ignoring). I've reviewed all three layouts: a 1080×1080 square, a 1280×720 wide banner, and a wide banner with a phone mockup + arrow.

Before I build, a few things genuinely affect how this turns out. Let me ask.

_[tool: questions_v2]_

## User

Questions answered:
- ball_assets: I'll upload PNGs of the balls (football, basketball, etc.) — best fidelity
- sportsbooks: I'll upload official logos for each, BetMGM, Fanatics, DraftKings, FanDuel, Caesars, bet365
- layout_structure: Three separate frames laid out side-by-side on one canvas, each with its own controls
- export: w
- phone_mockup: Make the in-phone promo code field update with the promo code too
- editable_scope: T&Cs text, Show/hide the Covers logo

## Assistant

Got it. They'll upload ball PNGs and official sportsbook logos. Let me set up and gather design-system context (fonts, Covers logo, wave background).

_[tool: update_todos]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: copy_files]_

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: image_metadata]_

Now I'll generate the flowing gold contour-line backgrounds procedurally.

_[tool: run_script]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Now I'll generate gold-metallic placeholder ball graphics (swappable, user can upload real PNGs later).

_[tool: run_script]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: image_metadata]_

Let me make the wave overlays transparent so background-color overrides show through.

_[tool: run_script]_

Recoloring the Covers logo assets (white wordmark, orange icon) so I can use them as simple `<img>`s.

_[tool: run_script]_

Now the reusable controls panel as a child DC, then the main builder.

_[tool: dc_write]_

Now the main builder DC with all three template layouts.

_[tool: dc_write]_

_[tool: show_html]_

Looking strong. Let me check card 3 (phone) and the controls panel.

_[tool: multi_screenshot]_

Let me inspect the ball-dropdown value mismatch and view card 3.

_[tool: eval_js]_

Selects are correct (I misread). Let me view card 3 with the phone.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Card 3 matches the reference. Let me restore and verify a sportsbook switch + that the export library loaded.

_[tool: eval_js]_

_[tool: save_screenshot]_

All controls work — FanDuel switch updated logo, background, accent, and pill colors automatically. Let me clean up temp files and hand off.

_[tool: delete_file]_

_[tool: update_todos]_

Three independent, editable promo templates are built and matching the references. Each card has its own controls — sportsbook selector (auto-updates logo + brand colors), Ball A/B selectors with upload, promo code, headline/subhead/label/T&Cs text fields, manual color overrides (background, headline, accent, code text, code pill) with reset-to-brand, a Covers-logo toggle, and an **Export PNG** button (full resolution). Everything updates live, including the promo code shown in template 3's phone screen.

_[tool: ready_for_verification]_

These are transient streaming errors from `src="{{ hole }}"` being fetched literally before hydration. I'll hardcode the constant asset paths and drive the dynamic images via `background-image` (an invalid-when-literal CSS value doesn't fire a fetch). First the logic:

_[tool: dc_js_str_replace]_

Now batch-convert the dynamic images to background-image divs and hardcode constant asset paths:

_[tool: run_script]_

_[tool: show_html]_

_[tool: get_webview_logs]_

Clean — no console errors. The dynamic graphics now load via `background-image` (which doesn't fire a fetch while the hole is still literal), and constant assets are hardcoded.

_[tool: ready_for_verification]_

Done. Three independent promo template builders are live in **Promo Builder.dc.html**:

- **Square (1080×1080)**, **Wide Banner (1294×728)**, and **Banner + App Screen (1294×728)** — each matching its reference layout.
- Per-template controls: sportsbook selector (BetMGM, Fanatics, DraftKings, FanDuel, Caesars, bet365 — auto-swaps logo + brand colours), Ball A/B selectors with per-slot image upload, promo code / headline / subhead / label / T&Cs text fields, five colour overrides with reset-to-brand, a Covers-logo toggle, and full-resolution **Export PNG**.
- Template 3's phone screen mirrors the promo code live.

Two things to note for when you're ready: the sportsbook **logos** and the **ball graphics** are styled placeholders — upload your official PNGs via the "Upload logo" / ball "Upload" buttons in each panel and they'll replace the placeholders instantly. If you'd rather I bake your real assets in as the defaults, drop them in and I'll wire them into the database.

