"""usage (work dir, after `IOS=1 setup.sh` and `node argtypes.mjs`): python iosmaps.py
Writes ios/map.txt, ios/manmap.txt, ios/inputmap.txt and ios/varmap.txt: the same cases with
`platform:ios` for every story that has a Platforma control. Vnosno polje: the iOS catalog
starts with the label above the field, so the default and the per-control cases use
`labelPosition:above`; the `input__floating-*` references come from
`test/ios_input_floating_test.dart` (run it after `input_test.dart`)."""
import json, os
at = json.load(open('argtypes.json', encoding='utf8'))
for m in ['map.txt', 'manmap.txt', 'inputmap.txt', 'varmap.txt']:
    if not os.path.exists(m):
        print('skipped', m); continue
    out = []
    for line in open(m, encoding='utf8').read().split('\n'):
        if not line.strip(): continue
        name, story, selector, args = (line.split('|') + ['', ''])[:4]
        if 'platform:android' in args:
            args = args.replace('platform:android', 'platform:ios')
        elif 'platform' in (at.get(story, {}).get('argTypes') or {}):
            args = ';'.join(x for x in ['platform:ios', args] if x)
        if name == 'input' or (name.startswith('input__') and m == 'varmap.txt'):
            args = args.replace('labelPosition:floating', 'labelPosition:above')
        if selector == '.si-calendar':
            selector = '.si-cal-ios'  # SIDatePickerIOS is a separate twin (CalendarIOS.jsx)
        out.append('|'.join([name, story, selector, args]))
    open('ios/' + m, 'w', encoding='utf8', newline='\n').write('\n'.join(out) + '\n')
    print('ios/' + m, len(out))
