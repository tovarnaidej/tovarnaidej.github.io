import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:si_component_library/si_component_library.dart';
import 'direct_harness.dart';

void main() {
  for (final style in SISearchBarStyle.values) {
    testWidgets('search expanded with results ${style.name}', (t) async {
      await shot(t, 'search-shown-${style.name}', SISearchBar<String>(placeholder: 'Input search text', style: style, showResults: true, initialQuery: 'Input text', onChanged: (_) {},
        results: const ['List Item One', 'List Item Two', 'List Item Three'],
        resultBuilder: (c, item) => SIListItem(title: item, supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur', avatar: const SIAvatar(type: SIAvatarType.filled, initials: 'A', size: 40))), width: 361);
    });
    testWidgets('search expanded empty ${style.name}', (t) async {
      await shot(t, 'search-empty-${style.name}', SISearchBar<String>(placeholder: 'Input search text', style: style, showResults: true, initialQuery: 'Input text', onChanged: (_) {}), width: 361);
    });
    testWidgets('search expanded, no query ${style.name}', (t) async {
      await shot(t, 'search-noquery-${style.name}', SISearchBar<String>(placeholder: 'Input search text', style: style, showResults: true, onChanged: (_) {}), width: 361);
    });
  }
}
