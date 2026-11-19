import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'direct_harness.dart';

void main() {
  for (final style in SIDatePickerStyle.values) {
    testWidgets('calendar ${style.name}', (t) async {
      await shot(t, 'calendar-${style.name}', SIDatePicker(initialDate: DateTime(2026, 1, 17), style: style), bg: const Color(0xFFE6E7E9));
    });
    testWidgets('calendar years ${style.name}', (t) async {
      await shot(t, 'calendar-${style.name}-years', SIDatePicker(initialDate: DateTime(2026, 1, 17), style: style), bg: const Color(0xFFE6E7E9),
          act: () => t.tap(find.text('January 2026')));
    });
  }
}
