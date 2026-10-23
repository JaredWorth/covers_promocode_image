# Sweepstakes tab logo design

_Started 2026-10-05 16:44 UTC_

---

## User

Add these logos to the Sweepstakes tab. Use the primary colour for each brand as the primary colour and balls. th

## Assistant

_[tool: list_files]_

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: copy_files]_

Now extract each logo's colors and see how they render.

_[tool: run_script]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

Inspect the embedded image content.

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 8 of the 16 logos to the Sweepstakes tab: AceBet, Betinia, LuckyLand Casino, Punt, Shuffle.us, SpeedSweeps, Spinfinite and Sweet Sweeps. I haven't looked at the tab yet; the background check is still running.

The other 8 files have no image data inside them, so there is nothing to show. They are CardCrush, Fore, Splash Coins, Chumba, SweepNext, West Ace, Zumba, and the file named "image 2". Please re-export them as vector SVGs or PNGs and I'll add them.

I took each primary colour from the logo files, so the brand colour drives the accents and balls. Punt's logo is plain white, so its orange is my guess. LuckyLand's navy is too dark to show on a dark background, so I used a brighter blue. Tell me the right values for either if you have them.

## User

Can you use the same text box styling and functionality as Casino?

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: grep]_

_[tool: ready_for_verification]_

Sweepstakes now uses the same text box setup as Casino:

- A single offer-text field, uppercase, with the same auto-fit and sorting.
- The same default offer text.
- The cherries and dice balls.

I haven't looked at the tab yet; the background check is still running.

## User

