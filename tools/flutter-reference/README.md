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

`map.txt` / `manmap.txt` list `name|storyId|selector|args` used for the last full pass.

## iOS branches

`Platform.isIOS` is false under `flutter test`. `IOS=1 bash tools/flutter-reference/setup.sh`
also creates `.flutter-ref/ios/` with scratch copies of the library and the catalog in which
`Platform.isIOS` is replaced by `true`, and a harness that sets
`debugDefaultTargetPlatformOverride = TargetPlatform.iOS`. Same tests, same scripts:

    cd .flutter-ref/ios/cat && flutter test test/all_test.dart     # + var / man / input
    flutter test test/ios_input_floating_test.dart                 # iOS default is "Nad poljem"
    cd .. && FLUTTER_REF_WORK=$PWD node compare.mjs <name> <storyId> <sel> "platform:ios;..."

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
- Zavihki: `TokenTabsV2.labelStrut` resolves to a doubled package font family, so the
  strut falls back to the platform font; in the test that is the 0.75/0.25 test font.
  On a device it is Roboto (0.79) / SF (0.80): baseline 16.6 / 16.8 vs the twin's 16.5,
  so ignore `dbl +0.75 / +0.92` there.
- Republika Medium has no ellipsis glyph: devices draw it from the system font, the test
  draws nothing (a clipped selected tab label without the ellipsis is this artefact, not a
  library bug).
- `imgdiff.py` crops are rounded to whole pixels; a uniform 0.5px shift of everything is
  the crop, the text-run numbers are authoritative.
- Multi-line text: Flutter's boxes include the trailing space of wrapped lines (`dw -3…-4`).
- Images: the harness precaches every `Image` in a real async gap, so the Avatar photo is drawn.
  The Kartica media in the catalog is a flat #F5F5F5 placeholder (the twin shows the Figma sample image).
- `ensureVisible` may scroll the page; the crop in `*.full.png` is then off, the JSON is right.
