# Flutter reference renders for Gradniki - mobile

Numeric comparison of the Storybook twins with the **real Flutter catalog**
(`components/flutter/catalog_app`), rendered headless with `flutter test`.
The components repo is only read; everything is written to the work dir
(`.flutter-ref/`, git-ignored).

## Setup (once, or after the mobile library changes)

    bash tools/flutter-reference/setup.sh      # needs flutter, python + fontTools + Pillow

## Render the references

    cd .flutter-ref/cat
    flutter test test/all_test.dart            # default state of every configurator
    flutter test test/man_test.dart            # multi-step / conditional variants
    flutter test test/input_test.dart          # Vnosno polje: label position x style x state
    python ../genvars.py && flutter test test/var_test.dart   # one render per catalog control
                                               # (needs ../argtypes.json: node ../argtypes.mjs)

Each case writes `test/out/<name>.json` (size + every text run: x, baseline, width,
font, strut, leading distribution) and `test/out/<name>.full.png` (2x).

## Compare a twin (Storybook must run on :6006)

    cd .flutter-ref
    node compare.mjs <name> <storyId> <rootSelector> ["arg:value;arg2:!true"] [clickSelector]
    python imgdiff.py <name>                   # flutter | twin | diff  ->  <name>.cmp.png
    python inkbox.py <name> x0 y0 x1 y1        # ink bounding box of icons etc. in both
    python refdump.py <name>                   # reference numbers

## Full pass: four checks per case

    cd .flutter-ref
    bash fullpass.sh map.txt full_map.txt       # default state of every widget
    bash fullpass.sh manmap.txt full_man.txt    # multi-step / conditional variants
    bash fullpass.sh inputmap.txt full_input.txt
    bash fullpass.sh varmap.txt full_var.txt    # one case per catalog control (genvars.py)

`map.txt`, `manmap.txt`, `inputmap.txt` and the generated `varmap.txt` list
`name|storyId|selector|args`. For every case `fullpass.sh` runs:

1. `compare.mjs` - **layout**: size of the widget and x / baseline / width / font of every
   text run (0.6px).
2. `inkruns.py` - **rendered pixels**: the ink bounding box of every text run in both images.
   Layout numbers do not show what the rasteriser does: Chromium snaps a line that starts on
   a fraction of a pixel, `text-box-trim` rounds, a parent clips descenders. Images are 2x, so
   edges are quantised to 0.5px and a run is flagged from 1px. Flutter and Chromium snap glyphs
   to pixels independently: +-0.5px here is not a difference, 1px is.
3. `flatdiff.py` - **fills**: the colour of every flat area. `imgdiff.py` counts only strong
   differences, so a white fill against the light grey catalog canvas passes it (outlined
   Filter chip, outlined Iskalno polje) and is invisible on Storybook's own white page.

4. `shapediff.py` - **icons, strokes, shapes**: what is neither a text run nor a flat fill.
   Both renders are blurred by 1 CSS px and subtracted (text runs left out): a shape half a
   pixel off passes, one pixel off does not. Self-test: `SHIFT=2 python shapediff.py <name>`
   moves the twin by one CSS px and must report it. This is the check that sees an icon in the
   wrong place (the search icon next to the avatar), a missing corner radius (the flag) or a
   1.8px line drawn as 1px.

`inkruns.py` drops ink that reaches the edge of a run's box: a white digit in a coloured badge on
a white chip has its own colour all around the badge, and the whole box counted as ink (the
Filter badge passed while the digit sat 1px too high).

A pass is clean when every case prints `ALL TEXT RUNS MATCH`, `INK OK`, `FLAT OK` and `SHAPE OK`
(`grep -c` them in the output file). Not comparable: `loading-bar__indeterminate-true` (the
indicator loops, the two renders are different moments).

Text on a filled shape (badge, selected day, avatar) is centred on the shape, not on the page:
`python blob.py <name> <hexcolor> [text]` prints the shape's box and the gaps between the ink and
its edges in both renders, `python painted.py <name>` does the same for every `SIAvatar`.

Helpers for a finding:
`python cropcmp.py out.png <name> x0 y0 x1 y1 [zoom]` (flutter | twin crop),
`node inkprobe.mjs <storyId> "<args>" <rootSel> <textSel> <fracY> "<css>" ...` (where
Chromium really draws a text for a set of css overrides).

What the harness and compare do so that the two renders are comparable:
- The twin is moved onto the same pixel fraction as the Flutter widget (a centred story sits
  on half pixels).
- Android system font: Roboto (from the Flutter SDK cache) is the theme's
  `fontFamilyFallback` and is also registered under the font family that does not resolve in
  the library (`TokenTabsV2.labelStrut` gets a doubled package prefix). A device uses the
  system font in both places: the ellipsis of a Medium label (Republika Medium has no U+2026)
  and the Zavihki strut. Without it the test draws a box / uses the 0.75/0.25 test font.
- Text runs are measured word by word (a box over the whole text includes the space a line
  was broken at); SIAvatar initials (TextPainter, no RenderParagraph) are reported as
  `painted` and checked by pixels; an ellipsised twin label carries the full string in
  `data-text`.
- After a control is tapped the catalog page is scrolled back to the top (otherwise the app
  bar covers part of the preview in the image).
- `genvars.py`: `SKIP` (controls that exist only in another mode - covered by `manmap.txt`),
  `LINKED` (values the catalog changes together with a control), `SELECTOR`.

## Controls and interactions (what a user does, not what a URL sets)

