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
cp "$HERE"/*.py "$HERE"/*.mjs "$HERE"/*.txt "$WORK/"
(cd "$WORK/cat" && flutter pub get)
echo "Ready: cd $WORK/cat && flutter test test/all_test.dart   (renders into test/out)"
