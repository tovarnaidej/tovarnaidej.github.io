import 'dart:async';
import 'dart:io';
import 'package:flutter/services.dart';

Future<void> testExecutable(FutureOr<void> Function() testMain) async {
  for (final family in ['Republika', 'packages/si_component_library/Republika']) {
    final loader = FontLoader(family);
    for (final weight in ['regular', 'medium', 'bold']) {
      final bytes = File('fonts/republika-$weight-webfont.ttf').readAsBytesSync();
      loader.addFont(Future.value(ByteData.sublistView(bytes)));
    }
    await loader.load();
  }
  final material = '${Platform.environment['FLUTTER_ROOT']}/bin/cache/artifacts/material_fonts';
  ByteData font(String file) => ByteData.sublistView(File('$material/$file').readAsBytesSync());
  final icons = FontLoader('MaterialIcons');
  icons.addFont(Future.value(font('MaterialIcons-Regular.otf')));
  await icons.load();
  // Android system font. A device falls back to it (a) for glyphs Republika lacks (Medium has
  // no ellipsis) - the harness theme lists 'Roboto' as fontFamilyFallback (library styles
  // inherit it with their package prefix) - and (b) for a font
  // family that does not resolve: TokenTabsV2.labelStrut ends up with a doubled package prefix.
  // Without this the test would use the 0.75/0.25 test font there.
  // The catalog's own texts use the theme font: Roboto on Android, the system font on iOS
  // (CupertinoSystemText / Display in Typography). No SF Pro in a test: Roboto for both, as the twin.
  for (final family in ['Roboto', 'packages/si_component_library/Roboto', 'packages/si_component_library/packages/si_component_library/Republika', 'CupertinoSystemText', 'CupertinoSystemDisplay']) {
    final roboto = FontLoader(family);
    for (final file in ['Roboto-Regular.ttf', 'Roboto-Medium.ttf', 'Roboto-Bold.ttf']) {
      roboto.addFont(Future.value(font(file)));
    }
    await roboto.load();
  }
  await testMain();
}