The checks above load every case with its args in the URL, before the story mounts. A twin
that only seeded its state from a prop looked right there and did nothing when the control
was changed in the panel. Run these too:

    flutter test test/controls_test.dart        # the catalog's controls panel: by default, one and
                                                # two steps from it, after a tap on the preview
    node controls.mjs [widget ...]              # the same steps in Storybook's Controls panel:
                                                # PANEL (labels, order, options, values, visibility)
                                                # and STALE (preview after the steps = fresh load)
    AFTER_MOUNT=1 bash fullpass.sh <map> <out>  # every case with its args set after mount
    flutter test test/interact_test.dart        # states reached by using the preview
    bash fullpass.sh interactmap.txt <out>      # the same steps on the twin

`interactmap.txt` lines carry the twin's steps in the 5th field (`compare.mjs`): `click:`,
`click?:` (only if there), `press:` (held while measuring), `keys:` (typed into the focused
field), `type:`, `drag:<sel>@fx,fy>fx2,fy2`, `scroll:`, `args:` (a control changed), `wait:`.
The Flutter side clicks text fields with a mouse (a finger also gets selection handles) and taps
bar chips without `ensureVisible` (it scrolls a horizontal bar).

The stories outside Gradniki - mobile have no catalog to compare with: `node webcontrols.mjs
[id-part ...]` sets every control of every story to each of its other values in the panel and
requires the preview to equal a fresh load with the same args (STALE otherwise). Each story gets a
new browser context: the manager keeps UI state in localStorage, and a state left by one story made
every click of the next one time out. Run it in a few batches (`gradniki-header`, `gradniki-search`,
...) in parallel; one change takes about 5 s.

## Review by eye

    python report.py <out_dir> <android pass.out> [<ios pass.out> <ios work dir>]
                                                # local gallery: Flutter | twin | difference (x6) for
                                                # every case, with the four checks, Android and iOS
    node variants.mjs <shots_dir>               # a shot of every Gradniki - mobile "Vse različice"
    python variants.py <shots_dir> <out_dir>    # ... next to its design_data PNG (Figma, 3x -> 1x)

`report.py` runs in the work dir after `fullpass.sh`; where the Flutter crop reaches past the
screen edge (a full-width widget at x = 0) it shows the twin's pixels instead of black. The design
data PNGs are Figma exports: texts, the iOS home indicator, the divider above Drsnik and similar
differ from the library on purpose - the Flutter render is the reference, the PNG only shows that
no variant is missing or drawn in a different style.

Also in every pass: `inkruns.py` compares the colour of each run's ink core (opacity, wrong
colour); the browser runs with `--disable-lcd-text` (grayscale text, as a phone - Windows' LCD
anti-aliasing tints cores up to #1f); `carets.py` leaves the caret of a focused field out (the
harness records it; compare.mjs hides the twin's). `fullpass.sh` reports a case without a
reference or a failed compare instead of passing it.

## iOS branches

`Platform.isIOS` is false under `flutter test`. `IOS=1 bash tools/flutter-reference/setup.sh`
also creates `.flutter-ref/ios/` with scratch copies of the library and the catalog in which
`Platform.isIOS` is replaced by `true`, and a harness that sets
`debugDefaultTargetPlatformOverride = TargetPlatform.iOS`. Same tests, same scripts:

    cd .flutter-ref/ios/cat && flutter test test/all_test.dart     # + var / man / input
    flutter test test/ios_input_floating_test.dart                 # iOS default is "Nad poljem"
    cd .. && FLUTTER_REF_WORK=$PWD node compare.mjs <name> <storyId> <sel> "platform:ios;..."

Full pass for iOS (maps with `platform:ios`, written by `iosmaps.py`):

    cd .flutter-ref && node argtypes.mjs && python genvars.py && python iosmaps.py
    cd ios && FLUTTER_REF_WORK=$PWD bash fullpass.sh map.txt full_map.txt     # + manmap / inputmap / varmap

Deliberately not mirrored: the Filter badge digit offset on iOS (`badgeDigitOffsetYIOS`
compensates CoreText, the visible result equals Android).

## Directly pumped widgets

`test/direct_*_test.dart` (with `direct_harness.dart`, `shot()`) pump a library widget
without a configurator: fixed dates for Koledar, SIDatePickerIOS year / month views.
`phone_open_test.dart` taps the catalog preview (open country list).
`direct_search_test.dart`: expanded Iskalno polje in all three styles, also without a query.
`node rect.mjs <storyId> "<args>" <selector>...` prints twin bounding boxes.

## Figma export audit

`design_data/figma_json_export.txt` holds the Figma `cssProps` per section. From the work dir:

    python figaudit.py            # -> fig/sections.json (all 30 sections, normalised)
    node figaudit.mjs [section]   # Figma values with no counterpart in the twin's computed styles

The list is a triage aid, not a verdict: twins use margins / inset shadows / `<img>` icons where
Figma has padding / gap / strokes / vectors, and the library deliberately differs from Figma in
places (letter-spacing inherited from Material 3, disabled colours, no divider above Drsnik ...).
Check each remaining value against the Flutter tokens; the Flutter render wins.

## Known artefacts of the test environment

- `Platform.isIOS` is false: the plain work dir renders only the Android / default
  branches (see "iOS branches").
- `imgdiff.py` crops are rounded to whole pixels; a uniform 0.5px shift of everything is
  the crop, the text-run numbers are authoritative.
- Images: the harness precaches every `Image` in a real async gap, so the Avatar photo is drawn.
  The Kartica media in the catalog is a flat #F5F5F5 placeholder; the twin shows the same in
  Privzeto and the Figma sample image only in "Vse različice" (`sampleMedia`).
- iOS work dir: the system font is Roboto there too (SF is not available to the test), so the
  ellipsis of a Medium label and the Zavihki strut are the Android ones.
- `filter__bar-multirow`: SIFilterBar (a Wrap) is as wide as its widest row, the twin's bar is
  a 360 block. Nothing is drawn on that box, the chips match.
