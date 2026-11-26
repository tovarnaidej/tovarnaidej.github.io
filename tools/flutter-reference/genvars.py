import json, re, sys
sys.stdout.reconfigure(encoding='utf8')
at = json.load(open('argtypes.json', encoding='utf8'))
maprows = [l.strip().split('|') for l in open('map.txt', encoding='utf8') if l.strip()]
ctor = {
 'accordion': ('AccordionConfigurator', 'ty(SIAccordion)', 393), 'action': ('ActionConfigurator', 'ty(SIAction)', 393),
 'alert': ('AlertConfigurator', 'preview', 393), 'app-bar': ('AppBarConfigurator', 'ty(SIAppBar)', 412),
 'avatar': ('AvatarConfigurator', 'ty(SIAvatar)', 393), 'button': ('ButtonConfigurator', 'ty(SIButton)', 393),
 'calendar-input': ('CalendarInputConfigurator', 'ty(SICalendarInput)', 393), 'card': ('CardConfigurator', 'ty(SICard)', 393),
 'checkbox': ('CheckboxConfigurator', 'ty(SICheckbox)', 393), 'divider': ('DividerConfigurator', 'ty(SIDivider)', 393),
 'filter': ('FilterConfigurator', 'preview', 393), 'input': ('InputConfigurator', 'ty(SIInput)', 393),
 'loading-bar': ('LoadingBarConfigurator', 'ty(SILoadingBar)', 393), 'phone-input': ('PhoneInputConfigurator', 'ty(SIPhoneInput)', 393),
 'popup': ('PopupConfigurator', 'ty(SIPopup)', 393), 'progress-bar': ('ProgressBarConfigurator', 'ty(SIProgressBar)', 393),
 'radio': ('RadioConfigurator', 'preview', 393), 'range-bar': ('RangeBarConfigurator', 'ty(SIRangeBar)', 393),
 'search-bar': ('SearchBarConfigurator', 'preview', 393), 'switch': ('SwitchConfigurator', 'ty(SISwitch)', 393),
 'tab-bar': ('TabBarConfigurator', 'ty(SITabBar)', 396), 'tabs': ('TabsConfigurator', 'ty(SITabs)', 393),
}
base = {'input': 'platform:android;labelPosition:floating'}
# Controls the catalog shows only in another mode (or that the twin exposes without a catalog
# control): one tap from the default state cannot reach them, manmap.txt / man_test.dart do.
SKIP = {
 'alert': {'listStyle', 'showSupporting', 'showAvatar', 'showChevron', 'supportingLines'},
 'button': {'leadingIcon'}, 'calendar-input': {'focused'},
 'filter': {'previewAsBar', 'layout', 'style', 'showBadge', 'showDismiss'},
 'loading-bar': {'thickness'}, 'progress-bar': {'showText', 'orientation'},
 # the catalog's 0 / 25 / 50 / 75 / 100 are buttons, not chips (controls.mjs + interactmap.txt)
 'range-bar': {'valueStop'},
}
# The catalog changes other values together with a control; a story URL sets only one arg.
LINKED = {
 ('progress-bar', 'variant', 'linear'): 'totalSteps:10', ('progress-bar', 'variant', 'stepped'): 'totalSteps:3',
 ('tabs', 'configuration', 'scrollable'): 'tabCount:8',
}
# The twin's root element changes with the value.
SELECTOR = {('alert', 'mode', 'list'): '.si-list-item'}
tests = []; rows = []
BS = chr(92)
esc = lambda s: s.replace(BS, BS + BS).replace("'", BS + "'").replace('$', BS + '$')
for key, sid, sel in (r[:3] for r in maprows):
    if key not in ctor or sid not in at or 'argTypes' not in at[sid]: continue
    a = at[sid]; args = a['args']; b = base.get(key, 'platform:android' if 'platform' in a['argTypes'] else '')
    for arg, t in a['argTypes'].items():
        if arg in ('platform', 'className', 'onClick') or not t.get('name') or arg in SKIP.get(key, ()): continue
        if t.get('options'):
            for o in t['options']:
                if o == args.get(arg) or (key == 'input' and arg == 'labelPosition'): continue
                chip = (t.get('labels') or {}).get(str(o), str(o))
                name = f'{key}__{arg}-{o}'
                tests.append((name, key, f"enumTap('{esc(t['name'])}', '{esc(chip)}')"))
                rows.append((name, sid, SELECTOR.get((key, arg, o), sel), ';'.join(x for x in [b, f'{arg}:{o}', LINKED.get((key, arg, o))] if x)))
        elif t.get('control') == 'boolean':
            v = not bool(args.get(arg))
            name = f'{key}__{arg}-{str(v).lower()}'
            tests.append((name, key, f"boolTap('{esc(t['name'])}')"))
            rows.append((name, sid, sel, ';'.join(x for x in [b, f'{arg}:!{str(v).lower()}'] if x)))
imports = sorted({c[0] for c in ctor.values()})
snake = lambda n: re.sub('(?<!^)(?=[A-Z])', '_', n).lower()
dart = ["import 'package:flutter/material.dart';", "import 'package:flutter_test/flutter_test.dart';", "import 'package:si_component_library/si_component_library.dart';", "import 'package:catalog_app/widgets/config_controls.dart';"]
dart += [f"import 'package:catalog_app/screens/{snake(c)}.dart';" for c in imports]
dart += ["import 'harness.dart';", '', "Finder preview() => find.byKey(const Key('PREVIEW'));", 'Finder Function() ty(Type t) => () => find.byType(t);', '''
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
''', 'void main() {']
for name, key, act in tests:
    c = ctor[key]
    tgt = 'preview' if c[1] == 'preview' else c[1]
    dart.append(f"  testWidgets('{name}', (t) async {{ T = t; await screen(t, '{esc(name)}', const {c[0]}(), {tgt}, act: {act}, size: const Size({c[2]}, 852)); }});")
dart.append('}')
open('cat/test/var_test.dart', 'w', encoding='utf8').write('\n'.join(dart))
open('varmap.txt', 'w', encoding='utf8').write('\n'.join('|'.join(r) for r in rows) + '\n')
print(len(tests), 'variants')
