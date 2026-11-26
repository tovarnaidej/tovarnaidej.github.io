// The catalog's controls panel as a user sees it, for every configurator: the default state,
// one step from it (each switch, each chip, each button, slider to min / max, a text emptied,
// a tap on the preview) and a second step for controls that only appear after the first.
// Writes test/out/controls/<name>.json; controls.mjs replays the same steps in Storybook's
// Controls panel and compares the panel and the preview.
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'package:catalog_app/widgets/config_controls.dart';
import 'package:catalog_app/screens/accordion_configurator.dart';
import 'package:catalog_app/screens/action_configurator.dart';
import 'package:catalog_app/screens/alert_configurator.dart';
import 'package:catalog_app/screens/app_bar_configurator.dart';
import 'package:catalog_app/screens/avatar_configurator.dart';
import 'package:catalog_app/screens/button_configurator.dart';
import 'package:catalog_app/screens/calendar_configurator.dart';
import 'package:catalog_app/screens/calendar_input_configurator.dart';
import 'package:catalog_app/screens/card_configurator.dart';
import 'package:catalog_app/screens/checkbox_configurator.dart';
import 'package:catalog_app/screens/divider_configurator.dart';
import 'package:catalog_app/screens/filter_configurator.dart';
import 'package:catalog_app/screens/input_configurator.dart';
import 'package:catalog_app/screens/loading_bar_configurator.dart';
import 'package:catalog_app/screens/pass_login_preview.dart';
import 'package:catalog_app/screens/phone_input_configurator.dart';
import 'package:catalog_app/screens/popup_configurator.dart';
import 'package:catalog_app/screens/progress_bar_configurator.dart';
import 'package:catalog_app/screens/radio_configurator.dart';
import 'package:catalog_app/screens/range_bar_configurator.dart';
import 'package:catalog_app/screens/search_bar_configurator.dart';
import 'package:catalog_app/screens/status_screen_configurator.dart';
import 'package:catalog_app/screens/switch_configurator.dart';
import 'package:catalog_app/screens/tab_bar_configurator.dart';
import 'package:catalog_app/screens/tabs_configurator.dart';
import 'harness.dart' show catalogTheme;

final screens = <String, Widget Function()>{
  'accordion': () => const AccordionConfigurator(),
  'action': () => const ActionConfigurator(),
  'alert': () => const AlertConfigurator(),
  'app-bar': () => const AppBarConfigurator(),
  'avatar': () => const AvatarConfigurator(),
  'button': () => const ButtonConfigurator(),
  'calendar': () => const CalendarConfigurator(),
  'calendar-input': () => const CalendarInputConfigurator(),
  'card': () => const CardConfigurator(),
  'checkbox': () => const CheckboxConfigurator(),
  'divider': () => const DividerConfigurator(),
  'filter': () => const FilterConfigurator(),
  'input': () => const InputConfigurator(),
  'loading-bar': () => const LoadingBarConfigurator(),
  'pass-login': () => const PassLoginPreview(),
  'phone-input': () => const PhoneInputConfigurator(),
  'popup': () => const PopupConfigurator(),
  'progress-bar': () => const ProgressBarConfigurator(),
  'radio': () => const RadioConfigurator(),
  'range-bar': () => const RangeBarConfigurator(),
  'search-bar': () => const SearchBarConfigurator(),
  'status-screen': () => const StatusScreenConfigurator(),
  'switch': () => const SwitchConfigurator(),
  'tab-bar': () => const TabBarConfigurator(),
  'tabs': () => const TabsConfigurator(),
};

/// Where a tap on the preview lands, as a fraction of the preview's first widget
/// (the middle unless the widget does something else there).
const previewTap = <String, Offset>{'range-bar': Offset(0.8, 0.5)};

/// Steps that break the catalog itself (not copied to the twins): an empty title on the
/// small app bar (`title!`), a button without label and icon (assert).
const skip = <String, Set<String>>{
  'app-bar': {'text:Naslov='},
  'button': {'text:Oznaka='},
};

late WidgetTester T;

Future<void> settle() async {
  await T.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 100)));
  try {
    await T.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 3));
  } catch (_) {
    await T.pump(const Duration(milliseconds: 500)); // endless animation (loading bar)
  }
}

Future<void> pumpScreen(Widget screen) async {
  T.view.devicePixelRatio = 2;
  T.view.physicalSize = const Size(393, 852) * 2;
  await T.pumpWidget(const SizedBox()); // fresh state for every path
  await T.pumpWidget(MaterialApp(theme: catalogTheme, debugShowCheckedModeBanner: false, home: screen));
  await settle();
}

