# Adaptive offer layout with promo code

_Started 2026-10-14 12:52 UTC_

---

## User

Continuing from "Sweepstakes tab logo design".

## Assistant

We're refactoring the Promo Template Builder for Sportsbooks and Prediction Markets to use a flexible offer-zone layout that adapts to whether a promo code is shown. The goal is to make offer text scale intelligently within reserved logo, code and fine-print zones, keeping text ratios constant while fitting both width and height.

I've implemented the new layout model on all three formats (Square, Wide, Banner + App Screen). The offer stack now reserves fixed zones first, then scales the entire offer together to fit remaining height. Each hero line still auto-fits to width independently, but the whole stack respects height constraints. Offer text centres vertically in its zone with equal padding, and spacing between zones increases to 1.5× when there's extra room (no code). The toggle between "Use promo code" on/off now recomputes the layout smoothly over ~260ms. I tested all four case scenarios (Bet / Get, Amount + Name, Fanatics, Stake) across all formats with and without codes—all fit without warnings.

Current state: the new layout is in place and tested against the four cases. Casino and Sweepstakes keep their old layout. The background check is running. I haven't visually confirmed the easing transition or tight-space cases in the browser yet.

Next steps: visually confirm the layout on screen, check the easing feels smooth, test edge cases with very long text, and confirm spacing feels right when toggling the code on/off. The Predictions tab brand presets (11 images uploaded earlier) are still pending—I noted them but haven't set them as defaults yet.

Files involved: Promo Builder.dc.html, SharedControls.dc.html.

## User

Change the layout logic so the offer text adapts to the available space 
depending on whether a promo code is shown.

LAYOUT MODEL (applies to every format and brand)
Treat each graphic as a vertical stack with these zones:
1. Logo zone (fixed)
2. Offer zone (flexible): lead-in, hero line(s), secondary line, 
   qualifier
3. Promo code zone (only exists when "Use promo code" is checked)
4. Fine print zone (fixed)

RULES
- Reserve the logo, promo code (if on), and fine print zones first. 
  The offer zone gets all remaining height.
- Size the entire offer stack to fit the offer zone by BOTH width and 
  height. Scale all text in the stack together, keeping the hero / 
  secondary / qualifier size ratios constant.
- Each hero line still auto-fits to container width independently 
  (shorter lines render larger), but the full stack must also fit 
  the zone's height. If height is the limit, scale the whole stack down.
- Vertically center the offer stack within the offer zone, with equal 
  space above and below.
- Set a max hero size per format (about 35-40% of canvas height) so 
  short offers don't become oversized. Any leftover space becomes 
  even padding.
- When there's extra room (no promo code), increase spacing between 
  logo, offer, and fine print slightly (up to 1.5x the default gap). 
  When space is tight (code shown), tighten spacing to the default.
- When the "Use promo code" checkbox is toggled, the layout 
  re-computes live with a smooth transition (200-300ms), and the 
  offer text grows or shrinks to fit.
- Keep the 8% safe margin. If the stack can't fit at the minimum 
  size, show the red warning.

Apply this to Square, Wide, and Banner + App Screen separately. In 
Banner + App Screen, the offer zone also excludes the phone mockup 
area, so compute it from the remaining width.

After the update, test these four cases in all three formats:
- "Bet $5, Get $150" with and without a code
- "$1,500 / First Bet Offer" with and without a code
- Fanatics "Bet $20, Get $350 / In Fancash" with and without a code
- Stake "Exclusive / 200% Bonus / Up To $5,500" with and without a code

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: show_html]_

_[tool: ready_for_verification]_

The offer-zone layout you described was already in `Promo Builder.dc.html`, so I made no code changes this turn.

It already covers the logo, code and fine-print zones, the offer stack scaling by width and height, and centred padding. It also has the 1.5× spacing when there's no code, the 260ms toggle transition, the red warning and a hero size cap per format. Banner + App Screen computes its offer zone from the width left after the phone mockup. Casino and Sweepstakes keep the old layout.

I've opened the file and started a background check on all four cases (with and without a code) in all three formats. I haven't confirmed them by eye. I'll only come back if the check finds a problem.

