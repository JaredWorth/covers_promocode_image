# Promo code pill alignment

_Started 2026-06-26 11:42 UTC_

---

## User

We have multiple lengths of promo codes. Align the promo code text within the pill, both horizontal and vertical. Put 40px of padding on the left and right of the pill and allow the pill width to adjust and hug to the width of the text of the promo code.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

All three pills sit in `align-items:center` flex columns, so `fit-content` will keep them centered. Making the edits:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

All three promo pills now hug their text (`width:fit-content`) with 40px left/right padding, while `align-items:center` + `justify-content:center` keep the code centered horizontally and vertically. Pills stay centered in the layout since their parent columns use `align-items:center`.

## User

increase the padding on the left and right to 80px

## Assistant

_[tool: str_replace_edit]_

Done — left/right padding on all three pills is now 80px.

## User

Add tweakable controls to Promo Builder.dc.html (declare with dc_set_props, read via this.props): center the promo code text in the text box vertically

## Assistant

_[tool: read_file]_

I'll add a tweakable prop for the promo code's vertical alignment within the pill, applied to all three templates.

_[tool: dc_set_props]_

_[tool: dc_js_str_replace]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added a **Promo code vertical alignment** tweak (top / center / bottom, default center) via `dc_set_props`, read through `this.props.codeVAlign` and mapped to `align-items` on all three pills.

## User

Some sportsbooks don't have promo codes.I need a selector box to turn the promo code block on and off. It can be a check box that turns the "Use Promo code", and promo code text and pill, on and /off. When off, the promotional heading text and sportsbook logo will automatically center in the graphic

## Assistant

I need to understand the full structure of the three templates first.

_[tool: read_file]_

_[tool: read_file]_

Now I'll add a per-template "Use promo code" toggle. Edits to the builder logic and templates, plus the control in PromoControls.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the templates — wrap each promo block in `sc-if` and make the containers center when off:

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Finally, the toggle control in PromoControls:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Each template now has a **"Use promo code"** checkbox in its controls. Toggling it off hides the promo label and code pill, and the heading text + sportsbook logo automatically re-center vertically in the graphic.

## User

The banner + app screen version lost the headline text and sub headline text. Can you add that back please?

## Assistant

Card 3 never showed the headline/subhead, and its controls have them disabled. I'll add the amount + offer to the left content and enable the inputs.

_[tool: str_replace_edit]_

_[tool: grep]_

The promoLabel now sits inside the `sc-if`. I'll insert the headline + subhead before that `sc-if` (so they stay visible regardless of the promo toggle).

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added the headline (`$1,500`) and sub-headline (`FIRST BET OFFER`) back to the Banner + App Screen template's left content, and enabled the Headline/Subhead inputs in its controls. They stay visible whether or not the promo code is toggled on.

## User

On Banner + App Screen version, can you add the arrow to the "Use promo code" logic? So it is removed with the other elements

## Assistant

_[tool: str_replace_edit]_

_[tool: read_file]_

Now close the `sc-if` after the arrow SVG:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The arrow now hides along with the promo label and code pill when "Use promo code" is toggled off.

## User

Add 40px space between the top logo and the text

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Set the gap between the top logo and the headline text to 40px on the Square Post.

## User

For all three, put an 80px gap between top logo and text

## Assistant

_[tool: str_replace_edit]_

_[tool: grep]_

The user's font edits were on card 3. Let me redo with the correct strings:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

All three templates now have an 80px gap between the top logo and the headline text.

## User

reduce the space between the subhead text and promo code label for all three images

## Assistant

_[tool: grep]_

I'll roughly halve each promo-label top margin: card1 64→32px, card2 26→14px, card3 36→18px.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Reduced the gap between the subhead and the promo code label across all three (card 1: 64→32px, card 2: 26→14px, card 3: 36→18px).

## User

Can you change the export file type from PNG to webp?

## Assistant

_[tool: dc_js_str_replace]_

Now update the three button labels:

_[tool: grep]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Exports now produce `.webp` files (quality 0.92), and all three buttons read "Export WebP".

## User

Can you attach the current headline and subhead to the selected brand? So if I change the brand, the text changes to the last current heading and subhead for that brand?

## Assistant

Each brand should remember its own headline/subhead. I'll store text per-brand and swap it on brand change.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Done. Each brand now remembers its own headline and subhead per template. Editing the text saves it to the currently selected brand, and switching brands swaps in that brand's last-used headline/subhead (falling back to the defaults for brands you haven't customized yet).

## User

on Banner + app screen, replace the mobile mockup with the attached iphone. Place the image behind the phone so it looks like a native mobile screen. Allow for the background image to be changed to a different phone screen and attached each image to the brand it was uploaded to. keep the promo code text on the screen.

## Assistant

Let me look at the uploaded images and their metadata.

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: view_image]_

_[tool: view_image]_

Both images are clear. The frame has a transparent screen window; the screenshot goes behind it. Let me measure the exact screen-window bounds in the frame by scanning its alpha channel.

_[tool: run_script]_

Screen window measured: inset ~6.2% left, ~2.2% top, 87.3%×95.5%. Now let me copy the assets and read the current phone block.

_[tool: copy_files]_

_[tool: read_file]_

Now I'll replace the entire hand-built phone with the image-based mockup. Replacing the full phone block:

_[tool: str_replace_edit]_

Now the logic: per-brand screen storage, default for BetMGM, upload handler, and compute fields.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now add the "Phone screen" upload control to PromoControls (shown only for card 3 via a `showScreen` prop), and pass the prop from the builder.

_[tool: str_replace_edit]_

_[tool: dc_html_str_replace]_

Let me screenshot card 3 to check the phone mockup and promo-code overlay alignment.

_[tool: show_html]_

I need to verify the overlay alignment, so a screenshot is warranted here.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

I need to scroll to card 3 (the third card is off-screen right). Let me scroll the editor row horizontally.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The capture re-renders and resets scroll. I'll nudge card 3 into view with a transform (which the capture honors), then revert.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

Card 3 now shows the iPhone frame with the BetMGM screen behind it. Let me zoom into the phone to check the promo-code overlay alignment.

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

Working correctly after a clean reload. Let me get a zoomed look at the phone overlay alignment.

_[tool: save_screenshot]_

The phone renders correctly with the screen behind the frame and the promo code on the bonus field (confirmed in the card3e capture). Let me reload to clear my inspection mutations and finalize.

_[tool: ready_for_verification]_

The Banner + App Screen now uses the real iPhone frame with the app screenshot sitting behind it (showing through the transparent screen), so it reads as a native phone screen. The promo code stays overlaid on the bonus-code field.

Each phone screen is tied to its brand: the screenshot you uploaded is saved to BetMGM, and a new **Phone Screen** uploader in that template's controls lets you drop a different screenshot for any other brand — switching brands swaps in that brand's saved screen (or shows an "upload a screen" prompt if none exists yet).