final _preview = find.byKey(const Key('PREVIEW'));

bool _under(Element e, bool Function(Widget) test) {
  var found = false;
  e.visitAncestorElements((a) {
    if (test(a.widget)) {
      found = true;
      return false;
    }
    return true;
  });
  return found;
}

bool _inPreview(Element e) {
  final roots = _preview.evaluate().toSet();
  var inside = false;
  e.visitAncestorElements((a) {
    if (roots.contains(a)) {
      inside = true;
      return false;
    }
    return true;
  });
  return inside;
}

bool _hidden(Element e) => _under(e, (w) =>
    (w is Opacity && w.opacity == 0) || (w is AnimatedOpacity && w.opacity == 0) ||
    (w is Offstage && w.offstage) || (w is Visibility && !w.visible) || (w is IgnorePointer && w.ignoring && false));

List<String> _texts(Element e) => find
    .descendant(of: find.byElementPredicate((x) => x == e), matching: find.byType(Text))
    .evaluate()
    .map((t) => (t.widget as Text).data ?? (t.widget as Text).textSpan?.toPlainText() ?? '')
    .toList();

bool _isControl(Widget w) =>
    w is EnumControl || w is BoolControl || w is TextControl || w is Slider || w is TextButton || w is SIInput || w is SIButton || w is Text;

/// Controls in screen order (top to bottom, left to right). Plain texts are reported too
/// (headings such as 'Vrednost 50%'); texts inside a control belong to that control.
List<Map<String, Object?>> dump() {
  final items = <(Offset, Map<String, Object?>)>[];
  for (final e in find.byWidgetPredicate(_isControl, skipOffstage: false).evaluate()) {
    final w = e.widget;
    if (_inPreview(e)) continue;
    if (_under(e, (a) => a is AppBar)) continue;
    final inControl = _under(e, (a) => a is EnumControl || a is BoolControl || a is TextControl || a is TextButton || a is SIButton || a is SIInput);
    if (inControl) continue;
    final ro = e.renderObject;
    if (ro is! RenderBox || !ro.attached || !ro.hasSize) continue;
    final at = ro.localToGlobal(Offset.zero);
    final m = <String, Object?>{'y': at.dy, 'x': at.dx};
    if (_hidden(e)) m['hidden'] = true;
    final d = w as dynamic;
    if (w is EnumControl) {
      final chips = _texts(e).skip(1).toList();
      final values = d.values as List;
      m.addAll({'type': 'enum', 'label': w.label, 'options': chips, 'value': chips[values.indexOf(d.value)]});
    } else if (w is BoolControl) {
      m.addAll({'type': 'bool', 'label': w.label, 'value': w.value});
    } else if (w is TextControl) {
      m.addAll({'type': 'text', 'label': w.label, 'value': w.value, if (w.multiline) 'multiline': true});
    } else if (w is SIInput) {
      m.addAll({'type': 'text', 'label': w.label, 'value': w.value, 'enabled': w.enabled});
    } else if (w is Slider) {
      m.addAll({'type': 'slider', 'value': w.value, 'min': w.min, 'max': w.max, 'divisions': w.divisions, 'enabled': w.onChanged != null});
    } else if (w is TextButton || w is SIButton) {
      final label = w is SIButton ? (w.label ?? '') : _texts(e).join(' ');
      m.addAll({'type': 'button', 'label': label, 'enabled': w is SIButton ? w.onPressed != null : (w as TextButton).onPressed != null});
    } else if (w is Text) {
      final s = w.data ?? w.textSpan?.toPlainText() ?? '';
      if (s.trim().isEmpty) continue;
      m.addAll({'type': 'label', 'text': s});
    }
    items.add((at, m));
  }
  items.sort((a, b) => (a.$1.dy - b.$1.dy).abs() > 2 ? a.$1.dy.compareTo(b.$1.dy) : a.$1.dx.compareTo(b.$1.dx));
  return [for (final i in items) i.$2];
}

/// Every action a user can take on the panel in its current state.
List<String> actions(List<Map<String, Object?>> controls) {
  final out = <String>[];
  for (final c in controls) {
    if (c['hidden'] == true) continue;
    switch (c['type']) {
      case 'bool':
        out.add('bool:${c['label']}');
      case 'enum':
        for (final o in c['options'] as List) {
          if (o != c['value']) out.add('enum:${c['label']}=$o');
        }
      case 'button':
        if (c['enabled'] == true) out.add('button:${c['label']}');
      case 'slider':
        if (c['enabled'] == true) {
          if (c['value'] != c['min']) out.add('slider:${c['y']}=min');
          if (c['value'] != c['max']) out.add('slider:${c['y']}=max');
        }
      case 'text':
        if ((c['value'] as String).isNotEmpty && c['enabled'] != false) out.add('text:${c['label']}=');
    }
  }
  return out;
}