The Predictions brand presets from the 11 uploaded images are still not set as defaults.

## User

Rebuild the layout engine of the Promo Template Builder using a strict 
zone grid. Keep all brands, offer types, presets, and controls. Replace 
the current text positioning entirely.

ZONE GRID (every format, every brand)
Safe margin: 6% on all sides. Gaps between zones: 3% of canvas height.

WITH promo code:
  1. LOGO zone: 14% of height. Logo is centered, scaled to fit 
     (max 40% of canvas width), never overlapping other zones.
  2. OFFER zone: flexible, about 46%. Contains lead-in, hero line(s), 
     secondary line, qualifier.
  3. CODE zone: about 22%. "USE PROMO CODE:" label above the pill, 
     both scaled as one unit and centered.
  4. FINE PRINT zone: height is calculated from the T&C text length, 
     min 8%, max 25% of canvas height. Text is centered, with a 
     minimum readable size. Longer T&Cs make this zone taller, and the 
     OFFER and CODE zones scale down proportionally to make room. 
     Logo zone stays fixed.

WITHOUT promo code:
  The CODE zone is removed and its height goes to the OFFER zone. 
  Logo and fine print zones do not change.

TEXT BOX (inside the Offer zone)
Width = canvas width minus safe margins, and also minus keep-out areas 
for decor (footballs, balls, orbs) and the phone mockup. In the Wide 
format, limit the text box to the center ~70% of the canvas width so 
text never overlaps the balls. Decor sits behind the text and may be 
cropped by the canvas edge, but text never touches it.

TYPOGRAPHY RULES (variable sizes, fit to the box)
- Hero line(s): each line fits the text box WIDTH independently, so 
  shorter lines render larger. Cap hero size at a max per format.
- Secondary line (e.g. "UP TO $700", "BET RESET"): always 
  55% of the final rendered hero size.
- Qualifier (e.g. "IN BONUS BETS"): always 28% of the final 
  rendered hero size.
- Lead-in/label: always 22% of the final rendered hero size.
- If the hero is reduced by the width limit, the secondary line, 
  qualifier, and lead-in shrink with it to keep the ratios. If the 
  combined stack is taller than the OFFER zone, scale the entire 
  stack down uniformly until it fits.
- Spacing inside the stack: 8% of hero size between hero and secondary 
  line, 12% between the secondary line and qualifier. Line height 0.92.
- Center the stack horizontally and vertically in the OFFER zone.
- Minimum gap between the logo zone and the top of the offer text: 
  3% of canvas height. Text must never touch the logo.
- If the text can't fit at the minimum size, show a red inline warning 
  and keep it inside the box.

DEBUG VIEW
Add a "Show zones" toggle that draws thin colored outlines for the 
Logo, Offer, Code, and Fine Print zones plus the text box and safe 
margin. Off by default and never included in exports.

OFFER TYPE PRESETS (one-click buttons, fill all fields)
- Bet / Get: Bet $5, Get $150, qualifier "IN BONUS BETS OVER 14 DAYS"
  Renders: BET $5 / GET $150 as two hero lines.
- Amount + Name: $1,000 / BET RESET
  Renders: hero amount, name line below at secondary size.
- Match: 100% MATCH / UP TO $700
  Renders: hero "100% MATCH", secondary "UP TO $700".
- Long: EXCLUSIVE / 200% BONUS / UP TO $5,500
  Renders: label, hero, secondary.
- Custom: two free-text lines.

FORMAT-SPECIFIC
- Square: full vertical grid as above.
- Wide: same grid, but the text box is the center ~70% width. 
  If there is no promo code and the Bet / Get hero lines fit, 
  they may sit side by side on one row.
- Banner + App Screen: text box is the left portion only (excluding 
  the phone). The same zone grid applies inside that column.

Run the four test cases in all three formats, with and without a code:
"Bet $5, Get $150", "100% MATCH / UP TO $700", "$1,000 / BET RESET", 
and "EXCLUSIVE / 200% BONUS / UP TO $5,500" with a long T&C block. 
Confirm that nothing overlaps the logo, balls, phone, or fine print.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: ready_for_verification]_

