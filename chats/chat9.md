# Qualifier text sizing

_Started 2026-10-14 15:47 UTC_

---

## User

for the qualifier text, its too small. it should scale based on the height of the block.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The qualifier text now has a minimum size of about 7% of the offer block's height. Before, it was only ever 0.28× the headline size, so it got tiny whenever a long headline shrank. It can never be larger than 0.6× the headline, and the existing fit check still shrinks everything if the block would overflow.

That 7% is my estimate. If it's still too small or now too big, tell me and I'll change the number.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

My first fix didn't change anything: the qualifier stayed the same size in all three templates. I've now made it bigger and tied it to the block's height:

- **Default size:** raised from 0.28× to 0.4× the headline.
- **Height-based minimum:** raised to 13% of the offer block's height, up from 7%. This keeps it readable when a long headline shrinks.
- **Cap:** still no more than 0.6× the headline.

It's being checked again now. I haven't yet confirmed it still fits without shrinking the headline too much, especially on the smaller templates.

## User

Found issues — fixing…

## Assistant

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The last change had missed two of the templates because they set their own qualifier sizes. All three now use 0.4× the headline size, plus the 13%-of-block-height minimum.

One thing still needs checking: the second template's text block was already nearly full. The automatic shrink-to-fit should stop it overflowing, but it may make the headline a bit smaller there. It's being re-checked now.

## User

The / no longer works for line break

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

My bigger qualifier caused this. The builder decides whether to put the two halves of "BET $5 / GET $150" on one line or two, and it was counting the qualifier's space when it did. The larger qualifier tipped that choice to one line. That choice now ignores the qualifier, so it works like it did before and "/" breaks the line again. I haven't seen the result on screen yet; it's being checked now.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

My last fix didn't work. Templates 1 and 2 still put "BET $5" and "GET $150" side by side whenever that fit almost as large as two lines. I've now turned off side-by-side for them, so "/" always breaks the line in all three templates. I also removed the earlier attempt.

This also removes the one-line version of those offers on the two templates that used it. It's being checked now.

## User

USE PROMO should be closer to the pill

## Assistant

_[tool: grep]_

_[tool: grep]_

Non-Covers templates use pillMT 28px; I'll tighten it for all.

_[tool: run_script]_

_[tool: ready_for_verification]_

I moved the "USE PROMO CODE" label closer to the pill in all templates. The gap was 26/16/18px on the three Covers templates and 28px on the others. It's now 14/8/10px and 12px. The file loads with no errors, but I didn't run the visual check on this change.

## User

I'm unhappy with how the offer text is being rendered and also how it is being implemented. It needs to be streamlined and easier to use. There are too many font sizes and sloppy line heights. This needs to be tidied up. I don't mind the offer presets, but they need to be cleaner and more precise to the Covers design system requirements. The workflow would be an editor will come use this tool to update a currently preset offer and download the assets. There is minimal room for design decision. This needs to be plug and play.

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: grep]_

_[tool: grep]_

_[tool: copy_files]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've rebuilt the offer text around one fixed type system and one simple form. I haven't seen it on screen yet; it's being checked now. The previous version is saved as `Promo Builder v1.dc.html`.

**Type rules (no manual sizing anywhere)**
- **Headline:** up to two lines, always the same size, tight line height.
- **Headline size:** each template has a fixed set of sizes (72–200px on Square). The tool uses the largest one that fits, so sizes stay consistent from one offer to the next instead of drifting.
- **Sub line:** exactly half the headline size, and can wrap to two lines at most.
- **Eyebrow:** the same size and font as "USE PROMO CODE:".
- **Spacing:** gaps between lines are fixed proportions of the headline size.

**Editor form**
- The four separate offer types and the "/" trick are gone. There are now four plain fields: Eyebrow, Headline line 1, Headline line 2, Sub line. A blank field is hidden.
- There are three format buttons (Bet & Get, Amount, Match) that fill in example copy. They overwrite whatever offer is in the fields.
- I rewrote the 10 brands with built-in offers (Kalshi, Polymarket, Underdog and others) into the new fields with the same copy. Brands without one keep whatever offer was last entered, as before.

Casino and Sweepstakes are unchanged.

To decide:
- I picked the fixed headline sizes and the ½ sub ratio myself from your reference ads, not from a written Covers spec. If you have exact sizes, I'll lock to them.
- I removed the hidden brand preset list (not shown anywhere in the tool). If you want brand presets in the form, I'll rebuild them using the new fields.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The check found a hierarchy problem on the Wide Banner: a two-line offer dropped to the same size as the promo code, so it no longer stood out. I've made three changes, and the new version is being re-checked now:

- **More room for the offer:** I removed a margin I had been subtracting from the offer area on the wide banners, and slightly reduced the logo area and the gaps between sections there.
- **One size set for both wide banners:** Wide Banner and Banner + App Screen export at the same size, so they now use the same headline sizes (64–160px). The same copy should render at the same size in both, unless the narrower text column on Banner + App Screen forces a step down.
- **Smaller jumps between sizes:** steps near the small end are now about 10% apart instead of 14%. Square also has finer steps (76–200px).

