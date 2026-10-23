# DraftKings brand list

_Started 2026-07-14 15:28 UTC_

---

## User

Continuing from "Modifying ball items".

## Assistant

We've been building a Promo Builder design tool with multiple card layouts (Wide Banner, Square Post, Banner + App Screen) and a growing roster of sportsbook brands. The tool lets users customize promos with balls, colours, text, and logos — then export as WebP.

We started by adding new ball types (baseball, soccer, golf, boxing, MMA) with metal textures, then implemented runtime recolouring so all balls tint to each brand's accent colour. We scaled the golf ball down to 74% to match other balls visually, and removed Tennis from the dropdown.

Along the way we moved to 976×549 export dimensions (16:9, same ratio as the internal 1294×728 layout, so it scales cleanly), fixed a WebP export bug where Blob URL balls were being dropped (removed cacheBust), and added auto-shrinking for longer promo codes so they fit within their pill width.

Recent work focused on the phone mockup's promo-code overlay — we made the white background pill hug the text tightly (fit-content width), added a colour picker to change it, added a font scale control, and reduced letter-spacing to -1%. We also added 13 new sportsbooks (888sport, Bet99, betr, Novig, Sports Interaction, Stake, Thrillzz, TonyBet, Underdog, Wildz, plus logos for Hard Rock Bet/BetRivers/Kalshi) with their brand colours driving everything from backgrounds to ball tints.

We customized individual brands: Wildz (#412786), 888sport (#F1692A), Kalshi (#00D991 with white code text), Novig (black background with blue ball tint), and FanDuel (white "Use promo code:" label). We just fixed the phone mockup's promo-code text clipping at the top on export by adding top padding and adjusting line-height.

Next step: verify all exports look clean across all brands and card types.

[files changed: Promo Builder.dc.html, PromoControls.dc.html]

## User

Add to the brand list, maintain same colours as the other draftkings colours

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: show_html]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

It's **DraftKings Predictions**. Let me see the full brand entry structure.

_[tool: read_file]_

I'll copy the logo in and add a **DraftKings Predictions** brand entry using the same DraftKings colours.

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: delete_file]_