I replaced the Sportsbooks and Prediction Markets layout with the zone grid. Casino and Sweepstakes still use the old layout. My test script found no overlaps with the logo, balls, fine print or code zone across 7 of the 8 case and code combinations. The eighth, Long with the very long T&C, overflows the fine print zone. The background check is still running.

**What I tested.** I ran four cases in all three formats, with and without a code. They were Bet $5 / Get $150, 100% Match / Up to $700, $1,000 / Bet Reset, and Exclusive / 200% Bonus / Up to $5,500 with a very long T&C block. I confirmed the hero, secondary and qualifier ratios in the script output and checked a screenshot of Long with the long T&C. I didn't look at the other cases visually.

**Long T&C problem.** With about 600 characters of T&C in Square, the fine print overflows even at its 25% cap. The text is clipped inside its box and the red warning appears. Nothing else overlaps.

**Show zones toggle.** It sits in the shared controls and is off by default. The outlines never appear in exports.

**Offer buttons.** The offer-type dropdown is now one-click buttons: Bet / Get, Amount + Name, Match, Long and Custom. Each fills all fields.

**Preset fix.** The brand presets (DraftKings, Fanatics and the others) weren't filling the Bet / Get text, so I fixed that.

**Text box width.** The 70% centre limit applies in Wide, and the Banner + App Screen column stops before the phone. I also shrink the text box wherever a ball would be touched. In Square with no code, the Bet / Get hero came out smaller than with a code (135/101 against 174/130) because the lower ball narrows the box. In Wide, the box dropped to about 52% of the width (677 of 1294 px) for the same reason.

**Wide one-row Bet / Get.** It only goes on one row when it comes out within 15% of the stacked size. I didn't check whether that triggers in any of the Wide tests.

**Not done.** The Predictions brand presets from the 11 uploaded images are still not set as defaults.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

Fixed the false red warning. The fit-to-box scale now only kicks in when the stack really overflows by more than 1px. I re-checked the default state and Bet / Get, Match and Amount + Name, with and without a code. None of them show a warning. I didn't re-run Long with the long T&C block, which should still warn for fine print.

## User

Add a separate zone grid for the Square (1080x1080) format when 
"Use promo code" is OFF. Keep everything else unchanged, including 
the with-code layout, brands, presets, and the Show zones toggle.

SQUARE, NO PROMO CODE
- Margins: 5% on all sides.
- Logo zone: 15% of height. Logo scales up to 45% of canvas width 
  and is centered.
- Offer zone: about 58% of height. This is flexible and absorbs 
  whatever the fine print zone doesn't use.
- Fine print zone: min 8%, grows with T&C length up to 25%. If it 
  grows, the Offer zone shrinks to make room.
- Gaps between zones: 4% of canvas height.
- No Code zone.

TYPOGRAPHY IN THIS MODE
- Hero lines: still width-first. Each line fits 80-85% of the text 
  box width, with no height-based cap. Only scale the whole stack 
  down if it is taller than the Offer zone.
- Because the Offer zone is taller, increase the supporting sizes: 
  secondary line 60% of hero (was 55%), qualifier 32% of hero 
  (was 28%), lead-in 25% of hero (was 22%).
- Increase the stack spacing by 1.25x: 10% of hero size between hero 
  lines and the secondary line, 15% before the qualifier.
- Center the stack vertically in the Offer zone, so space above and 
  below is equal.

BALANCE CHECK
- If the empty space above and below the offer stack is more than 
  12% of canvas height each, increase the logo zone up to 17% and the 
  gaps up to 5% before adding any more padding to the offer zone.
- Transition smoothly (200-300ms) when "Use promo code" is toggled 
  so the logo, offer, and gaps visibly re-balance.

DEBUG READOUT
In Show zones, report the empty space above and below the offer 
stack, and flag it in red if either exceeds 12% of canvas height.