Finder _control(bool Function(Widget) test) {
  final f = find.byWidgetPredicate(test, skipOffstage: false);
  final els = f.evaluate().where((e) => !_inPreview(e)).toList();
  if (els.isEmpty) throw 'NO CONTROL';
  return find.byElementPredicate((e) => e == els.first);
}

Future<void> perform(String name, String a) async {
  final i = a.indexOf(':');
  final kind = a.substring(0, i), rest = a.substring(i + 1);
  final eq = rest.lastIndexOf('=');
  final label = eq < 0 ? rest : rest.substring(0, eq), value = eq < 0 ? '' : rest.substring(eq + 1);
  Future<void> tap(Finder f) async {
    await T.ensureVisible(f.first);
    await T.pump();
    await T.tap(f.first, warnIfMissed: false);
  }
  switch (kind) {
    case 'bool':
      await tap(find.descendant(of: _control((w) => w is BoolControl && w.label == label), matching: find.byType(SISwitch)));
    case 'enum':
      await tap(find.descendant(of: _control((w) => w is EnumControl && w.label == label), matching: find.text(value)));
    case 'button':
      await tap(_control((w) => (w is SIButton && w.label == label) ||
          (w is TextButton && find.descendant(of: find.byWidget(w), matching: find.text(label)).evaluate().isNotEmpty)));
    case 'slider':
      final y = double.parse(label);
      final s = find.byWidgetPredicate((w) => w is Slider, skipOffstage: false).evaluate()
          .where((e) => !_inPreview(e) && ((e.renderObject as RenderBox).localToGlobal(Offset.zero).dy - y).abs() < 1).first;
      final f = find.byElementPredicate((e) => e == s);
      await T.ensureVisible(f);
      await T.pump();
      await T.drag(f, Offset(value == 'min' ? -2000 : 2000, 0), warnIfMissed: false);
    case 'text':
      final f = find.descendant(
          of: _control((w) => (w is TextControl && w.label == label) || (w is SIInput && w.label == label)),
          matching: find.byType(EditableText));
      await T.ensureVisible(f.first);
      await T.enterText(f.first, value);
      FocusManager.instance.primaryFocus?.unfocus();
    case 'preview':
      final first = find.descendant(of: _preview, matching: find.byWidgetPredicate((w) => w is! KeyedSubtree)).first;
      await T.ensureVisible(first);
      await T.pump();
      final r = T.getRect(first);
      final at = previewTap[name] ?? const Offset(0.5, 0.5);
      await T.tapAt(Offset(r.left + r.width * at.dx, r.top + r.height * at.dy));
  }
  await settle();
}

void main() {
  for (final entry in screens.entries) {
    testWidgets('controls ${entry.key}', (t) async {
      T = t;
      final name = entry.key;
      final states = <Map<String, Object?>>[];
      Future<List<Map<String, Object?>>> run(List<String> path) async {
        await pumpScreen(entry.value());
        for (final a in path) {
          await perform(name, a);
        }
        final c = dump();
        states.add({'path': path, 'controls': c});
        return c;
      }
      final base = await run(const []);
      final baseLabels = {for (final c in base) if (c['hidden'] != true) '${c['type']}:${c['label'] ?? c['text']}'};
      for (final a in [...actions(base), 'preview:tap'].where((a) => !(skip[name]?.contains(a) ?? false))) {
        List<Map<String, Object?>> c;
        try {
          c = await run([a]);
        } catch (err) {
          states.add({'path': [a], 'error': '$err'});
          continue;
        }
        // Second step: only controls this step made appear.
        final fresh = c.where((x) => x['hidden'] != true && !baseLabels.contains('${x['type']}:${x['label'] ?? x['text']}')).toList();
        for (final b in actions(fresh)) {
          try {
            await run([a, b]);
          } catch (err) {
            states.add({'path': [a, b], 'error': '$err'});
          }
        }
      }
      Directory('test/out/controls').createSync(recursive: true);
      File('test/out/controls/$name.json').writeAsStringSync(const JsonEncoder.withIndent(' ').convert({'name': name, 'states': states}));
      await t.pumpWidget(const SizedBox());
    });
  }
}
