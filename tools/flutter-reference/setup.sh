#!/usr/bin/env bash
# Creates the work dir with a scratch copy of the Flutter catalog app that renders the
# real configurator screens (components repo stays read-only).
#   COMPONENTS=/d/projekti_tovarna/components WORK=/d/projekti_tovarna/mslovenija_web/.flutter-ref bash setup.sh
set -euo pipefail
COMPONENTS="${COMPONENTS:-/d/projekti_tovarna/components}"
WORK="${WORK:-$(cd "$(dirname "$0")/../.." && pwd)/.flutter-ref}"
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$WORK/cat/test" "$WORK/cat/fonts"
cp -r "$COMPONENTS/flutter/catalog_app/lib" "$COMPONENTS/flutter/catalog_app/assets" "$COMPONENTS/flutter/catalog_app/pubspec.yaml" "$WORK/cat/"
WINCOMP="$(cygpath -m "$COMPONENTS" 2>/dev/null || echo "$COMPONENTS")"
sed -i "s#path: ../#path: $WINCOMP/flutter#" "$WORK/cat/pubspec.yaml"
# Preview gets a key so tests can find it.
sed -i "s#child: preview,#child: KeyedSubtree(key: const Key('PREVIEW'), child: preview),#" "$WORK/cat/lib/widgets/component_configurator.dart"
cp "$COMPONENTS/flutter/fonts/republika-regular-webfont.ttf" "$COMPONENTS/flutter/fonts/republika-bold-webfont.ttf" "$WORK/cat/fonts/"
# Windows (DirectWrite) uses OS/2 win metrics; devices use hhea (750 / -250) for Medium.
python - "$COMPONENTS/flutter/fonts/republika-medium-webfont.ttf" "$WORK/cat/fonts/republika-medium-webfont.ttf" <<'PY'
import sys
from fontTools.ttLib import TTFont
f = TTFont(sys.argv[1]); f['OS/2'].usWinAscent = 750; f['OS/2'].usWinDescent = 250; f.save(sys.argv[2])
PY
cp "$HERE"/test/*.dart "$WORK/cat/test/"
cp "$HERE"/*.py "$HERE"/*.mjs "$HERE"/*.txt "$HERE"/*.sh "$WORK/"
(cd "$WORK/cat" && flutter pub get)

# iOS branches: `Platform.isIOS` cannot be overridden in tests, so IOS=1 also builds
# $WORK/ios with scratch copies of the library and the catalog where it is constant true
# and the harness runs with debugDefaultTargetPlatformOverride = iOS.
if [ "${IOS:-0}" = "1" ]; then
  rm -rf "$WORK/ios"; mkdir -p "$WORK/ios/lib_ios" "$WORK/ios/cat/test"
  cp -r "$COMPONENTS/flutter/lib" "$COMPONENTS/flutter/fonts" "$COMPONENTS/flutter/icons" "$COMPONENTS/flutter/assets" "$COMPONENTS/flutter/pubspec.yaml" "$WORK/ios/lib_ios/"
  cp -r "$WORK/cat/lib" "$WORK/cat/assets" "$WORK/cat/fonts" "$WORK/cat/pubspec.yaml" "$WORK/ios/cat/"
  cp "$WORK/cat/test/"*.dart "$WORK/ios/cat/test/"
  WINWORK="$(cygpath -m "$WORK" 2>/dev/null || echo "$WORK")"
  sed -i "s#path: .*#path: $WINWORK/ios/lib_ios#" "$WORK/ios/cat/pubspec.yaml"
  grep -rl "Platform\.is" "$WORK/ios/lib_ios/lib" "$WORK/ios/cat/lib" | xargs sed -i -E 's/\bPlatform\.isIOS\b/true/g; s/\bPlatform\.isMacOS\b/false/g; s/\bPlatform\.isAndroid\b/false/g'
  python - "$WORK/ios/cat/test/harness.dart" <<'PYIOS'
import sys
p = sys.argv[1]; s = open(p, encoding='utf8').read()
s = s.replace("import 'package:flutter/material.dart';", "import 'package:flutter/foundation.dart';\nimport 'package:flutter/material.dart';", 1)
s = s.replace("  debugDisableShadows = false;\n", "  debugDisableShadows = false;\n  debugDefaultTargetPlatformOverride = TargetPlatform.iOS;\n", 1)
s = s.replace("  debugDisableShadows = true;\n}", "  debugDisableShadows = true;\n  debugDefaultTargetPlatformOverride = null;\n}")
open(p, 'w', encoding='utf8').write(s)
PYIOS
  cp "$HERE"/*.py "$HERE"/*.mjs "$HERE"/*.txt "$HERE"/fullpass.sh "$WORK/ios/"
  (cd "$WORK/ios/cat" && flutter pub get)
  echo "Ready (iOS): cd $WORK/ios/cat && flutter test test/all_test.dart ; compare with FLUTTER_REF_WORK=$WORK/ios and platform:ios"
fi
echo "Ready: cd $WORK/cat && flutter test test/all_test.dart   (renders into test/out)"
