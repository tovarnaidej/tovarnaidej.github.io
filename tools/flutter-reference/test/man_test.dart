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
  testWidgets('progress__vertical', (t) async { T = t; await screen(t, 'progress__vertical', const ProgressBarConfigurator(), ty(SIProgressBar), act: () async { await enumTap('Različica','Koračni')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Usmerjenost','Navpično')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('progress__linear-notext', (t) async { T = t; await screen(t, 'progress__linear-notext', const ProgressBarConfigurator(), ty(SIProgressBar), act: () async { await enumTap('Različica','Linearni')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Besedilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('progress__stepped-notext', (t) async { T = t; await screen(t, 'progress__stepped-notext', const ProgressBarConfigurator(), ty(SIProgressBar), act: () async { await enumTap('Različica','Koračni')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Besedilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('loading__circular-thick', (t) async { T = t; await screen(t, 'loading__circular-thick', const LoadingBarConfigurator(), ty(SILoadingBar), act: () async { await enumTap('Različica','Krožni')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Debelina','Debela')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__bar', (t) async { T = t; await screen(t, 'filter__bar', const FilterConfigurator(), preview, act: () async { await boolTap('Predogled kot vrstica')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__bar-multirow', (t) async { T = t; await screen(t, 'filter__bar-multirow', const FilterConfigurator(), preview, act: () async { await boolTap('Predogled kot vrstica')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Postavitev','Prelom v več vrstic')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__filters-filled', (t) async { T = t; await screen(t, 'filter__filters-filled', const FilterConfigurator(), preview, act: () async { await enumTap('Vrsta','Filtri')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__filters-badge', (t) async { T = t; await screen(t, 'filter__filters-badge', const FilterConfigurator(), preview, act: () async { await enumTap('Vrsta','Filtri')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Značka')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__applied-dismiss', (t) async { T = t; await screen(t, 'filter__applied-dismiss', const FilterConfigurator(), preview, act: () async { await enumTap('Vrsta','Uporabljeno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Zapri')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('filter__sort-filled', (t) async { T = t; await screen(t, 'filter__sort-filled', const FilterConfigurator(), preview, act: () async { await enumTap('Vrsta','Razvrščanje')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list', (t) async { T = t; await screen(t, 'alert__list', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list-filled', (t) async { T = t; await screen(t, 'alert__list-filled', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Slog','Zapolnjeno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list-outlined', (t) async { T = t; await screen(t, 'alert__list-outlined', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await enumTap('Slog','Obrobljeno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list-avatar', (t) async { T = t; await screen(t, 'alert__list-avatar', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Avatar')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list-nochevron', (t) async { T = t; await screen(t, 'alert__list-nochevron', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Puščica')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('alert__list-nosupport', (t) async { T = t; await screen(t, 'alert__list-nosupport', const AlertConfigurator(), preview, act: () async { await enumTap('Vrsta','Pojasnilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); await boolTap('Besedilo')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('button__icon', (t) async { T = t; await screen(t, 'button__icon', const ButtonConfigurator(), ty(SIButton), act: () async { await boolTap('Ikona')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
  testWidgets('status__full', (t) async { T = t; await screen(t, 'status__full', const StatusScreenConfigurator(), ty(SIStatusScreen), act: null, size: const Size(393, 908)); });
  testWidgets('status__offline', (t) async { T = t; await screen(t, 'status__offline', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () async { await enumTap('Scenarij','Ni interneta')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 908)); });
  testWidgets('status__unsupported', (t) async { T = t; await screen(t, 'status__unsupported', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () async { await enumTap('Scenarij','Nepodprto')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 908)); });
  testWidgets('status__popup', (t) async { T = t; await screen(t, 'status__popup', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () async { await enumTap('Prikaz','Pojavno okno')(); await t.pumpAndSettle(const Duration(milliseconds: 50), EnginePhase.sendSemanticsUpdate, const Duration(seconds: 2)).catchError((_) => 0); }, size: const Size(393, 852)); });
}