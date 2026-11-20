"""usage: python blob.py <name> <hexcolor> [text]   (run in the work dir, after compare.mjs)
Position of a filled shape and of the text on it: for each text run whose box lies on a blob of
<hexcolor> (a badge, a selected day, an avatar), the blob's bounding box and the gaps between the
run's ink and the blob's edges, in the Flutter render and in the twin. Device pixels / 2."""
import sys, os, json
from PIL import Image
sys.stdout.reconfigure(encoding='utf8')
n = sys.argv[1]; col = sys.argv[2].lstrip('#'); only = sys.argv[3] if len(sys.argv) > 3 else None
C = tuple(int(col[i:i + 2], 16) for i in (0, 2, 4))
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
near = lambda q: max(abs(q[k] - C[k]) for k in range(3)) < 28

def measure(im, t):
    px = im.load(); W, H = im.size
    cx = int((t['x'] + t['w'] / 2 + p) * 2); cy = int((t['y'] + t['h'] / 2 + p) * 2)
    # seed: nearest blob pixel around the run's centre
    seed = None
    for r in range(0, 40):
        for dx, dy in ((r, 0), (-r, 0), (0, r), (0, -r)):
            x, y = cx + dx, cy + dy
            if 0 <= x < W and 0 <= y < H and near(px[x, y]): seed = (x, y); break
        if seed: break
    if not seed: return None
    seen = {seed}; todo = [seed]
    while todo and len(seen) < 60000:
        x, y = todo.pop()
        for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if q not in seen and 0 <= q[0] < W and 0 <= q[1] < H and near(px[q[0], q[1]]): seen.add(q); todo.append(q)
    xs = [q[0] for q in seen]; ys = [q[1] for q in seen]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    # ink: pixels inside the blob's box that are not the blob and are enclosed by it (holes)
    ink = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1) if (x, y) not in seen
           and max(abs(px[x, y][k] - C[k]) for k in range(3)) > 90
           and any((xx, y) in seen for xx in range(x0, x)) and any((xx, y) in seen for xx in range(x + 1, x1 + 1))
           and any((x, yy) in seen for yy in range(y0, y)) and any((x, yy) in seen for yy in range(y + 1, y1 + 1))]
    if not ink: return (x0, x1, y0, y1), None
    ix = [q[0] for q in ink]; iy = [q[1] for q in ink]
    return (x0, x1, y0, y1), (min(ix) - x0, x1 - max(ix), min(iy) - y0, y1 - max(iy))

for t in j['texts']:
    text = t['text'].strip()
    if not text or (only and text != only): continue
    ra, rb = measure(a, t), measure(b, t)
    if not ra or not rb or not ra[1] or not rb[1]: continue
    fa = lambda r: 'box x %.1f..%.1f y %.1f..%.1f  gaps L %.1f R %.1f T %.1f B %.1f' % (r[0][0] / 2 - p, (r[0][1] + 1) / 2 - p, r[0][2] / 2 - p, (r[0][3] + 1) / 2 - p, r[1][0] / 2, r[1][1] / 2, r[1][2] / 2, r[1][3] / 2)
    dv = max(abs(ra[1][k] - rb[1][k]) for k in range(4)) / 2; db = max(abs(ra[0][k] - rb[0][k]) for k in range(4)) / 2
    print('%s "%s"%s\n   ref  %s\n   twin %s' % (n, text[:20], '  <<<' if dv >= 1 or db >= 1 else '', fa(ra), fa(rb)))
