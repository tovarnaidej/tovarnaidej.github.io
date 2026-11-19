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
import 'package:catalog_app/screens/calendar_input_configurator.dart';
import 'package:catalog_app/screens/card_configurator.dart';
import 'package:catalog_app/screens/checkbox_configurator.dart';
import 'package:catalog_app/screens/divider_configurator.dart';
import 'package:catalog_app/screens/filter_configurator.dart';
import 'package:catalog_app/screens/input_configurator.dart';
import 'package:catalog_app/screens/loading_bar_configurator.dart';
import 'package:catalog_app/screens/phone_input_configurator.dart';
import 'package:catalog_app/screens/popup_configurator.dart';
import 'package:catalog_app/screens/progress_bar_configurator.dart';
import 'package:catalog_app/screens/radio_configurator.dart';
import 'package:catalog_app/screens/range_bar_configurator.dart';
import 'package:catalog_app/screens/search_bar_configurator.dart';
import 'package:catalog_app/screens/switch_configurator.dart';
import 'package:catalog_app/screens/tab_bar_configurator.dart';
import 'package:catalog_app/screens/tabs_configurator.dart';
import 'package:catalog_app/screens/status_screen_configurator.dart';
import 'harness.dart';

Finder preview() => find.byKey(const Key('PREVIEW'));
Finder Function() ty(Type t) => () => find.byType(t);

late WidgetTester T;
Future<void> Function() enumTap(String label, String chip) => () async {
  final f = find.descendant(of: find.byWidgetPredicate((w) => w is EnumControl && w.label == label), matching: find.text(chip));
  if (f.evaluate().isEmpty) { throw 'NO CONTROL $label / $chip'; }
  await T.ensureVisible(f.first); await T.pump(); await T.tap(f.first, warnIfMissed: false);
};
Future<void> Function() boolTap(String label) => () async {
  final f = find.descendant(of: find.byWidgetPredicate((w) => w is BoolControl && w.label == label), matching: find.byType(SISwitch));
  if (f.evaluate().isEmpty) { throw 'NO CONTROL $label'; }
  await T.ensureVisible(f.first); await T.pump(); await T.tap(f.first, warnIfMissed: false);
};




void main() {
  testWidgets('input__floating-outline-error', (t) async { T = t; await screen(t, 'input__floating-outline-error', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await boolTap('Napaka')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-outline-icon', (t) async { T = t; await screen(t, 'input__floating-outline-icon', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await boolTap('Ikona')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-underline', (t) async { T = t; await screen(t, 'input__floating-underline', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Podčrtano')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-underline-error', (t) async { T = t; await screen(t, 'input__floating-underline-error', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Podčrtano')(); await t.pumpAndSettle(); await boolTap('Napaka')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-underline-icon', (t) async { T = t; await screen(t, 'input__floating-underline-icon', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Podčrtano')(); await t.pumpAndSettle(); await boolTap('Ikona')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-filled', (t) async { T = t; await screen(t, 'input__floating-filled', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-filled-error', (t) async { T = t; await screen(t, 'input__floating-filled-error', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(); await boolTap('Napaka')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
  testWidgets('input__floating-filled-icon', (t) async { T = t; await screen(t, 'input__floating-filled-icon', const InputConfigurator(), ty(SIInput), act: () async { await enumTap('Oznaka','V polju')(); await t.pumpAndSettle(); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(); await boolTap('Ikona')(); await t.pumpAndSettle(); }, size: const Size(393, 852)); });
}