For sweet sweeps, can you use an off-white background, more creamy colour. invert the text, just for this brand.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Sweet Sweeps now has a cream background (#fbf3e4) with dark plum text and promo label, and an inverted pill (dark plum with cream text). Its pink accent and balls are unchanged, and no other brand is affected. I haven't checked how it looks yet; the background check is still running.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: ready_for_verification]_

I fixed both unreadable elements on the cream Sweet Sweeps background:

- **"T&Cs apply":** it now follows the brand's text colour instead of white, so it shows in dark plum on Sweet Sweeps.
- **COVERS wordmark:** it's now dark (black, not plum) on Sweet Sweeps.

Other brands look the same as before. I haven't looked at the result yet; the background check is still running.

## User

Add these logos to the Sweepstakes tab. Use the primary colour for each brand as the primary colour and icons.

## Assistant

_[tool: copy_files]_

Render a contact sheet of the ones with vector content.

_[tool: run_script]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 8 more logos to the Sweepstakes tab: Mafia Casino, Cases.gg, Big Pirate, Blitzmania, Frumzi, BetRivers.net, Lucky Spins and SweepShark. Each uses its logo's primary colour for the accent and balls. I skipped the background check, so I haven't looked at how they render. The page loads without console errors.

Five files (Robocat, Rich Sweeps, myprizeus and the two "image" files) have no image data inside them, so there was nothing to show. Please re-export them as vector SVGs or PNGs and I'll add them.

The page check also flagged a text overlap, "$1,500" against "FIRST BET OFFER". It's on the page as it loads, and I didn't investigate it.

## User

<attached_files>
- uploads/MyPrize.png
- uploads/Deal or no deal.png
- uploads/Robocat (PNG).png
- uploads/rich-sweeps-logo 1.png
- uploads/Amazon.png
- uploads/Robocat (PNG)-f0066a51.png
</attached_files>

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added the five PNG logos to the Sweepstakes tab: MyPrize.us, Deal or No Deal, Robocat, RichSweeps and Amazon Jackpots. I skipped the background check and haven't looked at how they render. The page loads without console errors.

The accent and ball colours are eyeballed from the logos, so tell me if any are off:

- MyPrize.us: blue
- Deal or No Deal: gold
- Robocat: purple
- RichSweeps: gold
- Amazon Jackpots: yellow

The page check still reports the "$1,500" / "FIRST BET OFFER" text overlap from before.

## User

For all logos in the casino and sweeps tabs, can you increase the size so they are more visible, especially at scale on mobiel device.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

`key` may not be in scope; check the function signature.

_[tool: run_script]_

`key` is in scope. Checking the result.

_[tool: ready_for_verification]_

I enlarged the logos on all three layouts for the Casino and Sweepstakes tabs. Each layout's logo area is taller and wider, roughly 50% bigger. The Sportsbooks and Prediction Markets tabs are unchanged. I haven't looked at the result yet; the background check is still running.

The taller logo area pushes the headline down a little. If it feels cramped on any layout, tell me which and I'll adjust.

## User

I agree the taller logos and square logos like bet99 etc, make it look crowded. Can you adjust so it appears like better design hierarchy?

## Assistant

_[tool: show_html]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Logo sizing on the Casino and Sweepstakes tabs now depends on each logo's shape, so square logos like bet99 are smaller and no longer crowd the headline. I haven't looked at the result yet; the background check is still running.

- **Wide logos:** they stay large, though a bit smaller than my last pass.
- **Square logos:** they have a lower height cap.
- **Headline:** the logo area keeps a fixed height, so the headline stays put when you switch brands.

The size limits are my best guess without seeing the render. If you want the logos bigger or smaller overall, tell me which layouts and I'll adjust.

## User

Add to casino, as previously done

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added all 10 logos to the Casino tab, the same way as the earlier ones. I skipped the background check, so I haven't looked at how they render. The page loads without console errors.

The brand colours are my best read of each logo, and a few are guesses:

- **Names:** I called the pink "X" logo "Clip Path Group" and the purple flag logo "Ace", from the file names. Tell me the real names.
- **Colours:** several logos are white or mostly blank in the files, so the accent colours for Pulsz Bingo (purple), MyBets (orange) and Ace (indigo) are guesses.

## User

Can you move the previous to Sweeps, I inadvertantly said casino

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I moved those 10 logos from the Casino tab to the Sweepstakes tab. I skipped the background check and haven't opened the tab to confirm. The page loads without console errors.

## User

Add to Sweeps tab, same process as before

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 8 logos to the Sweepstakes tab: Zula Casino, Shuffle Casino, SpinBlitz, Smiles Casino, TonyBet Casino, Tao Fortune, Sidepot and Modo. I skipped the background check, so I haven't looked at how they render.

Some accent colours are guesses:

- **Shuffle Casino and Modo:** the wordmarks are white in the files, so I used the icon colours: purple for Shuffle, pink for Modo.
- **TonyBet:** orange.
- **SpinBlitz:** blue.

Tell me if any should change.

The page check still reports the "$1,500" / "FIRST BET OFFER" text overlap, which I haven't investigated.

## User

Add to sweeps. same process as before.

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 8 logos to the Sweepstakes tab: WOW Vegas, BC.Game, Casino.Click, Fortune Wheelz, Fortune Coins, Funz City, Spree and RealPrize.com. I skipped the background check, so I haven't looked at how they render.

RealPrize's logo is dark navy, so it gets the same light treatment as Sweet Sweeps. It has a pale blue background and navy text, with an inverted pill. The other seven use dark backgrounds with the accent taken from each logo: blue for WOW Vegas, green for BC.Game, orange for Casino.Click, gold for the two Fortune logos and Spree, and pink for Funz City.

The "$1,500" / "FIRST BET OFFER" overlap warning is still there, and I haven't investigated it.

## User

Add to sweeps. Same process as before

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 8 new logos to the Sweepstakes tab: Legendz, Mega Bonanza, Zonko, PlayFame, NoLimitCoins, Lucky Bird, McLuck and Spinsly. I also replaced the existing Jackpota and Pulsz Bingo logos with these newer versions. I skipped the background check and haven't looked at how they render.

- **Spinsly:** the logo is dark grey, so it gets the light treatment like Sweet Sweeps. It has an off-white background, dark text, an inverted pill and a pink accent.
- **Legendz and Pulsz Bingo:** the files are all white, so the accent colours (purple for both) are guesses.
- **Other accents:** orange for Mega Bonanza, teal for Zonko, magenta for PlayFame, gold for NoLimitCoins, green for Lucky Bird and red for McLuck.

The "$1,500" / "FIRST BET OFFER" overlap warning is still there, and I haven't investigated it.

## User

Add to sweeps. Same process as before.

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added 7 logos to the Sweepstakes tab: High 5 Casino, Ding Ding Ding, Crown Coins, Golden Hearts Games, Hello Millions, Chanced and Funrize. I also replaced the existing Fortune Coins logo with the new version. I skipped the background check and haven't looked at how they render.

The High 5 and Golden Hearts files are all white, so their accent colours (orange and gold) are guesses. Please give me the right values.

The other accents come from the logos: purple for Ding Ding Ding and Chanced, green for Crown Coins, lime for Hello Millions and amber for Funrize.

The "$1,500" / "FIRST BET OFFER" overlap warning is still there, and I haven't investigated it.

## User

High 5 #431AA2

## User

Golden Hearts: #431AA2

## User

Golden Hearts: #431AA2

## Assistant

_[tool: run_script]_

Golden Hearts Games now uses #431AA2 for its accent and balls, with the same dark purple background and deep purple pill text as High 5. I haven't looked at how it renders.

## User

High 5 is showing as yellow can you change to #431AA2

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

High 5 on the Sweepstakes tab should now show #431AA2 instead of yellow. The cause was a name clash with the existing Casino-tab High 5 entry, which was overriding the new one. I gave the Sweepstakes entry its own name, so the Casino tab's High 5 is unchanged. I haven't looked at how it renders.

## User

Hello millions background should be #FD494A

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Hello Millions now has a solid #FD494A background instead of the dark gradient. Its lime accent, white text and pill are unchanged. I haven't looked at how it renders.

## User

Download Standalone HTML

## Assistant

_[tool: read_skill_prompt]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: present_fs_item_for_download]_

