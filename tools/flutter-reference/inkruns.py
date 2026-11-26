"""usage: python inkruns.py <name> [-v]
Rendered-pixel check of every text run of a reference (run after compare.mjs, which writes
<name>.twin.png): the ink bounding box of each run's colour inside the run's box, in the Flutter
render and in the twin. compare.mjs checks layout numbers; this catches what layout does not
show (Chromium snapping a line that starts on a fraction of a pixel, text-box-trim rounding).
Images are 2x, so edges are quantised to 0.5px: a run is flagged from 1px.
Also the colour of each run's ink core (the pixels farthest from the background, i.e. fully
covered): a wrong colour or a missing / extra opacity (iOS pressed 0.7, disabled 0.38) shows
there and nowhere else - layout, ink box, flat fills and shapes all leave text colour alone."""
import sys, os, json
from collections import Counter
from PIL import Image
sys.stdout.reconfigure(encoding='utf8')
n = sys.argv[1]; verbose = '-v' in sys.argv
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
if not os.path.exists(d + n + '.full.png') or not os.path.exists(d + n + '.twin.png'):
    print(n, 'INK no images'); sys.exit(0)
full = Image.open(d + n + '.full.png').convert('RGB')
# the crop reaches past the screen when the widget touches its edge: that part is black
VX = min((j['x'] + j['w'] + p) * 2, full.width) - int((j['x'] - p) * 2); VY = min((j['y'] + j['h'] + p) * 2, full.height) - int((j['y'] - p) * 2)
a = full.crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
from carets import blank_carets
blank_carets(j, a, b)  # focused fields: the caret is left out
# The crop reaches past the screen's left / top edge when the widget touches it (Razdelilnik): that
# strip is black in the Flutter render. Give both images the twin's pixels there.
offx, offy = max(0, int(round((p - j['x']) * 2))), max(0, int(round((p - j['y']) * 2)))
if offx:
    a.paste(b.crop((0, 0, offx, b.height)), (0, 0))
if offy:
    a.paste(b.crop((0, 0, b.width, offy)), (0, 0))
W, H = int(min(a.width, b.width, VX)), int(min(a.height, b.height, VY))

def bbox(im, box, c, bg):
    span = max(abs(c[k] - bg[k]) for k in range(3))
    r = im.crop(box); px = r.load(); w, h = r.size
    ink = set((x, y) for y in range(h) for x in range(w)
              if max(abs(px[x, y][0] - c[0]), abs(px[x, y][1] - c[1]), abs(px[x, y][2] - c[2])) <= span * 0.45)
    # What reaches the edge of the box is not the run (the box has a 2px margin around the line): a
    # white digit in a coloured badge on a white chip has its own colour all around the badge, and
    # a teal number in a white circle on a teal calendar has it in the box corners.
    todo = [q for q in ink if q[0] in (0, w - 1) or q[1] in (0, h - 1)]
    if todo:
        ink.difference_update(todo)
        while todo:
            x, y = todo.pop()
            for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if q in ink: ink.discard(q); todo.append(q)
    if not ink: return None
    xs = [q[0] for q in ink]; ys = [q[1] for q in ink]
    return (min(xs) / 2, (max(xs) + 1) / 2, min(ys) / 2, (max(ys) + 1) / 2)

