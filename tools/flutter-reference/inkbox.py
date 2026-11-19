"""usage: python inkbox.py <name> x0 y0 x1 y1  (CSS px relative to widget) — ink bbox in ref and twin"""
import sys, os, json
from PIL import Image, ImageChops
n = sys.argv[1]; x0, y0, x1, y1 = map(float, sys.argv[2:6])
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
if os.path.exists(d + n + '.full.png'):
    a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
else:
    a = Image.open(d + n + '.png').convert('RGB')
b = Image.open(d + n + '.twin.png').convert('RGB')
box = (int((x0 + p) * 2), int((y0 + p) * 2), int((x1 + p) * 2), int((y1 + p) * 2))
for label, im in (('ref ', a), ('twin', b)):
    r = im.crop(box); bg = Image.new('RGB', r.size, r.getpixel((0, 0)))
    bb = ImageChops.difference(r, bg).convert('L').point(lambda v: 255 if v > 40 else 0).getbbox()
    if bb: print(label, 'x', x0 + bb[0] / 2, '..', x0 + bb[2] / 2, ' y', y0 + bb[1] / 2, '..', y0 + bb[3] / 2, ' size', (bb[2] - bb[0]) / 2, 'x', (bb[3] - bb[1]) / 2)
    else: print(label, 'no ink')
