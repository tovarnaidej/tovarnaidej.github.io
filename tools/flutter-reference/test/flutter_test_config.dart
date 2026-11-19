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
  final icons = FontLoader('MaterialIcons');
  icons.addFont(Future.value(ByteData.sublistView(File('${Platform.environment['FLUTTER_ROOT']}/bin/cache/artifacts/material_fonts/MaterialIcons-Regular.otf').readAsBytesSync())));
  await icons.load();
  await testMain();
}