Test in Square with the promo code off: "Bet $5, Get $150 / IN BONUS 
BETS", "100% MATCH / UP TO $700", and "$1,000 / BET RESET". Then 
toggle the code on and confirm the layout switches to the with-code 
grid with nothing overlapping.

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

Square with the promo code off now has its own zone grid. The with-code layout, other formats, brands, presets and the Show zones toggle are unchanged. I haven't looked at the Square no-code layout in a screenshot, so I haven't confirmed visually that nothing overlaps. The background check is running.

I set it up as you specified: 5% margins, 4% gaps, a 15% logo zone and your 60/32/25% type ratios. The offer zone takes whatever the fine print doesn't use. Hero lines are capped at 85% of the text box width, not by height. Logo and gaps step up to 17% and 5% when the balance check fails.

I measured the three no-code cases in Square, then toggled the code on:
- **Bet / Get with "IN BONUS BETS":** the empty space above and below the offer is 12.9% each, so it flags red, just over the 12% limit.
- **100% Match / Up to $700:** the hero is width-limited, leaving about 20% empty above and below. It flags red even after the logo and gaps step up.
- **$1,000 / Bet Reset:** 15.4% empty each side, also red.
- **With the code on:** the layout returns to the with-code grid with no red flags and no warning banner.

Match leaves the most empty space because the spec caps the hero by width only, so shorter offers can't grow. If you'd rather it filled the zone, I'd need to relax that 85% cap — say if you want it.

- **Readout:** I placed the empty-space readout at the bottom-left of the offer zone. It shows in all formats, not just Square.
- **Code on:** the readout measures space down to the code zone.
- **Ball keep-out:** the offer text box still narrows to clear the football and ball graphics, so some hero sizes are smaller than the 85% rule alone would give.
- **Toggle animation:** I haven't watched the logo and gap re-balance animation when toggling the code.

## User

Fix two sizing issues. Where these rules conflict with any earlier 
pill or hero sizing rules, DELETE the old rules and use these. Keep 
all zones, brands, presets, and the Show zones toggle.

1. HERO BLOCK: ONE UNIFORM FONT SIZE
   - All hero lines in a block share ONE font size. For Bet / Get, 
     "BET $5" and "GET $150" are identical in size, weight, and 
     line height. Never size hero lines independently.
   - Find the font size at which the LONGEST hero line fills 85% of 
     the text box width, and apply that size to every hero line.
   - If the stack is taller than the Offer zone, scale the whole 
     block down uniformly.
   - Center-align all lines. Line height 0.95.
   - Secondary line and qualifier keep their ratios to the hero size 
     (secondary 55-60%, qualifier 28-32%). These are different 
     roles, so they stay smaller than the hero.

2. PROMO PILL: FIXED PIXEL SIZES (for the 1080 / 976 canvases)
   Square (1080x1080):
   - Pill height 120px, min width 620px. Code text 76px bold. 
     Padding 48px left and right. Pill grows wider for long codes, 
     up to 760px.
   - "USE PROMO CODE:" label 34px, letter-spaced, 18px above the pill.
   Wide (976x549):
   - Pill height 88px, min width 440px. Code text 56px bold. 
     Padding 36px left and right. Max width 560px.
   - Label 24px, 12px above the pill.
   Banner + App Screen (976x549):
   - Pill height 80px, min width 380px. Code text 50px bold. 
     Padding 32px. Max width 460px, limited to the text column.
   - Label 22px, 10px above the pill.

   Rules:
   - The code text must be larger than the label text, always.
   - The pill's size comes only from these values. It must not 
     inherit from the hero, the offer zone, or any max-width cap.
   - Outer ring thickness = 8% of pill height.
   - Scale these pixel values proportionally if the canvas size 
     changes.

3. ZONE UPDATE
   - Let the Code zone be as tall as the pill, label, and gaps 
     require (about 24% of height in Square, 30% in Wide). The Offer 
     zone takes what remains after the Logo, Code, and Fine print 
     zones.
   - Gaps between zones: 2-3%.

4. READOUT
   In Show zones, display for each graphic: hero font size in px (and 
   confirm all hero lines match), pill width and height in px, and 
   code text size in px. Flag in red if any value is below the 
   targets above.