def inkbox(im, box):
    """colour-free: pixels that differ from the region's main colour by more than half the largest difference"""
    r = im.crop(box); data = list(r.getdata()); bg = Counter(data).most_common(1)[0][0]
    dist = [max(abs(q[k] - bg[k]) for k in range(3)) for q in data]; top = max(dist)
    if top < 40: return None
    xs = [i % r.width for i, v in enumerate(dist) if v > top * 0.55]; ys = [i // r.width for i, v in enumerate(dist) if v > top * 0.55]
    return (min(xs) / 2, (max(xs) + 1) / 2, min(ys) / 2, (max(ys) + 1) / 2)

def core(im, box, bg):
    """mean colour of the ink core: pixels at least 85% as far from the background as the farthest"""
    data = list(im.crop(box).getdata())
    dist = [max(abs(q[k] - bg[k]) for k in range(3)) for q in data]
    top = max(dist) if dist else 0
    if top < 40: return None
    sel = [q for q, v in zip(data, dist) if v >= top * 0.85]
    return tuple(sum(q[k] for q in sel) / len(sel) for k in range(3))

bad = 0; checked = 0
for t in j['texts']:
    if t.get('painted'):
        i = t['w'] * 0.2  # square inside the circle: only the fill and the letters
        box = (int((t['x'] + i + p) * 2), int((t['y'] + i + p) * 2), int((t['x'] + t['w'] - i + p) * 2), int((t['y'] + t['h'] - i + p) * 2))
        ra, rb = inkbox(a, box), inkbox(b, box); checked += 1
        if ra is None or rb is None:
            if ra != rb: bad += 1; print('  INK <<< painted "%s" ink only in one render' % t['text'])
            continue
        dl = [rb[k] - ra[k] for k in range(4)]; flag = max(abs(v) for v in dl) >= 1.0
        if flag: bad += 1
        if flag or verbose: print('  INK %s painted "%s" left %+.1f right %+.1f top %+.1f bottom %+.1f' % ('<<<' if flag else '   ', t['text'], dl[0], dl[1], dl[2], dl[3]))
        continue
    text = t['text'].replace('[editable] ', '').strip()
    if not text or not t.get('color') or (len(text) == 1 and 0xE000 <= ord(text) <= 0xF8FF):
        continue
    col = t['color'].rjust(8, '0')
    if int(col[:2], 16) < 200:
        continue  # translucent text: blended colour unknown
    c = tuple(int(col[i:i + 2], 16) for i in (2, 4, 6))
    m = 2
    box = (max(0, int((t['x'] - m + p) * 2)), max(0, int((t['y'] - m + p) * 2)), min(W, int((t['x'] + t['w'] + m + p) * 2)), min(H, int((t['y'] + t['h'] + m + p) * 2)))
    if box[2] - box[0] < 2 or box[3] - box[1] < 2:
        continue
    bg = Counter(a.crop(box).getdata()).most_common(1)[0][0]
    if max(abs(c[k] - bg[k]) for k in range(3)) < 40:
        continue
    ra, rb = bbox(a, box, c, bg), bbox(b, box, c, bg)
    checked += 1
    if ra is None and rb is None:
        continue
    if ra is None or rb is None:
        bad += 1; print('  INK <<< "%s" ink only in %s' % (text[:28], 'twin' if ra is None else 'ref')); continue
    dl = [rb[k] - ra[k] for k in range(4)]
    # A run that reaches past the widget is cut by its clip: that edge is the clip's, and the
    # half-covered glyph there anti-aliases differently in the two renderers (scrolled tabs).
    if t['x'] + t['w'] > j['w'] + 0.5: dl[1] = 0
    if t['x'] < -0.5: dl[0] = 0
    flag = max(abs(v) for v in dl) >= 1.0
    ca, cb = core(a, box, bg), core(b, box, bg)
    cflag = ca is not None and cb is not None and max(abs(ca[k] - cb[k]) for k in range(3)) > 48  # subpixel AA tints a black core up to ~#1f
    if flag or cflag: bad += 1
    if flag or verbose:
        print('  INK %s "%s" left %+.1f right %+.1f top %+.1f bottom %+.1f' % ('<<<' if flag else '   ', text[:28], dl[0], dl[1], dl[2], dl[3]))
    if cflag or (verbose and ca and cb):
        print('  INK %s "%s" colour ref #%02x%02x%02x twin #%02x%02x%02x' % (('<<<' if cflag else '   ', text[:28]) + tuple(int(v) for v in ca) + tuple(int(v) for v in cb)))
print(n, 'INK OK (%d runs)' % checked if not bad else 'INK DIFF %d of %d runs' % (bad, checked))
