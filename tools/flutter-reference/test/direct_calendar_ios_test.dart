import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'direct_harness.dart';

void main() {
  for (final style in SIDatePickerStyle.values) {
    testWidgets('ios ${style.name}', (t) async {
      await shot(t, 'calendar-ios-${style.name}', SIDatePickerIOS(selectedDate: DateTime(2026, 1, 17), style: style, onDateSelected: (_) {}), bg: const Color(0xFFE6E7E9));
    });
  }
}