Re-render "Bet $5, Get $150 / IN BONUS BETS" with code COVERS in all 
three formats and confirm the readout matches.

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

Scrolling is not cooperating in the capture; measurements above are the source of truth. Handing to the verifier.

_[tool: ready_for_verification]_

I re-rendered "Bet $5, Get $150 / IN BONUS BETS" with code COVERS, and the Show zones readout matches your targets in all three formats. I checked this by measuring the page, not by eye — my screenshots failed to scroll to the graphics. The background check is still running.

Readout values (Wide and Banner + App Screen are in 976 × 549 export px):

| | Hero | Pill | Code | Label |
|---|---|---|---|---|
| Square | 131px × 2, lines match | 620 × 120 | 76px | 34px |
| Wide | 54px × 2, lines match | 440 × 88 | 56px | 24px |
| Banner + App Screen | 60px × 2, lines match | 380 × 80 | 50px | 22px |

Nothing was flagged red and no fit warning appeared.

- **Hero:** every hero line now shares one size, set so the longest line fills 85% of the text box. Line height is 0.95. I removed the old per-line sizing and the old height caps.
- **Pill:** it uses only your fixed values, scaled for the 976 canvases, with the ring at 8% of pill height. I removed the old pill scaling. The pill-size setting in Tweaks now has no effect on Sportsbooks and Prediction Markets. For codes too long for the max width, the code text shrinks but always stays larger than the label.
- **Wide hero is small:** at 54px the hero is much smaller than in Square. The code zone now takes about 32% of the height, which leaves the offer zone only about 190px. It isn't flagged because it still fits.
- **Gaps:** I set gaps to 2.5% for the with-code layouts. I left Square with no code at its 4–5% gaps from last turn; say if you want 2.5% there too.
- **Casino and Sweepstakes:** they keep their old pill and layout.

## User

On the Wide banner and square. you are only using a portion of the width. use the majority of the board for width and only have a small bit of padding on the sides

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

Wide and Square now use nearly the full width, except Square with a code shown, where the text still only spans about half. The offer, code and fine-print zones now span 91% of the canvas, with only a thin margin each side. Measured with Bet / Get:

- **Wide, code on:** "BET $5 GET $150" now sits on one row and spans 929 of 1294px. The hero roughly grew from 54 to 92px at export size.
- **Wide, code off:** the text spans 759 of 1294px, and the hero is 182px.
- **Square, code off:** the text spans 934 of 1080px.
- **Square, code on:** still about 547px wide. Here height is the limit, not width. Between the logo, the fixed-size pill and the fine print, there isn't room for two hero lines to grow any wider. A single row would come out smaller, so it stays stacked.

To make this possible, I removed two earlier rules for Square and Wide:
- **70% limit in Wide:** text is no longer kept to the centre 70% of the width.
- **Ball keep-out:** text can now sit in front of the footballs and basketballs instead of being pushed inward around them.

Banner + App Screen is unchanged and still avoids the phone and balls.

To fill the width in Square with a code, something has to give height. The quickest fix is shrinking the pill below its 120px target. Shortening or dropping the qualifier would also free room.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

Square and Wide now fill most of the width in both code states, measured on Bet $5 / Get $150:

- **Square, code on:** "BET $5 GET $150" now sits on one row and spans 86% of the width. The hero dropped from 145 to 123px to fit the width.
- **Square, code off:** unchanged, two stacked lines spanning 86% of the width.
- **Wide, code on:** one row spanning 81% of the width.
- **Wide, code off:** now one row too, spanning 86% (it was 59% stacked).

I measured no overlaps with the logo, code or fine print, and no fit warning. The background check is running.

To get there I made the one-row layout win more easily over stacked lines. I also cut the extra space reserved around the code zone from 5% to 2% of the height.

The catch: two Bet / Get lines now usually merge into one row in Square with a code and in Wide. That gives the most width, but a smaller hero than when stacked. If you'd rather keep the stacked look, I can make the stacked lines grow instead. Something else would have to give height, for example a shorter pill.

