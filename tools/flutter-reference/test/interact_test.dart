// States a user reaches by using the preview, not the controls: a tap, typing, a drag, a press
// that is still held. The same steps for the twin are in interactmap.txt (compare.mjs steps).
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'package:catalog_app/widgets/config_controls.dart';
import 'package:catalog_app/screens/accordion_configurator.dart';
import 'package:catalog_app/screens/action_configurator.dart';
import 'package:catalog_app/screens/avatar_configurator.dart';
import 'package:catalog_app/screens/button_configurator.dart';
import 'package:catalog_app/screens/calendar_configurator.dart';
import 'package:catalog_app/screens/calendar_input_configurator.dart';
import 'package:catalog_app/screens/card_configurator.dart';
import 'package:catalog_app/screens/checkbox_configurator.dart';
import 'package:catalog_app/screens/filter_configurator.dart';
import 'package:catalog_app/screens/input_configurator.dart';
import 'package:catalog_app/screens/phone_input_configurator.dart';
import 'package:catalog_app/screens/progress_bar_configurator.dart';
import 'package:catalog_app/screens/radio_configurator.dart';
import 'package:catalog_app/screens/range_bar_configurator.dart';
import 'package:catalog_app/screens/search_bar_configurator.dart';
import 'package:catalog_app/screens/status_screen_configurator.dart';
import 'package:catalog_app/screens/switch_configurator.dart';
import 'package:catalog_app/screens/tabs_configurator.dart';
import 'harness.dart';

late WidgetTester T;
Finder preview() => find.byKey(const Key('PREVIEW'));
Finder inPreview(Finder f) => find.descendant(of: preview(), matching: f);
Finder Function() ty(Type t) => () => inPreview(find.byType(t));

Future<void> tap(Finder f) async {
  await T.ensureVisible(f.first);
  await T.pump();
  await T.tap(f.first, warnIfMissed: false);
}

/// A tap where the widget is (no ensureVisible: that scrolls a horizontal bar, a finger does not).
Future<void> tapHere(Finder f) async {
  await T.tap(f.first, warnIfMissed: false);
}

/// A click into a text field: with a mouse, as in Storybook (a finger also gets selection handles).
Future<void> click(Finder f) async {
  await T.ensureVisible(f.first);
  await T.pump();
  await T.tap(f.first, warnIfMissed: false, kind: PointerDeviceKind.mouse);
}

/// A press that is still held when the screen is captured (pressed state).
Future<void> hold(Finder f) async {
  await T.ensureVisible(f.first);
  await T.pump();
  await T.startGesture(T.getCenter(f.first));
  await T.pump(const Duration(milliseconds: 300));
}

Future<void> enumTap(String label, String chip) async {
  final f = find.descendant(of: find.byWidgetPredicate((w) => w is EnumControl && w.label == label), matching: find.text(chip));
  await tap(f);
  await T.pumpAndSettle();
}

Future<void> textSet(String label, String value) async {
  final f = find.descendant(of: find.byWidgetPredicate((w) => (w is TextControl && w.label == label) || (w is SIInput && w.label == label && !find.descendant(of: preview(), matching: find.byWidget(w)).evaluate().isNotEmpty)), matching: find.byType(EditableText));
  await T.ensureVisible(f.first);
  await T.enterText(f.first, value);
  FocusManager.instance.primaryFocus?.unfocus();
  await T.pumpAndSettle();
}

Future<void> boolTap(String label) async {
  final f = find.descendant(of: find.byWidgetPredicate((w) => w is BoolControl && w.label == label), matching: find.byType(SISwitch));
  await tap(f);
  await T.pumpAndSettle();
}

/// Drsnik: the bar is 393 wide; a value v sits at 35 + v * 323 (_RangeBarGeometry).
Future<void> barTap(double fx) async {
  final r = T.getRect(inPreview(find.byType(SIRangeBar)));
  await T.tapAt(Offset(r.left + r.width * fx, r.center.dy));
}

Future<void> barDrag(double from, double to) async {
  final f = inPreview(find.byType(SIRangeBar));
  await T.ensureVisible(f);
  await T.pumpAndSettle();
  final r = T.getRect(f);
  final g = await T.startGesture(Offset(r.left + r.width * from, r.center.dy));
  for (var i = 1; i <= 12; i++) {
    await g.moveTo(Offset(r.left + r.width * (from + (to - from) * i / 12), r.center.dy));
    await T.pump(const Duration(milliseconds: 16));
  }
  await g.up();
}