I haven't confirmed the actual size a two-line offer now gets on the Wide Banner.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The headline sizes now work as intended. On the Wide Banner the offer is clearly bigger than the promo code (98px vs 74px for Bet & Get), and both wide banners use the same headline sizes.

My previous change squeezed the space between the logo and the offer on the two wide banners, so "100% MATCH" nearly touched the BetMGM logo. I've widened that gap again, slightly more than it was originally, and it's being re-checked now.

The extra space may push a two-line offer down to a smaller headline size again. If it does, I'll take the room from below the offer instead, where there's about 75px spare above the "USE PROMO CODE:" label.

On Square the offer sits slightly closer to the logo than to the promo label. It's minor and I haven't changed it.

## User

for all 3 the promo code needs to be larger, especially the text inside the pill. Set a consistent and minimal space between the offer text and the promo code section. If there is a sub line, the space between the headline and sub line should be 75% Line height. The subline should only be one line max and if the text is longer, the sub line font size should scale to fit 100% of the container width. On the two 16:9 versions, the logo should scale down a bit to make more padding between the logo and text. On the 16:9 the text should maximize the usable space  width and height.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I've made all six changes on the three templates. I haven't seen the results on screen yet; a check is running now.

- **Promo code:** the pill is bigger on all three, and the code inside it is about 30% larger. The "USE PROMO CODE:" label is slightly larger too.
- **Offer to promo code gap:** now one fixed, small gap (3% of the graphic's height). The offer and promo code stay together as one block, centred between the logo and the fine print.
- **Headline to sub line:** the sub line sits at 75% line height directly under the headline. I read your "75% line height" as the sub line's own line height. If you meant 75% of the headline's line height, that's a much bigger gap, and I'll switch it.
- **Sub line:** always one line. Long text shrinks until it fits the full width.
- **16:9 logo:** about 20% smaller, with more space between the logo and the text.
- **16:9 headline size:** now as large as the available width and height allow, instead of jumping between fixed sizes. Square works the same way. This means headline sizes will differ from one offer to the next and between the two 16:9 versions.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

My last round had three bugs on the 16:9 versions, so I've fixed them; the new version is being checked again now.

- **Logo:** only the space around it had shrunk, so the logo itself spilled into the gap and nearly touched the headline. The logo itself is now smaller on both 16:9 versions (about 11% of the graphic's height, down from 14%).
- **Promo code vs headline:** the code text had become bigger than the headline. I've reduced the 16:9 code size slightly so the headline stays dominant. It's still larger than it was originally.
- **Square:** my change had also shrunk the Square logo area. That's back to how it was.

## User

Make the USE PROMO CODE Text smaller

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I made the "USE PROMO CODE:" label about 20% smaller on all three templates: 30px on Square (was 38), 21px on Wide Banner (was 26) and 20px on Banner + App Screen (was 24).

The eyebrow line above the headline is tied to this same size, so it shrinks too.

The page loads with no errors, but I skipped the visual check for this small change.

## User

The space between the promo text and the USE promo code needs to be smaller

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I cut the gap between the offer text and "USE PROMO CODE:" by more than half on all three templates. It's now about 1.2% of the graphic's height (was 3%), roughly 13px on Square and 9px on the 16:9 versions.

The page loads with no errors, but I skipped the full visual check for this small change. An automatic check flags "$1,500" and "FIRST BET OFFER" as overlapping by 10px. That comes from the tighter 75% line height on the sub line; an earlier full check found the letters don't actually collide.

## User

The sub line and Eyebrow should be the same formatting

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The eyebrow now uses exactly the same formatting as the sub line: the same bold font, half the headline size, one line that shrinks to fit the width, and 75% line height. It's no longer tied to the "USE PROMO CODE:" label size. A full check is running now.

None of the format buttons or built-in brand offers use an eyebrow, so you only see it when you fill in that field.

## User

Promo code text should be BLack weight

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The promo code inside the pill now uses Aeonik Fono Black on all three templates. I added the Black font file from your uploaded Aeonik Fono family to the project's fonts folder. The page loads with no errors, but I didn't run a full visual check for this small change.

The heavier weight is wider, so long codes may shrink a little more to fit the pill.

## User

All content should be centered vertically in the images. They currently start from the top. should start from the center and move up/down

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

The content on all three templates is now centred vertically as one block: logo, offer, promo code and fine print. Spare space is split equally above and below, so the block grows out from the middle as the text gets longer, and gaps inside it stay the same. A full check is running now.

The fine print moves up with the block when there's spare space, so it's no longer pinned to the bottom edge. If you'd rather keep it anchored there and centre only the logo, offer and promo code, tell me.

When the offer already fills the space, which is most offers on the 16:9 versions, you won't see a difference. The Covers logo at the bottom of the Square post stays where it was.

## User

Found issues — fixing…

## Assistant

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: ready_for_verification]_

The check saw the logo sitting on top of the headline. The layout itself was right; the logo's slide animation restarted on every update, so it was often caught mid-move. I removed that animation, so the logo now snaps straight to its centred position.

In my own screenshots, Square and Wide Banner now show logo, offer, promo code and fine print centred as one block with no overlap. A full check is running again, including Banner + App Screen, which I didn't look at myself.

