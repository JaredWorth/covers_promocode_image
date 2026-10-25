# Handoff: Editor Tools Landing Page

## Overview
A single-purpose landing page for commercial editors. The editor picks their brand (Covers, Sports Illustrated, Sportsbook Review), then opens one of three tools for that brand. Secondary: usage guides/standards and a "Contact a designer" (Slack) panel. Visual style matches the Legend logo-exporter (https://oliver-clayton.github.io/logo-exporter/).

## About the Design Files
`Editor Tools.dc.html` is a **design reference built in HTML** (a prototype of intended look and behavior), not production code. Recreate it in the target codebase's existing environment (React, Vue, etc.) using its established patterns and libraries. If no environment exists, choose the most appropriate framework. The `.dc.html` format and `support.js` runtime are authoring tooling only; do not ship them. Logic and markup are all in the one file: read the template and the `Component` class.

## Fidelity
**High-fidelity.** Final colors, type, spacing and interactions. Recreate pixel-accurately.

## Screen: Landing (single view, fluid, max-width 1120px centered)
Page background `#e8ebef`, text `#14161c`, base font Sora 15px/1.45. Vertical stack: header, main (gap 36px, padding 32px 20px 48px), footer.

### Header
Flex, wrap, gap 16, padding 22px 20px 16px, bottom border 1px `#ccd3dc`.
- Left: Legend swan mark (inline SVG, 30px tall, fill `#040A1E`) + title "Commercial Editor Tools" (Sora 19px/700, letter-spacing -.017em) and subtitle "Pick your brand · open a tool" (IBM Plex Mono 10.5px, uppercase, .14em tracking, `#8b95a3`).
- Right: "Ask a designer" link button (anchor to #help): Plex Mono 11px uppercase .1em, white bg, 1px `#ccd3dc` border, radius 2px, padding 9px 12px.

### Section 01: Brand picker
- Label "01 · Which brand are you editing for?" (Plex Mono 10.5px uppercase .14em `#8b95a3`); right side hint: "Saved for next time" / "Not chosen yet".
- `role=radiogroup`; grid `repeat(auto-fit, minmax(200px,1fr))`, gap 10.
- Each brand = button (`role=radio`, `aria-checked`): white bg, 1px border, radius 2px, padding 16px 16px 14px, flex gap 14. Contents: 26x26 key badge (1/2/3, Plex Mono 11px, 1px border, radius 2); logo image (max-height: Covers 30px, SI 18px, SBR 26px; in a 30px-tall row); status text "Select"/"Selected" (Plex Mono 10.5px uppercase .12em).
- Default: border `#ccd3dc`, badge border `#ccd3dc`, text `#8b95a3`. Hover: border `#d81b7a`. Selected: border, badge border/text and status text `#d81b7a` (card stays white so black logos remain legible).

### Section 02: Tools
- Label "02 · What do you need to do?".
- No brand selected: dashed 1px `#ccd3dc` box, bg rgba(255,255,255,.5), padding 44px 24px, centered; h2 "Choose your brand first" (17px/600), body "Each brand has its own set of tools. We'll remember your pick next time." (13.5px `#5c6674`, max 42ch).
- Brand selected: grid `repeat(auto-fit, minmax(260px,1fr))`, gap 20. Each tool is a card `<a target=_blank rel=noopener>`: white, 1px `#ccd3dc`, radius 2, flex column; hover border `#d81b7a`.
  - Top bar (padding 11px 13px, bottom border `#dfe4ea`): number "01" (Plex Mono 12.5px/500) left; kind ("Generate"/"Edit", Plex Mono 10px uppercase .12em, `#d81b7a`) right.
  - Body (bg `#f6f8f9`, padding 28px 22px, min-height 170px, centered vertically): tool name 21px/600 -.02em inside a wrapper with four 9x9 magenta (`#d81b7a`) 1px corner crop marks offset -5px; description 13.5px `#5c6674`, max 34ch.
  - Footer (padding 10px 13px, top border `#dfe4ea`): brand name (Plex Mono 11px `#8b95a3`, ellipsis) left; CTA chip "Open →" (Plex Mono 11px uppercase, bg `#14161c`, white text, radius 2, padding 7px 10px) right.
  - Unavailable state (supported, currently unused): opacity .45, pointer-events none, `aria-disabled`, no href, CTA "Unavailable", footer "<Brand> · not available".

### Secondary row
Grid `repeat(auto-fit, minmax(300px,1fr))`, gap 20, align start.
- **Guides & standards** (label appends " · <Brand>" when selected): white list, 1px `#ccd3dc` border, rows padding 13px 14px separated by `#dfe4ea`; name 14px/500, description 12px `#8b95a3`, type tag right (Plex Mono 10px uppercase). Row hover: bg `#f6f8f9`, text `#d81b7a`. Rows: Logo usage guide (Guide), Promo image standards (Standard), Screenshot specs (Spec), Brand standards (PDF). **All hrefs are placeholders ("#"); copy is draft.**
- **Contact a designer** (id=help, label "Stuck?"): panel bg `#14161c`, white text, radius 2, padding 22px 20px. h2 17px/600; body 13.5px `#c3cad3`: "If a tool can't do what you need, or an asset doesn't look right, the commercial design team can help." Single button "Request on Slack" (Plex Mono 11px uppercase, bg/border `#d81b7a`, white text, padding 10px 13px; hover bg white, text `#14161c`). **Slack href is a placeholder ("#").** Email was intentionally removed.

### Footer
Top border 1px `#ccd3dc`, padding 14px 20px, Plex Mono 10.5px uppercase .12em `#8b95a3`: "Legend · Commercial Design" left, "Press 1 · 2 · 3 to switch brand" right.

## Interactions & Behavior
- Click brand: selects it, persists id to `localStorage['editorTools.brand']`, tools appear. On load, restore saved brand (configurable via `remember`).
- Keys 1/2/3 select brand (ignored when focus is in input/textarea/select).
- Tool cards open in a new tab. Transitions: border-color .12s.
- Focus: 2px `#d81b7a` outline, offset 2px. Links default `#14161c`, hover `#d81b7a`, no underline.
- Responsive: fully fluid via auto-fit grids; wraps on narrow widths.

## State Management
`brand: 'a'|'b'|'c'|null` only. Derived: current brand, tool list, guide list. No data fetching.

## Tool Links (per brand)
| Tool | Covers | Sports Illustrated | Sportsbook Review |
|---|---|---|---|
| Logo Generator | https://oliver-clayton.github.io/logo-exporter/ | same | same |
| Promo Code Image Editor | https://jaredworth.github.io/covers_promocode_image/ | .../covers_promocode_image/si/ | .../covers_promocode_image/sbr/ |
| Mobile Screenshot Generator | https://jaredworth.github.io/screenshot_builder2/ | same | same |

Tool copy: Logo Generator "Export partner and brand logo files sized for commercial pages." / Promo Code Image Editor "Update the code, offer and dates on promo artwork." / Mobile Screenshot Generator "Drop app screenshots into approved device frames." (draft wording).

## Design Tokens
- Colors: bg `#e8ebef`; ink `#14161c`; accent magenta `#d81b7a`; border `#ccd3dc`; divider `#dfe4ea`; muted text `#8b95a3`; secondary text `#5c6674`; panel text on dark `#c3cad3`; card body `#f6f8f9`; white `#fff`; logo mark `#040A1E`.
- Fonts (Google Fonts): Sora 400/500/600/700 (UI), IBM Plex Mono 400/500/600 (labels, buttons, metadata).
- Radius: 2px everywhere. No shadows.
- Spacing: gaps 8/10/12/14/16/20/36; page padding 20px.
- Labels: Plex Mono 10.5px uppercase, letter-spacing .12-.14em.

## Assets
`assets/covers.svg`, `assets/si.svg`, `assets/sbr.svg` are brand logos supplied by the user (SBR wordmark recolored to `#21252D` for white backgrounds). Use the official logo files from your brand system where available. Legend swan mark is inline SVG in the header.

## Files
- `Editor Tools.dc.html`: the design (template + logic)
- `assets/*.svg`: logos
