import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart' show SIAvatar, SIAvatarType;

final catalogTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3C7B94)),
  useMaterial3: true,
  fontFamilyFallback: const ['Roboto'],
  scaffoldBackgroundColor: const Color(0xFFE6E7E9),
  appBarTheme: const AppBarTheme(backgroundColor: Color(0xFF3C7B94), foregroundColor: Colors.white, elevation: 0),
);

const double kPad = 16;

/// Pumps a catalog [screen] on a 393 x 852 phone, optionally [act]s on it, then writes
/// out/<name>.png (crop of [target] + kPad, 2x) and out/<name>.json (text runs relative to target).
Future<void> screen(WidgetTester tester, String name, Widget screen, Finder Function() target,
    {Future<void> Function()? act, Size size = const Size(393, 852)}) async {
  debugDisableShadows = false;
  tester.view.devicePixelRatio = 2;
  tester.view.physicalSize = size * 2;
  final key = GlobalKey();
  await tester.pumpWidget(RepaintBoundary(
    key: key,
    child: MaterialApp(theme: catalogTheme, debugShowCheckedModeBanner: false, home: screen),
  ));
  Future<void> settle() async {
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
    // Asset images decode on a real async gap: without this a photo stays empty in the test.
    await tester.pump();
    await tester.runAsync(() async {
      for (final e in find.byType(Image).evaluate().toList()) {
        await precacheImage((e.widget as Image).image, e, onError: (_, __) {});
      }
    });
    try {
      await tester.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 3));
    } catch (_) {
      await tester.pump(const Duration(milliseconds: 500)); // endless animation (loading bar)
    }
  }
  await settle();
  if (act != null) {
    await act();
    await settle();
    // Tapping a control scrolls it into view and can leave the preview under the catalog's
    // app bar: back to the top before measuring.
    var moved = false;
    for (final s in tester.stateList<ScrollableState>(find.byType(Scrollable))) {
      if (s.position.axis == Axis.vertical && s.position.pixels != 0) {
        s.position.jumpTo(0);
        moved = true;
      }
    }
    if (moved) await settle();
  }
  final f = target();
  final rect = tester.getRect(f.first);
  final origin = rect.topLeft;
  final texts = <Map<String, Object?>>[];
  void visit(RenderObject o) {
    if (o is RenderAnimatedOpacity && o.opacity.value == 0) return;
    if (o is RenderOpacity && o.opacity == 0) return;
    if (o is RenderOffstage && o.offstage) return;
    if (o is RenderParagraph && o.hasSize) {
      final p = o.localToGlobal(Offset.zero) - origin;
      final s = o.text.style;
      final plain = o.text.toPlainText();
      // Word by word: a box over the whole text also covers the space a line was broken at,
      // which a browser range does not (the widest line came out one space wider).
      final boxes = [
        for (final m in RegExp(r'\S+').allMatches(plain))
          ...o.getBoxesForSelection(TextSelection(baseOffset: m.start, extentOffset: m.end)),
      ];
      final tl = boxes.isEmpty ? 0.0 : boxes.map((b) => b.left).reduce((a, b) => a < b ? a : b);
      final tr = boxes.isEmpty ? 0.0 : boxes.map((b) => b.right).reduce((a, b) => a > b ? a : b);
      texts.add({
        'text': plain, 'x': p.dx + tl, 'y': p.dy, 'w': tr - tl, 'h': o.size.height,
        'lines': (boxes.map((b) => b.top).toList()..sort()).fold<List<double>>([], (a, t) => a.isEmpty || t - a.last > (s?.fontSize ?? 14) * 0.6 ? (a..add(t)) : a).length,
        'baseline': p.dy + (o.computeDistanceToActualBaseline(TextBaseline.alphabetic) ?? 0),
        'size': s?.fontSize, 'weight': s?.fontWeight?.value, 'lh': s?.height, 'ls': s?.letterSpacing,
        'color': s?.color?.toARGB32().toRadixString(16),
        'strut': o.strutStyle == null ? null : '${o.strutStyle!.fontFamily} w${o.strutStyle!.fontWeight?.value} force=${o.strutStyle!.forceStrutHeight}',
        'dist': s?.leadingDistribution?.name, 'fallback': s?.fontFamilyFallback,
      });
    }
    if (o is RenderEditable && o.hasSize) {
      final p = o.localToGlobal(Offset.zero) - origin;
      final s = o.text?.style;
      texts.add({
        'text': o.text?.toPlainText() ?? '', 'x': p.dx, 'y': p.dy, 'w': o.size.width, 'h': o.size.height, 'editable': true,
        'baseline': p.dy + (o.computeDistanceToActualBaseline(TextBaseline.alphabetic) ?? 0),
        'size': s?.fontSize, 'weight': s?.fontWeight?.value, 'lh': s?.height, 'ls': s?.letterSpacing,
        'color': s?.color?.toARGB32().toRadixString(16),
      });
    }
    o.visitChildren(visit);
  }
  visit(tester.renderObject(f.first));
  // SIAvatar paints its initials with a TextPainter: no RenderParagraph, so no text run above.
  // Reported as 'painted' with the circle's box; inkruns.py compares the pixels.
  for (final e in find.descendant(of: f.first, matching: find.byType(SIAvatar), matchRoot: true).evaluate()) {
    final a = e.widget as SIAvatar;
    final box = e.renderObject;
    if (a.type == SIAvatarType.photo || (a.initials ?? '').isEmpty || box is! RenderBox) continue;
    final p = box.localToGlobal(Offset.zero) - origin;
    texts.add({'text': a.initials, 'x': p.dx, 'y': p.dy, 'w': box.size.width, 'h': box.size.height, 'painted': true});
  }
  Directory('test/out').createSync(recursive: true);
  File('test/out/$name.json').writeAsStringSync(const JsonEncoder.withIndent(' ').convert({
    'w': rect.width, 'h': rect.height, 'pad': kPad, 'x': rect.left, 'y': rect.top, 'texts': texts,
  }));
  final boundary = tester.renderObject<RenderRepaintBoundary>(find.byKey(key));
  await tester.runAsync(() async {
    final image = await boundary.toImage(pixelRatio: 2);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    File('test/out/$name.full.png').writeAsBytesSync(bytes!.buffer.asUint8List());
  });
  debugDisableShadows = true;
}