The standalone file is ready to download (16.9 MB, works offline). I haven't opened it to check it renders correctly, so please test it before sharing.

## User

In sweeps, add this logo, but change the text to white

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I added Jackpot Rabbit to the Sweepstakes tab with the logo text changed to white. I haven't looked at how it renders. The accent and balls use the logo's yellow (#ebff07), on a near-black background.

I changed every dark fill in the logo to white, not just the lettering. If any dark parts of the rabbit artwork turned white too, tell me and I'll limit the change to the text.

The standalone HTML I exported earlier doesn't include this logo. I can re-export it if you want.

## User

For the downloaded URL string, can you format to be "Covers_Sweepstakes_JackpotRabbit_1080x1080" so for each type its: [brand_sector_brand_size]

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

State is per-template at `this.state[key]`; fix the lookup.

_[tool: run_script]_

_[tool: ready_for_verification]_

Downloads are now named `Covers_[Sector]_[Brand]_[W]x[H].webp`, for example `Covers_Sweepstakes_JackpotRabbit_1080x1080.webp`. Spaces and punctuation are removed from sector and brand names, so "Prediction Markets" becomes `PredictionMarkets`. The size comes from the exported image, so each layout gets its own dimensions. I haven't tested a download, and the standalone HTML I exported earlier still uses the old file naming.

## User

For each promo pill they should all have consistent padding around the text for each image. 24px on top and bottom. 46 on left and right

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: ready_for_verification]_

All three layouts now give the promo pill 24px top and bottom and 46px left and right. The pill height now follows the text instead of being fixed at 152px. I also resized the code-fitting widths, so long codes still shrink to fit the pill's maximum width. I haven't looked at the result, and the background check is still running.

I left the small downward offset on the code text unchanged. If the text looks off-centre vertically in the pill, tell me and I'll adjust it.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I changed the code text on all three layouts so the pill's 24px top and bottom padding is measured from the letter edges, not from the text box. This fixes the off-centre text the check found. I haven't looked at the result, and the background check is still running.

## User

I would like the text on all three graphics to be changed at the same time for efficiency.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Typing in any of these fields in one graphic's controls now updates all three graphics at once: headline amount, offer text, promo label, code and T&Cs. I haven't tested it in the browser.