void main() {
  // Izbira - potrditveno polje
  testWidgets('checkbox__tap', (t) async { T = t; await screen(t, 'checkbox__tap', const CheckboxConfigurator(), ty(SICheckbox), act: () => tap(inPreview(find.byType(SICheckbox)))); });
  testWidgets('checkbox__tap-twice', (t) async { T = t; await screen(t, 'checkbox__tap-twice', const CheckboxConfigurator(), ty(SICheckbox), act: () async { await tap(inPreview(find.byType(SICheckbox))); await t.pumpAndSettle(); await tap(inPreview(find.byType(SICheckbox))); }); });
  testWidgets('checkbox__press', (t) async { T = t; await screen(t, 'checkbox__press', const CheckboxConfigurator(), ty(SICheckbox), act: () => hold(inPreview(find.byType(SICheckbox)))); });
  // Izbira - preklopnik
  testWidgets('switch__tap', (t) async { T = t; await screen(t, 'switch__tap', const SwitchConfigurator(), ty(SISwitch), act: () => tap(inPreview(find.byType(SISwitch)))); });
  testWidgets('switch__press', (t) async { T = t; await screen(t, 'switch__press', const SwitchConfigurator(), ty(SISwitch), act: () => hold(inPreview(find.byType(SISwitch)))); });
  testWidgets('switch__disabled-tap', (t) async { T = t; await screen(t, 'switch__disabled-tap', const SwitchConfigurator(), ty(SISwitch), act: () async { await boolTap('Omogočeno'); await tap(inPreview(find.byType(SISwitch))); }); });
  // Izbira - izbirni gumb
  testWidgets('radio__tap-2', (t) async { T = t; await screen(t, 'radio__tap-2', const RadioConfigurator(), preview, act: () => tap(inPreview(find.text('Option 2')))); });
  testWidgets('radio__press-3', (t) async { T = t; await screen(t, 'radio__press-3', const RadioConfigurator(), preview, act: () => hold(inPreview(find.text('Option 3')))); });
  // Drsnik
  testWidgets('range-bar__tap-25', (t) async { T = t; await screen(t, 'range-bar__tap-25', const RangeBarConfigurator(), ty(SIRangeBar), act: () => barTap(0.29453)); });
  testWidgets('range-bar__tap-snap', (t) async { T = t; await screen(t, 'range-bar__tap-snap', const RangeBarConfigurator(), ty(SIRangeBar), act: () => barTap(0.9)); });
  testWidgets('range-bar__drag', (t) async { T = t; await screen(t, 'range-bar__drag', const RangeBarConfigurator(), ty(SIRangeBar), act: () => barDrag(0.5, 0.8)); });
  testWidgets('range-bar__noticks-drag', (t) async { T = t; await screen(t, 'range-bar__noticks-drag', const RangeBarConfigurator(), ty(SIRangeBar), act: () async { await boolTap('Oznake'); await barDrag(0.5, 0.3); }); });
  // Zavihki: the whole preview (tabs, "Izbrano: …", the hint for Pomakljivo)
  testWidgets('tabs__preview', (t) async { T = t; await screen(t, 'tabs__preview', const TabsConfigurator(), preview); });
  testWidgets('tabs__tap-2', (t) async { T = t; await screen(t, 'tabs__tap-2', const TabsConfigurator(), preview, act: () => tap(inPreview(find.text('Zavihek 2')))); });
  testWidgets('tabs__scrollable-tap-5', (t) async { T = t; await screen(t, 'tabs__scrollable-tap-5', const TabsConfigurator(), preview, act: () async { await enumTap('Postavitev', 'Pomakljivo'); await tap(inPreview(find.text('Zavihek 5'))); }); });
  testWidgets('tabs__scrollable-tap-8', (t) async { T = t; await screen(t, 'tabs__scrollable-tap-8', const TabsConfigurator(), preview, act: () async { await enumTap('Postavitev', 'Pomakljivo'); await T.drag(inPreview(find.byType(SingleChildScrollView)).first, const Offset(-600, 0)); await T.pumpAndSettle(); await tap(inPreview(find.text('Zavihek 8'))); }); });
  testWidgets('tabs__select-8-then-3', (t) async { T = t; await screen(t, 'tabs__select-8-then-3', const TabsConfigurator(), preview, act: () async { await enumTap('Zavihki', '8'); await tap(inPreview(find.text('Zavihek 8'))); await T.pumpAndSettle(); await enumTap('Zavihki', '3'); }); });
  testWidgets('tabs__select-8-3-8', (t) async { T = t; await screen(t, 'tabs__select-8-3-8', const TabsConfigurator(), preview, act: () async { await enumTap('Zavihki', '8'); await tap(inPreview(find.text('Zavihek 8'))); await T.pumpAndSettle(); await enumTap('Zavihki', '3'); await enumTap('Zavihki', '8'); }); });
  // Gumb: pressed (held) in each style, and an icon without a label
  for (final style in ['Zapolnjeno', 'Obrobljeno', 'Besedilo', 'S senco']) {
    testWidgets('button__press-$style', (t) async { T = t; await screen(t, 'button__press-$style', const ButtonConfigurator(), ty(SIButton), act: () async { await enumTap('Slog', style); await hold(inPreview(find.byType(SIButton))); }); });
  }
  testWidgets('button__icon-only', (t) async { T = t; await screen(t, 'button__icon-only', const ButtonConfigurator(), ty(SIButton), act: () async { await boolTap('Ikona'); final f = find.descendant(of: find.byWidgetPredicate((w) => w is SIInput && w.label == 'Oznaka'), matching: find.byType(EditableText)); await T.ensureVisible(f.first); await T.enterText(f.first, ''); FocusManager.instance.primaryFocus?.unfocus(); await T.pumpAndSettle(); }); });
  // Avatar: initials are cut to 2 letters, upper case
  testWidgets('avatar__initials-abc', (t) async { T = t; await screen(t, 'avatar__initials-abc', const AvatarConfigurator(), ty(SIAvatar), act: () => textSet('Inicialke', 'abc')); });
  // Obvestila: the message keeps its new lines
  testWidgets('action__message-lines', (t) async { T = t; await screen(t, 'action__message-lines', const ActionConfigurator(), ty(SIAction), act: () async { await enumTap('Največje št. vrstic', 'Neomejeno'); await textSet('Sporočilo', 'Prva vrstica\nDruga vrstica'); }); });
  // Kartica: compact without a header (the left part stays empty)
  testWidgets('card__compact-noheader', (t) async { T = t; await screen(t, 'card__compact-noheader', const CardConfigurator(), ty(SICard), act: () async { await enumTap('Postavitev', 'Kompaktna'); await boolTap('Glava'); }); });
  testWidgets('card__compact-noheader-nomedia', (t) async { T = t; await screen(t, 'card__compact-noheader-nomedia', const CardConfigurator(), ty(SICard), act: () async { await enumTap('Postavitev', 'Kompaktna'); await boolTap('Glava'); await boolTap('Mediji'); }); });
  // Harmonika: open, open + close, open + another style (a new, closed accordion)
  testWidgets('accordion__open', (t) async { T = t; await screen(t, 'accordion__open', const AccordionConfigurator(), ty(SIAccordion), act: () => tap(inPreview(find.text('Accordion Title')))); });
  testWidgets('accordion__open-close', (t) async { T = t; await screen(t, 'accordion__open-close', const AccordionConfigurator(), ty(SIAccordion), act: () async { await tap(inPreview(find.text('Accordion Title'))); await T.pumpAndSettle(); await tap(inPreview(find.text('Accordion Title'))); }); });
  testWidgets('accordion__open-filled', (t) async { T = t; await screen(t, 'accordion__open-filled', const AccordionConfigurator(), ty(SIAccordion), act: () async { await enumTap('Slog', 'Zapolnjeno'); await tap(inPreview(find.text('Accordion Title'))); }); });
  testWidgets('accordion__open-then-style', (t) async { T = t; await screen(t, 'accordion__open-then-style', const AccordionConfigurator(), ty(SIAccordion), act: () async { await tap(inPreview(find.text('Accordion Title'))); await T.pumpAndSettle(); await enumTap('Slog', 'Obrobljeno'); }); });
  // Vnosno polje: focused, typed, and the typed text kept when the field is rebuilt
  testWidgets('input__focused', (t) async { T = t; await screen(t, 'input__focused', const InputConfigurator(), ty(SIInput), act: () => click(inPreview(find.byType(EditableText)))); });
  testWidgets('input__typed', (t) async { T = t; await screen(t, 'input__typed', const InputConfigurator(), ty(SIInput), act: () async { await click(inPreview(find.byType(EditableText))); await T.enterText(inPreview(find.byType(EditableText)), 'Novo besedilo'); }); });
  testWidgets('input__typed-then-error', (t) async { T = t; await screen(t, 'input__typed-then-error', const InputConfigurator(), ty(SIInput), act: () async { await click(inPreview(find.byType(EditableText))); await T.enterText(inPreview(find.byType(EditableText)), 'Novo besedilo'); FocusManager.instance.primaryFocus?.unfocus(); await T.pumpAndSettle(); await boolTap('Napaka'); }); });
  testWidgets('input__cleared-focused', (t) async { T = t; await screen(t, 'input__cleared-focused', const InputConfigurator(), ty(SIInput), act: () async { await click(inPreview(find.byType(EditableText))); await T.enterText(inPreview(find.byType(EditableText)), ''); }); });
  // Prikaz korakov: vertical without Besedilo keeps the step labels; Skupaj korakov clamps the step
  testWidgets('progress__vertical-notext', (t) async { T = t; await screen(t, 'progress__vertical-notext', const ProgressBarConfigurator(), ty(SIProgressBar), act: () async { await enumTap('Različica', 'Koračni'); await enumTap('Usmerjenost', 'Navpično'); await boolTap('Besedilo'); }, size: const Size(393, 852)); });
  testWidgets('progress__vertical-total-3', (t) async { T = t; await screen(t, 'progress__vertical-total-3', const ProgressBarConfigurator(), ty(SIProgressBar), act: () async { await enumTap('Različica', 'Koračni'); await enumTap('Usmerjenost', 'Navpično'); final s = find.byType(Slider).last; await T.ensureVisible(s); await T.pump(); await T.drag(s, const Offset(-2000, 0)); await T.pumpAndSettle(); }, size: const Size(393, 852)); });
  // Filter: bar chips toggle (several can be on); the selection survives a single chip and back
  Finder barChip(int i) => find.descendant(of: inPreview(find.byType(SIFilterBar)), matching: find.byType(SIFilter)).at(i);
  testWidgets('filter__bar-tap-2', (t) async { T = t; await screen(t, 'filter__bar-tap-2', const FilterConfigurator(), ty(SIFilterBar), act: () async { await boolTap('Predogled kot vrstica'); await tapHere(barChip(1)); }); });
  testWidgets('filter__bar-tap-1-2', (t) async { T = t; await screen(t, 'filter__bar-tap-1-2', const FilterConfigurator(), ty(SIFilterBar), act: () async { await boolTap('Predogled kot vrstica'); await tapHere(barChip(1)); await T.pumpAndSettle(); await tapHere(barChip(0)); }); });
  testWidgets('filter__bar-kept', (t) async { T = t; await screen(t, 'filter__bar-kept', const FilterConfigurator(), ty(SIFilterBar), act: () async { await boolTap('Predogled kot vrstica'); await tapHere(barChip(2)); await T.pumpAndSettle(); await boolTap('Predogled kot vrstica'); await boolTap('Predogled kot vrstica'); }); });
  // Gradnik za prisilno posodobitev: blank Meta / Sekundarni gumb hide them; the dialog closes
  testWidgets('status__meta-empty', (t) async { T = t; await screen(t, 'status__meta-empty', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () => textSet('Meta', ''), size: const Size(393, 908)); });
  testWidgets('status__secondary-empty', (t) async { T = t; await screen(t, 'status__secondary-empty', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () => textSet('Sekundarni gumb', ''), size: const Size(393, 908)); });
  testWidgets('status__title-changed', (t) async { T = t; await screen(t, 'status__title-changed', const StatusScreenConfigurator(), ty(SIStatusScreen), act: () => textSet('Naslov', 'Nov naslov'), size: const Size(393, 908)); });
  testWidgets('status__popup-closed', (t) async { T = t; await screen(t, 'status__popup-closed', const StatusScreenConfigurator(), ty(SIButton), act: () async { await enumTap('Prikaz', 'Pojavno okno'); await tap(inPreview(find.text('Odpri pojavno okno'))); await T.pumpAndSettle(); await T.tap(find.text('Posodobi aplikacijo').last); }); });
  // Iskalno polje: typing, the clear (x), the back arrow, and a control change re-opening it
  Finder iconButtons() => inPreview(find.byType(SIIconButton));
  testWidgets('search-bar__typed', (t) async { T = t; await screen(t, 'search-bar__typed', const SearchBarConfigurator(), preview, act: () async { await click(inPreview(find.byType(EditableText))); await T.enterText(inPreview(find.byType(EditableText)), 'Abc'); }); });
  testWidgets('search-bar__cleared', (t) async { T = t; await screen(t, 'search-bar__cleared', const SearchBarConfigurator(), preview, act: () async { await enumTap('Rezultati', 'Prikazano'); await tapHere(iconButtons().last); }); });
  testWidgets('search-bar__back', (t) async { T = t; await screen(t, 'search-bar__back', const SearchBarConfigurator(), preview, act: () async { await enumTap('Rezultati', 'Prikazano'); await tapHere(iconButtons().first); }); });
  testWidgets('search-bar__back-then-avatar', (t) async { T = t; await screen(t, 'search-bar__back-then-avatar', const SearchBarConfigurator(), preview, act: () async { await enumTap('Rezultati', 'Prikazano'); await tapHere(iconButtons().first); await T.pumpAndSettle(); await boolTap('Avatar'); }); });
  testWidgets('search-bar__shown-noclear', (t) async { T = t; await screen(t, 'search-bar__shown-noclear', const SearchBarConfigurator(), preview, act: () async { await enumTap('Rezultati', 'Prikazano'); await boolTap('Zapri'); }); });
  // Vnosno polje za telefonsko številko: picker search, a picked country, the typed number
  Future<void> openPicker() async { final r = T.getRect(inPreview(find.byType(SIPhoneInput))); await T.tapAt(r.topLeft + const Offset(40, 28)); await T.pumpAndSettle(); }
  Finder search() => find.descendant(of: find.byWidgetPredicate((w) => w is SIPrefixSearchPanel), matching: find.byType(EditableText));
  Finder number() => find.descendant(of: find.byType(SIPhoneAmountValueField), matching: find.byType(EditableText));
  testWidgets('phone__search-hr', (t) async { T = t; await screen(t, 'phone__search-hr', const PhoneInputConfigurator(), ty(SIPhoneInput), act: () async { await openPicker(); await click(search()); await T.enterText(search(), 'hr'); await T.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 600))); await T.pump(); await T.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 600))); await T.pump(); }); });
  testWidgets('phone__search-none', (t) async { T = t; await screen(t, 'phone__search-none', const PhoneInputConfigurator(), ty(SIPhoneInput), act: () async { await openPicker(); await click(search()); await T.enterText(search(), 'xyz'); }); });
  testWidgets('phone__picked-al', (t) async { T = t; await screen(t, 'phone__picked-al', const PhoneInputConfigurator(), ty(SIPhoneInput), act: () async { await openPicker(); await T.tap(find.text('Albanija (+355)')); }); });
  testWidgets('phone__typed', (t) async { T = t; await screen(t, 'phone__typed', const PhoneInputConfigurator(), ty(SIPhoneInput), act: () async { await click(number()); await T.enterText(number(), '41321654'); }); });
  testWidgets('phone__typed-then-error', (t) async { T = t; await screen(t, 'phone__typed-then-error', const PhoneInputConfigurator(), ty(SIPhoneInput), act: () async { await click(number()); await T.enterText(number(), '41321654'); FocusManager.instance.primaryFocus?.unfocus(); await T.pumpAndSettle(); await boolTap('Napaka'); }); });
  // Vnosno polje za datum: mask, error, V redu / Prekliči (Zadnji rezultat), the date picker
  Finder dateField([int i = 0]) => inPreview(find.byType(EditableText)).at(i);
  Future<void> typeDate(String digits, [int i = 0]) async { await click(dateField(i)); await T.enterText(dateField(i), digits); await T.pumpAndSettle(); }
  Future<void> pressText(String label) async { await tapHere(inPreview(find.text(label)).first); await T.pumpAndSettle(); }
  testWidgets('calendar-input__preview', (t) async { T = t; await screen(t, 'calendar-input__preview', const CalendarInputConfigurator(), preview); });
  testWidgets('calendar-input__typed', (t) async { T = t; await screen(t, 'calendar-input__typed', const CalendarInputConfigurator(), ty(SICalendarInput), act: () => typeDate('12052026')); });
  testWidgets('calendar-input__invalid', (t) async { T = t; await screen(t, 'calendar-input__invalid', const CalendarInputConfigurator(), ty(SICalendarInput), act: () async { await typeDate('99'); FocusManager.instance.primaryFocus?.unfocus(); await pressText('V redu'); }); });
  testWidgets('calendar-input__ok', (t) async { T = t; await screen(t, 'calendar-input__ok', const CalendarInputConfigurator(), preview, act: () async { await typeDate('12052026'); FocusManager.instance.primaryFocus?.unfocus(); await pressText('V redu'); }); });
  testWidgets('calendar-input__cancel', (t) async { T = t; await screen(t, 'calendar-input__cancel', const CalendarInputConfigurator(), preview, act: () => pressText('Prekliči')); });
  testWidgets('calendar-input__range-endbefore', (t) async { T = t; await screen(t, 'calendar-input__range-endbefore', const CalendarInputConfigurator(), ty(SICalendarInput), act: () async { await enumTap('Način', 'Datumsko obdobje'); await typeDate('12052026', 0); await typeDate('01012026', 1); FocusManager.instance.primaryFocus?.unfocus(); await pressText('V redu'); }); });
  // the icon opens the date picker (today's month); a picked day fills the field
  Finder picker() => find.byWidgetPredicate((w) => w is SIDatePicker || w is SIDatePickerIOS);
  testWidgets('calendar-input__picker', (t) async { T = t; await screen(t, 'calendar-input__picker', const CalendarInputConfigurator(), picker, act: () async { await tapHere(inPreview(find.byType(IconButton))); await T.pumpAndSettle(); }); });
  testWidgets('calendar-input__picked-10', (t) async { T = t; await screen(t, 'calendar-input__picked-10', const CalendarInputConfigurator(), ty(SICalendarInput), act: () async { await tapHere(inPreview(find.byType(IconButton))); await T.pumpAndSettle(); await T.tap(find.descendant(of: picker(), matching: find.text('10')).first); await T.pumpAndSettle(); if (find.descendant(of: picker(), matching: find.text('V redu')).evaluate().isNotEmpty) { await T.tap(find.descendant(of: picker(), matching: find.text('V redu')).first); await T.pumpAndSettle(); } }); });
  // Koledar: the arrows page months and year pages, a drag pages months; on Android the year
  // page stays when the years view is left and opened again (positions measured on the twin)
  Offset at(String what) {
    final r = T.getRect(picker());
    final isIos = find.byType(SIDatePickerIOS).evaluate().isNotEmpty;
    final p = isIos
        ? {'next': const Offset(329.5, 37.5), 'prev': const Offset(300.5, 37.5), 'label': const Offset(95.6, 37.5), 'grid': const Offset(180.5, 243)}[what]!
        : {'next': const Offset(292, 145), 'prev': const Offset(244, 145), 'label': const Offset(118, 145), 'grid': const Offset(164, 337)}[what]!;
    return r.topLeft + p;
  }
  Future<void> tapAt(String what) async { await T.tapAt(at(what)); await T.pumpAndSettle(); }
  Future<void> swipe(double dx) async {
    final g = await T.startGesture(at('grid'));
    for (var i = 1; i <= 20; i++) { await g.moveBy(Offset(dx / 20, 0)); await T.pump(const Duration(milliseconds: 16)); }
    await T.pump(const Duration(milliseconds: 200));
    await g.up();
    await T.pumpAndSettle();
  }
  testWidgets('calendar__next', (t) async { T = t; await screen(t, 'calendar__next', const CalendarConfigurator(), picker, act: () => tapAt('next')); });
  testWidgets('calendar__prev-prev', (t) async { T = t; await screen(t, 'calendar__prev-prev', const CalendarConfigurator(), picker, act: () async { await tapAt('prev'); await tapAt('prev'); }); });
  testWidgets('calendar__swipe-next', (t) async { T = t; await screen(t, 'calendar__swipe-next', const CalendarConfigurator(), picker, act: () => swipe(-200)); });
  testWidgets('calendar__years-next', (t) async { T = t; await screen(t, 'calendar__years-next', const CalendarConfigurator(), picker, act: () async { await tapAt('label'); await tapAt('next'); }); });
  testWidgets('calendar__years-next-reopen', (t) async { T = t; await screen(t, 'calendar__years-next-reopen', const CalendarConfigurator(), picker, act: () async { await tapAt('label'); await tapAt('next'); await tapAt('label'); await tapAt('label'); }); });
}
