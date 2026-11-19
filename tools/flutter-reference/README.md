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

## Known artefacts of the test environment

- `Platform.isIOS` is false: only the Android / default branches render. iOS-only
  widgets with their own class (SIDatePickerIOS, SIDatePicker with a fixed date) can be
  pumped directly in a small extra test with the same harness idea.
- Zavihki: `TokenTabsV2.labelStrut` resolves to a doubled package font family, so the
  strut falls back to the platform font; in the test that is the 0.75/0.25 test font
  (labels ~1px higher than on a device). Ignore `dbl +0.75 / +0.92` there.
- Multi-line text: Flutter's boxes include the trailing space of wrapped lines (`dw -3…-4`).
- Catalog image assets and photo avatars are not loaded.
- `ensureVisible` may scroll the page; the crop in `*.full.png` is then off, the JSON is right.
