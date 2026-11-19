"""usage: python flatdiff.py <name> [-v]
Fill colours: compares the flat areas of the Flutter render and the twin (run after compare.mjs).
imgdiff.py only counts strong differences, so a white fill against a light grey one (an outlined
chip that should be white on the grey catalog canvas) passes there. Here both images are cut
into 4x4 device-pixel blocks; a block that is flat in both (no edge, no glyph) must have the same
colour within 10 / 255. Reports the share of differing flat blocks and where they are."""
import sys, os, json
from PIL import Image, ImageChops, ImageFilter
n = sys.argv[1]; verbose = '-v' in sys.argv
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
if not os.path.exists(d + n + '.full.png') or not os.path.exists(d + n + '.twin.png'):
    print(n, 'FLAT no images'); sys.exit(0)
a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
# only the widget itself: what surrounds it in the catalog is not part of the twin
box = (p * 2, p * 2, min(a.width, b.width) - p * 2, min(a.height, b.height) - p * 2)
a, b = a.crop(box), b.crop(box)
K = 4
w, h = a.width // K, a.height // K
if w < 1 or h < 1:
    print(n, 'FLAT too small'); sys.exit(0)

def blocks(im):
    im = im.crop((0, 0, w * K, h * K))
    mean = im.resize((w, h), Image.BOX)
    lo = im.filter(ImageFilter.MinFilter(K + 1)).resize((w, h), Image.BOX)
    hi = im.filter(ImageFilter.MaxFilter(K + 1)).resize((w, h), Image.BOX)
    flat = ImageChops.difference(hi, lo).convert('L').point(lambda v: 255 if v <= 6 else 0)
    return mean, flat

ma, fa = blocks(a); mb, fb = blocks(b)
both = ImageChops.multiply(fa, fb)
diff = ImageChops.difference(ma, mb)
r, g, bl = diff.split()
mx = ImageChops.lighter(ImageChops.lighter(r, g), bl).point(lambda v: 255 if v > 10 else 0)
bad = ImageChops.multiply(mx, both)
nb = sum(1 for v in bad.getdata() if v); nf = sum(1 for v in both.getdata() if v)
if not nf:
    print(n, 'FLAT nothing flat'); sys.exit(0)
share = 100 * nb / nf
bb = bad.getbbox()
if nb and (verbose or share > 0.5):
    cx, cy = next((i % w, i // w) for i, v in enumerate(bad.getdata()) if v)
    print('  FLAT e.g. at %d,%d: ref %s twin %s' % (cx * K // 2, cy * K // 2, ma.getpixel((cx, cy)), mb.getpixel((cx, cy))))
print(n, 'FLAT OK' if share <= 0.5 else 'FLAT DIFF', '%.2f%% of flat area' % share, ('bbox css %s' % ([v * K // 2 for v in bb],)) if bb else '')
