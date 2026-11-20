"""usage: python shapediff.py <name> [-v]
Icons, strokes, shapes: what is neither a text run (inkruns.py) nor a flat fill (flatdiff.py).
Run after compare.mjs. Both renders are blurred by 1 CSS px and subtracted, so anti-aliasing and
half-pixel snapping pass, an icon that sits 2px off or has another size does not. Text runs are
left out (with room for an ellipsis after them).
Differing pixels are grouped into 8 px cells; reports the cells with more than a few of them as
CSS boxes (-v also writes <name>.shape.png: flutter | twin | differing pixels)."""
import sys, os, json
from PIL import Image, ImageChops
n = sys.argv[1]; verbose = '-v' in sys.argv
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = int(j['pad'])
if not os.path.exists(d + n + '.full.png') or not os.path.exists(d + n + '.twin.png'):
    print(n, 'SHAPE no images'); sys.exit(0)
full = Image.open(d + n + '.full.png').convert('RGB')
x0, y0 = int((j['x'] - p) * 2), int((j['y'] - p) * 2)
a = full.crop((x0, y0, int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
# the widget only (what surrounds it in the catalog is not in the twin), and only what is on screen
W = int(min(a.width, b.width, full.width - x0)) - 4 * p; H = int(min(a.height, b.height, full.height - y0)) - 4 * p
if W < 4 or H < 4:
    print(n, 'SHAPE too small'); sys.exit(0)
box = (p * 2, p * 2, p * 2 + W, p * 2 + H)
a, b = a.crop(box), b.crop(box)
R = 2; TOL = 60  # a shape half a pixel off passes (pixel snapping), one pixel off does not
if os.environ.get('SHIFT'):  # self-test: move the twin by SHIFT device px, the check must report it
    b = ImageChops.offset(b, int(os.environ['SHIFT']), 0)
from PIL import ImageFilter
# Both renders blurred by 1 CSS px: a hairline that one rasteriser snaps to the pixel and the other
# anti-aliases over two (a chip 70.44 wide) nearly cancels out; a shape that moved or changed does not.
r, g, bl = ImageChops.difference(a.filter(ImageFilter.GaussianBlur(R)), b.filter(ImageFilter.GaussianBlur(R))).split()
m = ImageChops.lighter(ImageChops.lighter(r, g), bl).point(lambda v: 255 if v > TOL else 0)
# text is inkruns.py's job (two rasterisers never draw the same glyph edge): blank the runs
from PIL import ImageDraw
dr = ImageDraw.Draw(m)
for t in j['texts']:
    if not str(t.get('text', '')).strip(): continue
    i = t['w'] * 0.15 if t.get('painted') else -3
    dr.rectangle((int((t['x'] + i) * 2), int((t['y'] + i) * 2), int((t['x'] + t['w'] - i + (0 if t.get('painted') else (t.get('size') or 14))) * 2), int((t['y'] + t['h'] - i) * 2)), fill=0)
px = m.load()
CELL = 16; cells = {}
for y in range(R, H - R):
    for x in range(R, W - R):
        if px[x, y]: cells[(x // CELL, y // CELL)] = cells.get((x // CELL, y // CELL), 0) + 1
bad = sorted(k for k, v in cells.items() if v >= 6)
# merge neighbouring cells into boxes
boxes = []
seen = set()
for k in bad:
    if k in seen: continue
    todo = [k]; seen.add(k); grp = []
    while todo:
        c = todo.pop(); grp.append(c)
        for q in ((c[0] + 1, c[1]), (c[0] - 1, c[1]), (c[0], c[1] + 1), (c[0], c[1] - 1)):
            if q in cells and cells[q] >= 6 and q not in seen: seen.add(q); todo.append(q)
    xs = [c[0] for c in grp]; ys = [c[1] for c in grp]
    boxes.append((min(xs) * CELL // 2, min(ys) * CELL // 2, (max(xs) + 1) * CELL // 2, (max(ys) + 1) * CELL // 2, sum(cells[c] for c in grp)))
if boxes and verbose:
    red = Image.new('RGB', (W, H), 'white'); red.paste((220, 0, 0), mask=m)
    out = Image.new('RGB', (W * 3 + 20, H), 'white'); out.paste(a, (0, 0)); out.paste(b, (W + 10, 0)); out.paste(red, (2 * W + 20, 0))
    out.save(d + n + '.shape.png')
for bx in boxes:
    print('  SHAPE <<< css box x %d..%d y %d..%d (%d px differ)' % (bx[0], bx[2], bx[1], bx[3], bx[4]))
print(n, 'SHAPE OK' if not boxes else 'SHAPE DIFF %d area(s)' % len(boxes))