Brand, balls, colours, logo and positions are still set separately for each graphic.

## User

I would like all brands graphics to change when one is changed

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: run_script]_

Leftover fragment from the old function; remove it.

_[tool: run_script]_

_[tool: ready_for_verification]_

Choosing a brand in any graphic's controls now switches all three graphics to that brand. Each graphic keeps its own remembered text for that brand. The error from my last edit is fixed, and the page loads without console errors. I haven't tested the brand switch in the browser.

Balls, colours and logo uploads are still set separately for each graphic. Tell me if you want those linked too.

## User

Make this the Covers logo

## User

Make this the Covers logo

## User

Can you reconfigure and redesign the interface of the editor so the Brand, Ball Graphics, Headline, promo code and t&cs are in one editing block, with the other options available per graphic for finer editing per graphic.

## Assistant

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

The editor now has one "All graphics" block above the three graphics. It holds Brand, Ball A and B, headline or offer text, subhead, promo code toggle, label and code, and T&Cs. Edits there apply to all three graphics. I haven't looked at it in the browser, and the background check is still running.

Each graphic keeps its own controls for finer edits:
- Logo upload
- Ball image uploads and X/Y position
- Colour overrides
- The Covers logo toggle
- The phone screen upload (graphic 3 only)

The "Use promo code" toggle and the ball choices now sync across all three too.

## User

Formatt all pills like this. Adhere to proper colouring per brand

## Assistant

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

All promo pills on the three graphics now follow your PromoCodePill reference. Each has:
- a thick white border,
- a soft ring around it in the pill's own colour,
- a drop shadow,
- the label above in the pill's colour.

The pill fill is a pale tint of each brand's accent, so every brand gets its own colour. Brands that already had a custom pill colour keep it. The dark text on the pill is unchanged. I haven't looked at the result, and the background check is still running.

Light-background brands (Sweet Sweeps, RealPrize, Spinsly) keep their dark pill, and the border matches their background so it doesn't glare.

I kept the existing 24px/46px padding and the current code font, not the reference's 112px size or Aeonik Fono font. Tell me if you want the font changed.

## User

FOnt changed

## Assistant

_[tool: grep]_

_[tool: list_files]_

_[tool: run_script]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: grep]_

_[tool: list_files]_

_[tool: list_files]_

I can't switch the pill code to Aeonik Fono yet. The font file isn't in this project, and the design system project is empty. Without the file, the code would fall back to a generic monospace font and look worse than the current Founders Grotesk.

Upload the Aeonik Fono files (.otf, .ttf or .woff2, ideally Bold) and I'll apply it to the code text on all three graphics. I'll also resize the code to fit the pill.

## User

<attached_files>
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-semibold.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfonovf.ttf
- uploads/Aeonik Fono Full Family Desktop/CoType EULA Desktop Feb '25.pdf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-thin.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-black.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-bold.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-medium.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-regular.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-light.otf
- uploads/Aeonik Fono Full Family Desktop/aeonikfono-air.otf
</attached_files>

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed the two image-load errors on the Covers footer logos in graphics 1 and 2. Each graphic now picks between two logos, the light-lettered one and the dark-lettered one for light-background brands. The logos look the same as before. I haven't confirmed that the errors are gone, and the background check is still running.

The check also didn't confirm how the Aeonik Fono code text sits vertically in the pill. Tell me if it looks off.

## User

It looks off

## Assistant

_[tool: show_html]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed the vertical position of the code text in the pill. I measured the Aeonik Fono letters in the page: the old downward shift I'd left over from the previous font was pushing the code too low. I removed it and set the line height to match the letter height. The code now sits centred, with the 24px padding measured from the letter edges. I haven't looked at it on screen, so tell me if it's still off.

The page check still reports the "$1,500" / "FIRST BET OFFER" overlap, which I haven't investigated.

## User

Can you match the font weight and letter space of the uploaded file?

## Assistant

