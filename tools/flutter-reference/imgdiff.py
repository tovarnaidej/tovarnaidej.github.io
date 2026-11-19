"""usage: python imgdiff.py <name> — side by side (flutter | twin | diff) into <out>/<name>.cmp.png"""
import sys, os, json
from PIL import Image, ImageChops
n = sys.argv[1]
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
if os.path.exists(d + n + '.full.png'):
    j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
    a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
else:
    a = Image.open(d + n + '.png').convert('RGB')
b = Image.open(d + n + '.twin.png').convert('RGB')
w = max(a.width, b.width); h = max(a.height, b.height)
A = Image.new('RGB', (w, h), 'white'); A.paste(a, (0, 0)); B = Image.new('RGB', (w, h), 'white'); B.paste(b, (0, 0))
diff = ImageChops.difference(A, B).convert('L')
strong = diff.point(lambda v: 255 if v > 96 else 0)
pct = 100 * sum(1 for v in strong.getdata() if v) / (w * h)
out = Image.new('RGB', (w * 3 + 20, h), 'white')
out.paste(A, (0, 0)); out.paste(B, (w + 10, 0))
red = Image.new('RGB', (w, h), 'white'); red.paste((220, 0, 0), mask=diff.point(lambda v: min(255, v * 2)))
out.paste(red, (2 * w + 20, 0))
out.save(d + n + '.cmp.png')
print(n, f'sizes {a.size} vs {b.size}; strong-diff pixels {pct:.2f}%; bbox {strong.getbbox()}')
