import json, sys
sys.stdout.reconfigure(encoding='utf8')
d = json.load(open(f'{'cat' if __import__('os').path.exists('cat/test/out/'+sys.argv[1]+'.json') else 'sot_render'}/test/out/{sys.argv[1]}.json', encoding='utf8'))
flt = sys.argv[2] if len(sys.argv) > 2 else None
print(sys.argv[1], d['w'], d['h'])
seen = set()
for t in d['texts']:
    if flt and flt not in t['text']: continue
    print(' ', repr(t['text'][:30]).ljust(32), 'x', round(t['x'], 2), 'y', round(t['y'], 2), 'w', round(t['w'], 2), 'h', round(t['h'], 2), 'bl', round(t['baseline'], 2),
          '|', t.get('size'), t.get('weight'), round(t['lh'] * t['size'], 2) if t.get('lh') else None, 'ls', t.get('ls'), t.get('color'))