_[tool: grep]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I matched the promo label above the pill to your reference file: Aeonik Fono Regular, uppercase, with 0.14em letter spacing, on all three graphics. The code text inside the pill already matched, at Bold with 0.01em spacing. I haven't looked at the result on screen.

The page check still reports the "$1,500" / "FIRST BET OFFER" overlap, which I haven't investigated.

## User

for the pill, match the colouring of the uplaoded file

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The pills now use the colouring of your reference file for every brand. I haven't looked at the result on screen.

- **Pill fill:** a pale tint of the brand's accent, like the cream in your file. Brands with their own custom pill colour now get this tint too.
- **Code text:** near-black (#0c0a06) on every brand.
- **Label above the pill:** a slightly deeper tint of the same colour.
- **Border and ring:** white border, with a soft ring in the pill colour.

The light-background brands (Sweet Sweeps, RealPrize, Spinsly) keep their dark pills. Their cream or pale backgrounds would wash out a pale pill.

The page check still reports the "$1,500" / "FIRST BET OFFER" overlap, which I haven't investigated.

## User

YOur edit is incorrect. I'l like the colouring to look like this

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Every pill now uses the exact colours from your screenshot, on all brands, not a tint of each brand's accent. I haven't looked at it on screen.

- **Pill fill:** #f4e3a1.
- **Code text:** #0c0a06.
- **Label above the pill:** #e9d9a0.
- **Ring and border:** a 25% ring in the fill colour and an 8px white border.

Sweet Sweeps, RealPrize and Spinsly still have their dark pills, since the pale label would be unreadable on their light backgrounds. Tell me if you want them on the cream pill as well.

I took "colouring like this" to mean one fixed colour for every brand. If you'd still like some per-brand variation, say how it should work.

## User

For all graphic the balls should be behind the text and pormom pill

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

On all three graphics, both balls now sit behind the logo, headline, promo label, promo pill and T&Cs. Before, the bottom ball on graphic 1 was drawn over the text. I haven't looked at the result on screen.

On graphic 3, the phone and arrow keep their existing layering, so the balls also sit behind them.

## User

for the pill. match the padding below

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The promo pill on all three graphics now has 26px vertical and 64px horizontal padding, matching your screenshot. I also reduced the width available to the code text to allow for the wider padding and the thicker border, so long codes still shrink to fit. I haven't looked at the result on screen.

The page check still reports the "$1,500" / "FIRST BET OFFER" overlap, which I haven't investigated.

## User

Update the Promo Template Builder to standardize all our offers around 
one structure: Label (optional), Lead-in (optional), Hero line(s), 
Qualifier (optional), Promo code, T&Cs.

1. Replace the Headline field with an "Offer type" selector:
   - Bet / Get: inputs for Bet amount, Get amount, Qualifier. 
     Renders "BET $5" and "GET $150" as two stacked hero lines. 
     $ is added automatically.
   - Amount + Name: inputs for Lead-in (optional), Amount, Name. 
     Renders lead-in small, Amount as the hero, Name on a second 
     line at ~55% of hero size.
   - Match: inputs for Label (optional), Percent, Word 
     (MATCH or BONUS), Cap amount. Renders Label small, then 
     "100% MATCH" as the hero, then "UP TO $700" at ~55% of hero size.
   - Custom: two free-text lines, line 2 optional.

2. Size rules:
   - Each hero line auto-fits to container width independently, 
     within a min and max size. Shorter lines render larger.
   - Secondary line ~50-60% of hero. Qualifier ~25-30% of hero. 
     Lead-in and Label small.
   - Tight leading (0.9), center aligned, 8% safe margin.
   - Editors never set line breaks. Each graphic format wraps and 
     balances text on its own.
   - If text can't fit at min size, show a red warning and don't overflow.

3. Brand presets (selected via the Brand dropdown) set automatically:
   logo, background color and pattern, decor objects, default promo 
   code (editable), and locked T&Cs. Add an optional "State note" 
   field appended to the T&Cs. Keep T&Cs read-only. Reserve a fixed 
   fine print zone per format so long T&Cs never collide with the offer.

4. Hero text is white by default. Add an optional per-brand accent 
   color setting for brands where contrast supports it.

5. Add one-click preset buttons using real offers:
   - DraftKings: Bet $5, Get $150, "IN BONUS BETS OVER 14 DAYS"
   - bet365: Bet $10, Get $150
   - Fanatics: Bet $20, Get $350, "IN FANCASH", code COVERS350
   - theScore Bet: $1,000 / BET RESET
   - Betr: $200 / NO SWEAT ENTRIES, code COVERSBONUS
   - Novig: GET UP TO / $100 / BONUS, code COVERS100
   - Tonybet: 100% MATCH / UP TO $700, code COVERSTB
   - Stake: EXCLUSIVE / 200% BONUS / UP TO $5,500, code COVERSBONUS

6. Apply every edit live to all three graphics (Square, Wide, 
   Banner + App Screen), with auto-fit running separately per format.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

## User

For the sportsbook and Predictions template: Update the Promo Template Builder to standardize all our offers around 
one structure: Label (optional), Lead-in (optional), Hero line(s), 
Qualifier (optional), Promo code, T&Cs.

1. Replace the Headline field with an "Offer type" selector:
   - Bet / Get: inputs for Bet amount, Get amount, Qualifier. 
     Renders "BET $5" and "GET $150" as two stacked hero lines. 
     $ is added automatically.
   - Amount + Name: inputs for Lead-in (optional), Amount, Name. 
     Renders lead-in small, Amount as the hero, Name on a second 
     line at ~55% of hero size.
   - Match: inputs for Label (optional), Percent, Word 
     (MATCH or BONUS), Cap amount. Renders Label small, then 
     "100% MATCH" as the hero, then "UP TO $700" at ~55% of hero size.
   - Custom: two free-text lines, line 2 optional.

2. Size rules:
   - Each hero line auto-fits to container width independently, 
     within a min and max size. Shorter lines render larger.
   - Secondary line ~50-60% of hero. Qualifier ~25-30% of hero. 
     Lead-in and Label small.
   - Tight leading (0.9), center aligned, 8% safe margin.
   - Editors never set line breaks. Each graphic format wraps and 
     balances text on its own.
   - If text can't fit at min size, show a red warning and don't overflow.

3. Brand presets (selected via the Brand dropdown) set automatically:
   logo, background color and pattern, decor objects, default promo 
   code (editable), and locked T&Cs. Add an optional "State note" 
   field appended to the T&Cs. Keep T&Cs read-only. Reserve a fixed 
   fine print zone per format so long T&Cs never collide with the offer.

4. Hero text is white by default. Add an optional per-brand accent 
   color setting for brands where contrast supports it.

5. Add one-click preset buttons using real offers:
   - DraftKings: Bet $5, Get $150, "IN BONUS BETS OVER 14 DAYS"
   - bet365: Bet $10, Get $150
   - Fanatics: Bet $20, Get $350, "IN FANCASH", code COVERS350
   - theScore Bet: $1,000 / BET RESET
   - Betr: $200 / NO SWEAT ENTRIES, code COVERSBONUS
   - Novig: GET UP TO / $100 / BONUS, code COVERS100
   - Tonybet: 100% MATCH / UP TO $700, code COVERSTB
   - Stake: EXCLUSIVE / 200% BONUS / UP TO $5,500, code COVERSBONUS

6. Apply every edit live to all three graphics (Square, Wide, 
   Banner + App Screen), with auto-fit running separately per format.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Sportsbooks and Prediction Markets now use the structured offer layout. Casino and Sweepstakes are unchanged. I haven't looked at the page yet, and the background check is still running.

- **Offer type:** a selector replaces the Headline field, with Bet / Get, Amount + Name, Match and Custom. Each shows only its own inputs, and `$` is added automatically to plain numbers.
- **Auto-fit:** each hero line is sized separately for each graphic, so shorter lines come out larger. Secondary lines are about 55% of the hero and the qualifier about 27%. Leading is 0.9, and there is an 8% safe margin on each side.
- **Warning:** if text can't fit at the minimum size, a red warning lists the affected graphics and the text is clipped, not overflowed.
- **Brand presets:** choosing a brand sets its default promo code. T&Cs are read-only and locked to the brand, with an optional State note appended. Each graphic has a fixed fine-print zone that shrinks the text to fit.
- **Hero colour:** white by default. DraftKings, bet365, betr, Novig and Stake show a "Brand accent on hero text" checkbox.
- **Preset buttons:** all eight offers sit above the editor and apply to all three graphics. Novig switches to Prediction Markets.

- **T&Cs copy:** I don't have real T&Cs text, so every brand uses a placeholder, "21+. New customers only. T&Cs apply." Please send the actual copy per brand and I'll lock it in.
- **Tonybet:** the Sweepstakes "tonybet" entry was overriding the sportsbook one. I renamed the Sweepstakes one, so Tonybet now appears under Sportsbooks.

Not done yet: the Square graphic's vertical spacing is the most likely to feel tight with the larger fixed text block, and I haven't checked it on screen.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

Re-apply the lost JS edits (using function replacers).

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: run_script]_

