"""usage: python cropcmp.py <out.png> <name> x0 y0 x1 y1 [zoom] - flutter | twin crop (CSS px rel. to widget)"""
import sys, os, json
from PIL import Image
out, n = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(float, sys.argv[3:7]); z = int(sys.argv[7]) if len(sys.argv) > 7 else 4
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
box = (int((x0 + p) * 2), int((y0 + p) * 2), int((x1 + p) * 2), int((y1 + p) * 2))
A, B = a.crop(box), b.crop(box)
w, h = A.size
o = Image.new('RGB', (w * z * 2 + 8, h * z), (255, 0, 255))
o.paste(A.resize((w * z, h * z), Image.NEAREST), (0, 0)); o.paste(B.resize((w * z, h * z), Image.NEAREST), (w * z + 8, 0))
o.save(out)
