"""usage: python painted.py <name> [zoom.png]   (work dir, after compare.mjs)
Every SIAvatar ('painted' entry) of a reference: gaps between the initials' ink and the circle's
box, and the circle's fill at four points, in the Flutter render and in the twin."""
import sys, os, json
from PIL import Image
sys.stdout.reconfigure(encoding='utf8')
n = sys.argv[1]
d = 'cat/test/out/' if os.path.exists('cat/test/out/' + n + '.json') else 'sot_render/test/out/'
j = json.load(open(d + n + '.json', encoding='utf8')); p = j['pad']
a = Image.open(d + n + '.full.png').convert('RGB').crop((int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
b = Image.open(d + n + '.twin.png').convert('RGB')
tiles = []
for t in j['texts']:
    if not t.get('painted'): continue
    box = (int((t['x'] + p) * 2), int((t['y'] + p) * 2), int((t['x'] + t['w'] + p) * 2), int((t['y'] + t['h'] + p) * 2))
    out = []
    for im in (a, b):
        c = im.crop(box); px = c.load(); W, H = c.size
        fill = px[W // 2, 3]  # just inside the top of the circle
        r = W / 2 * 0.8
        ink = [(x, y) for y in range(H) for x in range(W) if (x - W / 2) ** 2 + (y - H / 2) ** 2 < r * r
               and max(abs(px[x, y][k] - px[W // 2, max(3, y * 0 + 3)][k]) for k in range(3)) > 70]
        if not ink: out.append('no ink'); continue
        xs = [q[0] for q in ink]; ys = [q[1] for q in ink]
        out.append('gaps L %.1f R %.1f T %.1f B %.1f | fill top %s left %s bottom %s' % (min(xs) / 2, (W - 1 - max(xs)) / 2, min(ys) / 2, (H - 1 - max(ys)) / 2, px[W // 2, 3], px[3, H // 2], px[W // 2, H - 4]))
        tiles.append(c)
    print('%s "%s" %sx%s at %.1f,%.1f\n   ref  %s\n   twin %s' % (n, t['text'], t['w'], t['h'], t['x'], t['y'], out[0], out[1]))
if len(sys.argv) > 2 and tiles:
    Z = 6; w = Image.new('RGB', (sum(c.width for c in tiles) * Z + 10 * len(tiles), max(c.height for c in tiles) * Z), 'red'); x = 0
    for c in tiles: w.paste(c.resize((c.width * Z, c.height * Z), Image.NEAREST), (x, 0)); x += c.width * Z + 10
    w.save(sys.argv[2])
