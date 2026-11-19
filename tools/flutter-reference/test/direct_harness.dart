import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

final catalogTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3C7B94)),
  useMaterial3: true,
  scaffoldBackgroundColor: const Color(0xFFE6E7E9),
);

/// Renders [child] at DPR 2 into out/<name>.png and dumps every text run
/// (rect relative to the widget's top-left, baseline) into out/<name>.json.
Future<void> shot(WidgetTester tester, String name, Widget child,
    {Color bg = Colors.white, double pad = 16, double? width, Future<void> Function()? act}) async {
  debugDisableShadows = false;
  tester.view.devicePixelRatio = 2;
  tester.view.physicalSize = const Size(2400, 4000);
  final key = GlobalKey();
  final inner = GlobalKey();
  await tester.pumpWidget(MaterialApp(
    theme: catalogTheme,
    debugShowCheckedModeBanner: false,
    home: Material(
      color: bg,
      child: Align(
        alignment: Alignment.topLeft,
        child: RepaintBoundary(
          key: key,
          child: Container(
            color: bg,
            padding: EdgeInsets.all(pad),
            child: SizedBox(key: inner, width: width, child: child),
          ),
        ),
      ),
    ),
  ));
  await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 200)));
  await tester.pumpAndSettle();
  if (act != null) {
    await act();
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 100)));
    await tester.pumpAndSettle();
  }
  final origin = tester.getTopLeft(find.byKey(inner));
  final texts = <Map<String, Object?>>[];
  void visit(RenderObject o) {
    if (o is RenderParagraph && o.hasSize) {
      final p = o.localToGlobal(Offset.zero) - origin;
      final s = o.text.style;
      final boxes = o.getBoxesForSelection(TextSelection(baseOffset: 0, extentOffset: o.text.toPlainText().length));
      final tl = boxes.isEmpty ? 0.0 : boxes.map((b) => b.left).reduce((a, b) => a < b ? a : b);
      final tr = boxes.isEmpty ? 0.0 : boxes.map((b) => b.right).reduce((a, b) => a > b ? a : b);
      double opacity = 1;
      texts.add({
        'text': o.text.toPlainText(),
        'x': p.dx + tl, 'y': p.dy, 'w': tr - tl, 'h': o.size.height, 'lines': boxes.map((b) => b.top).toSet().length,
        'baseline': p.dy + (o.computeDistanceToActualBaseline(TextBaseline.alphabetic) ?? 0),
        'size': s?.fontSize, 'weight': s?.fontWeight?.value, 'lh': s?.height, 'ls': s?.letterSpacing,
        'color': s?.color?.toARGB32().toRadixString(16), 'opacity': opacity,
      });
    }
    if (o is RenderEditable && o.hasSize) {
      final p = o.localToGlobal(Offset.zero) - origin;
      texts.add({'text': '[editable] ${o.text?.toPlainText()}', 'x': p.dx, 'y': p.dy, 'w': o.size.width, 'h': o.size.height, 'editable': true,
        'baseline': p.dy + (o.computeDistanceToActualBaseline(TextBaseline.alphabetic) ?? 0),
        'size': o.text?.style?.fontSize, 'weight': o.text?.style?.fontWeight?.value, 'lh': o.text?.style?.height});
    }
    if (o is RenderAnimatedOpacity && o.opacity.value == 0) return;
    if (o is RenderOpacity && o.opacity == 0) return;
    if (o is RenderOffstage && o.offstage) return;
    o.visitChildren(visit);
  }
  visit(tester.renderObject(find.byKey(inner)));
  final size = tester.getSize(find.byKey(inner));
  Directory('test/out').createSync(recursive: true);
  File('test/out/$name.json').writeAsStringSync(const JsonEncoder.withIndent(' ').convert({'w': size.width, 'h': size.height, 'pad': pad, 'texts': texts}));
  final boundary = tester.renderObject<RenderRepaintBoundary>(find.byKey(key));
  await tester.runAsync(() async {
    final image = await boundary.toImage(pixelRatio: 2);
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    File('test/out/$name.png').writeAsBytesSync(bytes!.buffer.asUint8List());
  });
  debugDisableShadows = true;
}