_[tool: ready_for_verification]_

The file corruption is repaired. A text-replacement bug had cut off the end of `Promo Builder.dc.html`. I rebuilt the missing code from an older complete copy and re-applied every change since then:

- the offer types
- auto-fit
- presets
- the T&Cs zone
- the pill styling
- the download file naming
- the covers logo variants

The whole script now parses and the file ends correctly. That earlier error report described the broken version, so it no longer applies. A new background check is running, and I haven't looked at the page myself.

Still to check on screen:
- the presets row
- Bet / Get hero lines fitting in all three graphics
- the T&Cs zone staying clear of the pill
- the red warning on overlong text

## User

Found issues — fixing…

## Assistant

_[tool: show_html]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed the crowding on the Banner + App Screen graphic. The T&Cs zone was almost touching the bottom edge and the pill's ring.

The left column there has a fixed height, and the logo, offer text, pill and T&Cs together were taller than it. I tightened the space the column uses:
- smaller logo area (150 to 120px),
- smaller gap above the offer text (40 to 24px),
- shorter offer-text block (270 to 220px).

The offer text on that graphic is a little smaller as a result. I haven't looked at it on screen; a background check is running.

In Bet / Get, both hero lines still come out the same size, because the height limit sets the size, not the width. If you want shorter lines to render larger, I'd need to let each line size to its own width. Tell me if you want that.