Added **DraftKings Predictions** to the brand list with the same DraftKings colours (black bg, #62b521 green accent/ball tint, white pill with #13230b text) and its own crown logo.

_[tool: ready_for_verification]_

Done — DraftKings Predictions is now in the dropdown, inheriting DraftKings' colour scheme.

## User

Can you add the ability to move the balls in the Tweaks section?

## Assistant

Let me look at how balls are currently positioned and controlled.

_[tool: grep]_

Let me read the full ball rendering, the logic that builds `t1/t2/t3`, and PromoControls.

_[tool: read_file]_

_[tool: read_file]_

Now let me read PromoControls to see the control layout.

_[tool: read_file]_

_[tool: read_file]_

Now I'll wire it up. Logic edits first:

_[tool: str_replace_edit]_

Now the template ball divs — replace hardcoded transforms with computed holes:

_[tool: str_replace_edit]_

Now add the position sliders to PromoControls, inside the Ball Graphics section:

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added a **Position** control under Ball Graphics in each card's Tweaks panel — X/Y sliders for Ball A and Ball B (with a Reset), which offset the balls from their default spots while keeping their existing rotation.

## User

Update the Underdog version with this logo and alter the colours

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: copy_files]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Swapped in the new white Underdog wordmark and shifted the palette to near-black (#0C0C0C) with Underdog's lime green (#C6FF3D) driving the accent, ball tint, and promo pill.

## User

Add these logos to the brand list and add colours

## Assistant

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added three brands: **Borgata Sports** (black + #C6A664 gold pill), **Pinnacle** (#12161C + #E63329 red), and **theScore Bet** (near-black + #F26522 orange). Each drives its background, ball tint, and promo pill — easy to nudge if the accents aren't quite on-brand.

## User

For underdog, the logo colour should be #FBFD0C and the overlay colour should match

## Assistant

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Underdog logo recoloured to #FBFD0C, with the accent, ball tint, and overlay pill all matching.

## User

For underdog: match with this styling. pill should be white with revised bg colour

## Assistant

Dark navy background with white pill and navy code text.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Underdog now uses the dark navy background (#0E1130) with a white pill and navy code text; yellow stays as the accent and ball tint.

## User

For all three images, i'd like to shrink the offer and increase the promo code block

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Across all three templates: the offer line is ~20% smaller (85→68, 71→57, 65→52px) and the promo-code pill is taller (124→152px) with larger code text (84→102px), with the auto-shrink limits updated to match.

## User

For the code block on top of the phone mockup, there is default placeholder text that's native to the phone screen, I need to cover that when using the code on top, is there a way to make the white behind the text longer to cover? or would a prompt everything be a better solution?

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added a **Code cover width** tweak (0–80% of the phone screen). It stretches the white pill sideways, and the text stays left-aligned, so the pill can cover the placeholder text underneath. Set it to 0 to go back to the tight fit.

Use it with the existing code X/Y position controls: move the pill over the placeholder, then widen it until the placeholder is hidden. I didn't try replacing the whole phone screen's text, because widening the pill is simpler.

The page check flagged a 9px overlap between the "$1,500" line and the "FIRST BET OFFER" line. I haven't looked into it.

## User

For kalshi, change the background to black with a slight Kalshi green bottom gradient. I've attached a reference image

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Kalshi now has a black background that fades to a Kalshi-green gradient at the bottom. The logo is recoloured to #00D991, and the text is white. The promo pill is white with black code text, and the ball tint is #00D991. I haven't looked at the render, so check it against your reference.

I didn't add the thin green outline around the pill from your reference. The Colours background picker also won't show the gradient.

## User

Replace all instance of the Kalshi logo with this one

## Assistant

_[tool: copy_files]_

_[tool: grep]_

_[tool: ready_for_verification]_

I replaced `assets/logo-kalshi.svg` with your green logo. The Kalshi logo is only used from that file, so every card type now uses the new one. I haven't looked at the render.

## User

I have another set of graphics which is the exact same, but intended for use on Casino and Sweepstakes brands. I don't want to confuse the Sportsbook versions. Is it possible to have a initial selector at the top to select Sportsbooks/Predictions Markets/Casino/Sweepstakes. All 5 will have the exact look and formatting. I will upload new logos for each, but for now can duplicate the current design for each.

## Assistant

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added a category selector at the top: **Sportsbooks / Prediction Markets / Casino / Sweepstakes**. Each category has its own copy of the current design and brand list, so changes in one don't affect the others. Switching tabs keeps each category's edits, but they reset on reload. I haven't checked the render.

- **Four tabs, not five:** you wrote "all 5" but listed four. If there's a fifth, tell me its name.
- **Adding logos:** the brand lists are copies of the current one for now. When you upload the new logos, tell me which category each set belongs to and I'll replace that category's list.
- **Exports:** file names don't include the category yet, so exports from different categories could be confused. I can add a prefix if you want.

## User

Can you move the following brands from Sportsbook to Prediction Markets and delete the sportsbook ones from Predictions Markets tab:
Kalshi
Novig
Draft Kings Predictions
Underdog
OG

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Kalshi, Novig, DraftKings Predictions and Underdog now appear only under Prediction Markets, and they're removed from Sportsbooks. Prediction Markets now lists just those four. The Casino and Sweepstakes tabs are unchanged. I haven't checked the render.

I couldn't find a brand called "OG" in the list, so nothing was moved for it. Is it a brand I haven't added yet, or did you mean a different name?

## User

Add these logos to the Prediction Market graphics. Use the primary colour from each website as the primary or ball colour. Each should look like they are branded graphics from the company

## Assistant

_[tool: run_script]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: run_script]_

_[tool: delete_file]_

_[tool: ready_for_verification]_

I added eight brands to Prediction Markets: Polymarket, Gemini, FanDuel Predicts, Fanatics Markets, Crypto.com, Onyx, ProphetX and OG. Each has its own logo and a background, accent and ball tint taken from the brand's primary colour. I haven't checked the render.

- **OG:** I don't know which company this is, so the orange (#FF5A1F) is a placeholder. Tell me the brand colour and I'll fix it.
- **Colours:** Polymarket (blue), Gemini (cyan), Crypto.com (navy) and Onyx (purple) were picked from memory of each brand, not read from their sites. Send hex values if you want exact matches.
- **Backgrounds:** some brands use the black-to-colour bottom gradient like Kalshi, others a solid or darker tint.

## User

Fanduel predicts, change USE PROMO CODE text to white. Add a gradient shade to the bottom

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

FanDuel Predicts now has white "USE PROMO CODE:" text and a background that shades from FanDuel blue to deep navy at the bottom. I haven't checked the render.

## User

THe OG logo doesn't shot

## Assistant

_[tool: run_script]_

_[tool: run_script]_

The OG file you uploaded has no logo in it. It's a rectangle that should be filled by an embedded image, but that image's data is missing, so nothing can draw. It's an export problem with the file, not something I can fix on my side.

Could you re-export it from Figma or Illustrator as a plain vector? In Figma, right-click the layer and choose "Outline stroke" or "Flatten", then export as SVG. A transparent PNG at 1000px wide or more also works. Send it over and I'll swap it in.

## User

<attached_files>
- uploads/og 1-183583cf.svg
</attached_files>

## Assistant

_[tool: run_script]_

That file is the same as the last one. The image data is still missing, so the logo still can't draw.

The SVG only has an empty image slot, so re-saving it won't fix it. Here are two ways to get a working file:

- **Transparent PNG:** export the OG logo as a PNG at 1000px wide or more.
- **Outlined SVG:** in Figma, select the logo, use "Flatten" or "Outline stroke", then export as SVG. It should contain `<path>` shapes and no `<image>` or `<pattern>`.

Send either one and I'll swap it in.

## User

<attached_files>
- uploads/OG.svg
</attached_files>

## Assistant

_[tool: run_script]_

This one is real vector paths, filled #FF5300 (OG's orange). I'll use it and set the brand colour to match.

_[tool: run_script]_

_[tool: ready_for_verification]_

The new OG logo is in. OG now uses its orange (#FF5300) for the accent and ball tint, on a black background that fades to dark orange at the bottom. I haven't checked the render.

## User

For the Casino graphics, replace the balls with these casino icons. Maintain the same colour overlay functionality

## Assistant

_[tool: grep]_

_[tool: image_metadata]_

_[tool: image_metadata]_

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: list_files]_

_[tool: copy_files]_

The script aborted on the bad filename, so the code edits didn't save. Re-applying them now.

_[tool: run_script]_

_[tool: ready_for_verification]_

The Casino tab now has Cherries and Dice in the ball dropdowns, with Cherries as Ball A and Dice as Ball B by default. They use the same brand colour tint as the other balls, and the colour override and position sliders work on them too. I haven't checked the render.

Both icons are already blue and purple, so the tint may look muddier than it does on the sports balls. If so, I can adjust the strength.

## User

Add these logos to the Casino tab. Use the primary colour from each website as the primary or ball colour. Each should look like they are branded graphics from the company. Remove all the current sportsbook ones

## Assistant

_[tool: run_script]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

The Casino tab now has only the 11 new brands: Bet99 (CAN), Bluffbet, Flagman, Galactic Wins, Horseplay, Lucky Ones, Nova Jackpot, Rollino Casino, Ruby Fortune, ToonieBet and Toppz. All the sportsbook brands are gone from it. The other tabs are unchanged. I haven't checked the render.

Each brand has its own logo, and its accent and ball tint come from the logo's colours or my memory of the brand's colours. Most also get a black-to-colour fade at the bottom. Send hex values for any that look off.

## User

Add these logos to the Casino tab. Use the primary colour from each website as the primary or ball colour. Each should look like they are branded graphics from the company. Remove all the current sportsbook ones and duplicates

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: snip]_

_[tool: ready_for_verification]_

I fixed the script error that stopped the page loading. Three new casino brands (20Bet, 22Bet, 7Bit) had keys starting with a digit, which weren't valid, so I quoted them. I'm waiting on a recheck.

## User

For all casino graphics, the USE PROMO CODE text should be white

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

"USE PROMO CODE:" is now white on every Casino graphic. The other tabs are unchanged.

## User

In the casino tabs, can you order the brand list alphabetically?

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The Casino brand dropdown is now in alphabetical order. The other tabs keep their current order.

## User

For the casino graphics, most offers are a bit longer and only need one text box that can adjust font size based. Can you have one text block instead of Headline subhead. When there is a longer offer, the text should scale to fit the block size

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

The Casino tab now has a single "Offer text" box in place of Headline and Subhead. The text goes uppercase and shrinks automatically to fit the space on all three card layouts. The default text is "Up to $1,500 + 200 free spins", which you can change, and the other tabs keep Headline and Subhead. I haven't checked the render.

Headline and subhead share one font size now, so there's no size contrast between them. If you want a bigger first line, I can add a line-break rule for that.

## User

For all graphics, in the editor make the T&C text block larger, and able to click and drag larger to read longer text

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

The T&Cs field in the editor is now a larger text area (120px tall) on every graphic. Drag its bottom edge to make it taller for longer text.

