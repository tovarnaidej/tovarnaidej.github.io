import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'package:catalog_app/screens/phone_input_configurator.dart';
import 'harness.dart';

void main() {
  testWidgets('phone-open', (t) async {
    await screen(t, 'phone-open', const PhoneInputConfigurator(), () => find.byType(SIPhoneInput),
        act: () async { final r = t.getRect(find.byType(SIPhoneInput)); await t.tapAt(r.topLeft + const Offset(40, 28)); });
  });
}