## User

The text is cut off

## Assistant

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've fixed what was cutting off the offer text. The text block was clipping its own contents. With the tight line spacing, the top and bottom of the `$` signs, and the qualifier's lower edge, were being trimmed. On the banner the text filled the block exactly. I removed the clipping on all three graphics.

The size limits are unchanged, so nothing else moves. If text still can't fit at its minimum size, the red warning still appears.

I haven't looked at the result. If you meant different text, such as the T&Cs or the pill code, tell me which graphic and I'll check that.

## User

For the scoreBet , the colouring should be this:

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

theScore Bet now follows your reference colouring. I haven't looked at it on screen, and I matched the blues by eye from your screenshot.

- **Background:** black with a bright blue glow from the top right and a softer one at the bottom left.
- **Balls:** tinted blue.
- **Pill:** white with navy code text and a blue border, no outer ring.
- **Label above the pill:** white.

This brand now uses its own pill colours instead of the standard cream pill. I used a blue accent, so the "Brand accent on hero text" checkbox doesn't apply here, and the headline stays white.

## User

The pill should adjust the colouring for each brand, and should be a light tint of the brand colour

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

Each brand's pill is now a light tint of its own accent colour. That includes theScore Bet, whose pill is now light blue. The white border, soft ring and near-black code text from the reference are the same on every brand. The label above the pill is a slightly deeper tint of the same colour. I haven't looked at it on screen.

Sweet Sweeps, RealPrize and Spinsly still have their dark pills, because the pale label would be unreadable on their light backgrounds. Tell me if you want them on tints too.

