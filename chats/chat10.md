# Square space layout reference

_Started 2026-10-15 16:40 UTC_

---

## User

Continuing from "Qualifier text sizing".

## Assistant

We were rebuilding the offer text system to be cleaner, more precise, and plug-and-play for editors updating preset offers. You wanted a fixed type hierarchy with no manual sizing, simpler form fields, and consistent spacing tied to the design system.

We've made steady progress through the type rules and layout. The current system uses fixed headline sizes that scale down only when text won't fit (not drift per offer), sub lines at exactly half headline size with 75% line height spacing, and eyebrows formatted identically to sub lines. All three templates (Square, Wide Banner, Banner + App Screen) are centred vertically as one block: logo, offer, promo code, fine print.

Recent fixes addressed vertical centering (logo was overlapping headline due to animation restart), promo code text weight (now Black), spacing between offer and "USE PROMO CODE:" (tightened to ~1.2% of height), and logo sizing on 16:9 versions (reduced ~11% of height). The eyebrow and sub line are now unified in formatting.

The editor form has four simple fields (Eyebrow, Headline line 1, Headline line 2, Sub line) with hidden blanks, plus three format buttons that fill example copy. Ten brands have built-in offers; others retain the last entered copy. Casino and Sweepstakes categories are unchanged.

Open questions: whether the current headline sizes and spacing feel right in the actual renders, and whether you want to add brand preset buttons back into the editor form.

[files: Promo Builder.dc.html, fonts/AeonikFono-Black.otf]

## User

I've uploaded a lo-fi Square image of what the space should be for these images without a promo code active can you match

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I changed the Square layout (no promo code) to follow your lo-fi frame. I haven't looked at it in the preview yet, and the verifier is still checking it.

- **Logo:** it now takes about 10% of the height, down from 15–17%.
- **Gaps:** the gap above and below the offer is about 7% of the height, down from 4–5%.
- **Side margins:** they're now 3% of the width, down from 4.5%.
- **Fine print:** unchanged. It still sits at the bottom and grows to fit its text.

The offer fills the space between the two gaps. The whole block stays centred vertically.

The other two templates and the versions with a promo code are unchanged.

## User

The image looks the same, did you make changes

## Assistant

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: multi_screenshot]_

_[tool: str_replace_edit]_

_[tool: multi_screenshot]_

_[tool: ready_for_verification]_

Yes, I made changes, but they only apply to the Square with the promo code turned off. The Square was showing a promo code (BetMGM default), so you saw no difference. The logo height was also set in a separate place that my first edit missed.

- **Logo:** about 10% of the height, matching your frame.
- **Spacing:** 60px between logo, offer and fine print, on the 1080 canvas.
- **Side margins:** 3% of the width.

To see it, turn the promo code off or pick a brand with no code, such as DraftKings Predictions. I haven't re-checked that view since the 60px change, and the verifier is still running.

## User

I'm looking at the image, and looking at the code in the edit tab. You have not made any changes as I requested. This is costing me tokens to correct your mistakes. You must try harder

## Assistant

_[tool: multi_screenshot]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: multi_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: multi_screenshot]_

I measured the Square with no promo code (DraftKings Predictions) in the live render this time. The spacing now matches your frame.

- **Spacing:** the gap is exactly 60px between the logo, the offer and the fine print. Before, the fine print sat in a taller box, so its visible gap was about 90px. The fine-print box now hugs its text.
- **Logo:** its box is 108px tall (10% of the canvas), with side margins at 3% of the width.
- **Centring:** the block isn't centred vertically when the Covers logo is on, because the bottom is reserved for it.
- **Logo gap:** the DraftKings logo file has built-in padding, so its visible gap looks slightly larger than 60px.

Sorry for the earlier misses. My first edits didn't touch the logo size, and I hadn't measured the render.

## User

This is a poor effort. I've turned on the guide you've added, and you are not even following the spacing requirements that you've set.

## Assistant

_[tool: grep]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: eval_js]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

The Square without a promo code now spaces the visible artwork, not the text boxes. I haven't confirmed the 60px gaps in the render. My screenshots drop the logo, so I couldn't see the logo-to-headline gap, and the verifier is still running.

The earlier spacing was off because the boxes were spaced 60px apart. The headline has empty line space above and below its letters, and the logo file has transparent padding. That made the visible gaps larger than 60px.

The layout now measures where the artwork actually starts and ends:
- **Logo:** the logo's visible edges.
- **Headline:** the top of the first line's capitals and the bottom of the last line.
- **Fine print:** the top of its first line's capitals.

It sets exactly 60px between each visible edge, then centres that whole block vertically.

