import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
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
import 'harness.dart';

Finder preview() => find.byKey(const Key('PREVIEW'));
Finder Function() ty(Type t) => () => find.byType(t);

void main() {
  final cases = <String, (Widget, Finder Function(), Size)>{
    'accordion': (const AccordionConfigurator(), ty(SIAccordion), const Size(393, 852)),
    'action': (const ActionConfigurator(), ty(SIAction), const Size(393, 852)),
    'alert': (const AlertConfigurator(), ty(SIAlert), const Size(393, 852)),
    'app-bar': (const AppBarConfigurator(), ty(SIAppBar), const Size(412, 852)),
    'avatar': (const AvatarConfigurator(), ty(SIAvatar), const Size(393, 852)),
    'button': (const ButtonConfigurator(), ty(SIButton), const Size(393, 852)),
    'calendar-input': (const CalendarInputConfigurator(), ty(SICalendarInput), const Size(393, 852)),
    'card': (const CardConfigurator(), ty(SICard), const Size(393, 852)),
    'checkbox': (const CheckboxConfigurator(), ty(SICheckbox), const Size(393, 852)),
    'divider': (const DividerConfigurator(), ty(SIDivider), const Size(393, 852)),
    'filter': (const FilterConfigurator(), preview, const Size(393, 852)),
    'input': (const InputConfigurator(), ty(SIInput), const Size(393, 852)),
    'loading-bar': (const LoadingBarConfigurator(), ty(SILoadingBar), const Size(393, 852)),
    'pass-login': (const PassLoginPreview(), ty(SIPassLogin), const Size(393, 852)),
    'phone-input': (const PhoneInputConfigurator(), ty(SIPhoneInput), const Size(393, 852)),
    'popup': (const PopupConfigurator(), ty(SIPopup), const Size(393, 852)),
    'progress-bar': (const ProgressBarConfigurator(), ty(SIProgressBar), const Size(393, 852)),
    'radio': (const RadioConfigurator(), preview, const Size(393, 852)),
    'range-bar': (const RangeBarConfigurator(), ty(SIRangeBar), const Size(393, 852)),
    'search-bar': (const SearchBarConfigurator(), preview, const Size(393, 852)),
    'status-screen': (const StatusScreenConfigurator(), ty(SIStatusScreen), const Size(393, 908)),
    'switch': (const SwitchConfigurator(), ty(SISwitch), const Size(393, 852)),
    'tab-bar': (const TabBarConfigurator(), ty(SITabBar), const Size(396, 852)),
    'tabs': (const TabsConfigurator(), ty(SITabs), const Size(393, 852)),
  };
  for (final e in cases.entries) {
    testWidgets(e.key, (t) async {
      await screen(t, e.key, e.value.$1, e.value.$2, size: e.value.$3);
    });
  }
}