The tint strength is my best match to the cream in your reference. If any brand looks too washed out or too saturated, say which and I'll adjust.

## User

Remove the presets

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I removed the preset buttons row from the editor. I left the preset code in the file, unused, in case you want it back.

## User

The lead-in needs padding on the bottom so it's not running into the Amount

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I increased the space under the lead-in and label so it no longer runs into the amount. The gap is now 24px on the Square, 18px on the Wide banner and 16px on Banner + App Screen, up from 10px. The auto-fit counts this space, so the amount may shrink slightly to make room. I haven't looked at the result on screen.

## User

For the Bet/Get, combine the bet/get text fields into 1 and increase the size of qualifier

## Assistant

_[tool: run_script]_

Placeholder landed on the wrong element; fix it.

_[tool: run_script]_

_[tool: ready_for_verification]_

For Bet / Get there is now one "Bet / Get amounts" field. Type both amounts separated by `/` or a comma, for example `5 / 150`, and `$` is still added automatically. The qualifier is larger, about 40% of the hero size (up from 27%), with a 24px minimum. I haven't looked at it on screen.

## User

Remove the preselected text "Bet and Get" since sometimes its' "spend". allow the editor to type the offer out

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The "Bet" and "Get" words are no longer added automatically. Editors now type the full offer in one field. A `/` starts the second line, for example `SPEND $50 / GET $150`, and the default is `BET $5 / GET $150`. `$` signs are not added automatically in this offer type, so type them in. I haven't looked at it on screen.

## User

Increas the size of qualifier text to have more balance, feels out of place

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I increased the qualifier text from about 40% to 50% of the hero size, with a 28px minimum. That is the same weight as the secondary lines in the other offer types. I haven't looked at it on screen. A longer qualifier will wrap to two balanced lines, and the hero lines shrink a little to keep everything in the block. If it still feels off, tell me whether it needs to be bigger or smaller.

## User

For predictions tab, save these all as default and starting points for each brand

## User

For predictions tab, save these all as default and starting points for each brand

## User

for the bet get offer, the text should be the same size on both lines

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

In the Bet / Get offer type, both lines now render at the same size. The size is set by the longer line, so the shorter line no longer grows larger. Other offer types still size each line separately. I haven't looked at it on screen.

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

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: ready_for_verification]_

Each graphic now reserves its logo, promo code (when on) and fine print zones first, and the offer text fits the height that remains. A background visual check is still running, and I haven't looked at the result myself.

- **Fit:** the offer fits by both width and height. The hero, secondary line, qualifier and lead-in keep fixed size ratios and shrink together when height is the limit.
- **Hero lines:** each still fits the width on its own. The Bet / Get lines stay equal.
- **Centering:** the offer sits vertically centred in its zone, with equal space above and below.
- **Maximum size:** the hero is capped at about 38% of canvas height.
- **Spacing:** with no code, the spacing around the offer grows to 1.5× the default.
- **Banner + App Screen:** the offer width comes from the left column only, so the phone area is excluded.
- **Toggle:** toggling "Use promo code" recomputes the layout. The offer text eases into its new size over about 260ms; the code and fine print areas change instantly. I couldn't see the easing in my test, because the preview was in the background.

I also fixed an ordering bug that left the stack mis-centred after a code toggle: the pill now sizes first, then the offer.

I tested the four cases in all three formats, with and without a code:

| Case | Square | Wide | Banner + App Screen |
|---|---|---|---|
| Bet $5, Get $150 | fits, centred | fits, centred | fits, centred |
| $1,500 / First Bet Offer | fits, centred | fits, centred | fits, centred |
| Fanatics, Bet $20 / Get $350 / In Fancash | fits, centred | fits, centred | fits, centred |
| Stake, Exclusive / 200% Bonus / Up To $5,500 | fits, centred | fits, centred | fits, centred |

All 24 combinations fit with no red warning.

The Square and Wide layouts used to carry hand nudges of a few pixels on the text column. The new layout replaces them, since position is now computed. Casino and Sweepstakes keep their old layout.