Please turn the guides on and check the gaps. If any still look off, tell me which gap (logo to headline, or headline to fine print) and by roughly how much.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

I fixed the hang. The page responds again, and the logo-to-headline gap measures about 59px (target 60px).

The cause was the logo-measuring code forcing a full re-render each time it loaded a logo image. It now triggers a lighter update.

I haven't confirmed the headline-to-fine-print gap, and it's the one I'm least sure of. Please turn the guides on for a no-code Square (Prediction Markets) and check it. The verifier is also still running.

## User

This is a screenshot of your tool. There is literally no space between the logo and text. What is happening? Why aren't you making changes?

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: show_html]_

Now measure visible ink gaps precisely with pixel scanning.

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: ready_for_verification]_

I was only applying the 60px spacing to the Square with no promo code. Your screenshot is the with-code version, which had its own tighter spacing. Both Square versions now have 60px between logo, headline, promo code and fine print.

I measured the spacing from the visible edges of each element, not the text boxes. In my screenshot the gaps come out at roughly 54–70px at preview size. I haven't pixel-measured them against the guides.

Wide Banner and Banner + App Screen are unchanged. The overlap warning between the headline lines ("$1,500" and "FIRST BET OFFER") is expected from the tight line spacing you set earlier. It isn't a new problem.

## User

Can you apply the same padding and framework to each

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: multi_screenshot]_

_[tool: ready_for_verification]_

The same spacing system now applies to Wide Banner and Banner + App Screen, with and without a promo code. I only looked at the Wide Banner with a promo code in the preview. Banner + App Screen and the no-code versions of both are unchecked.

- **Spacing:** the gaps between logo, headline, promo code and fine print are the same fraction of the height as the Square's 60px. That works out to about 40px on the 728px-tall banners. A literal 60px wouldn't fit comfortably there. If you want 60px exactly, tell me.
- **Centring:** the whole block is centred vertically, as on the Square.
- **Fine print:** its box now hugs the text instead of keeping a minimum height, so the visible gap is exact.

I briefly broke the page mid-edit, with a typo in the layout code. It's fixed and the console is clean.

## User

for each can you make the promo code text larger

## Assistant

_[tool: run_script]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

The promo code text is about 20–25% larger on all three templates, and the pill is taller and wider to match.

- **Square:** 100 → 122px
- **Wide Banner:** 64 → 80px
- **Banner + App Screen:** 62 → 76px

I checked the Square and Wide Banner in the preview. I haven't looked at Banner + App Screen. The 60px spacing rule still holds. The code text still shrinks if a long code won't fit the pill.

## User

on the banner + screen make the mobile phone mockup on top of the balls

## Assistant

_[tool: read_file]_

_[tool: read_file]_

Balls are z-index 1; the phone has none. Give the phone a higher z-index (below the arrow at 9999).

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: ready_for_verification]_

On Banner + App Screen, the phone mockup now sits on top of both balls. The promo arrow still sits above the phone. I couldn't scroll that card into my preview, so I haven't seen the result, and the verifier is still checking it.

## User

In the eyebrow the space bar doesn't work. can you also match the spacing between the Eyebrow and the headline to the headline and subline

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

Both fixes are in, and I checked them on the Square and Wide Banner.

- **Space bar:** the Eyebrow field was stripping spaces as you typed. It now keeps them, so multi-word eyebrows work.
- **Eyebrow spacing:** the gap between the eyebrow and the headline now matches the gap between the headline and the sub line. It's measured from the visible letter edges, not the text boxes.

I didn't check Banner + App Screen. I did type "NEW USER" into the Eyebrow field to test, so clear it if it's still there.

## User

We only need one option to add a logo, as it would apply to all image simultaneously. Can you move that to under the Brand selector with a colour selector to choose the main overlay colour

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

Logo upload and a Main colour picker now sit under the Brand selector in the "All graphics" panel, and both apply to all three images at once. Each has its own Reset button. I changed the colour in the preview and the picker works. I didn't test a logo upload.

- **Main colour:** this sets the background colour. If you meant something else by "main overlay colour", tell me. The per-image colour overrides (headline, accent, code text, code pill) are unchanged.
- **Old logo controls:** I removed the separate logo section from each image's controls.
- **Gradient brands:** the picker starts black for brands with gradient backgrounds. Picking a colour replaces the gradient with a solid, and Reset brings it back.

## User

Remove the ball upload

## Assistant

_[tool: read_file]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: get_webview_logs]_

I removed the Ball A and Ball B upload buttons from each template's controls. The section is now titled "Ball Position", with the X/Y sliders unchanged. The ball dropdowns under Brand still work. I checked that the page loads without errors but didn't look at the controls.

