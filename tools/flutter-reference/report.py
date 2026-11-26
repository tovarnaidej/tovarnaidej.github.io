"""usage: python report.py <out_dir> <pass.out> [<ios pass.out> <ios work dir>]
A local gallery of a full pass (run in the work dir after fullpass.sh): for every case the Flutter
render, the twin and their difference (amplified x6, so a faint shadow or a half-pixel shift shows),
with the result of the four checks; grouped by widget, Android and iOS side by side.
Writes <out_dir>/index.html and <out_dir>/img/<platform>/<case>.jpg (not in git)."""
import sys, os, json, re, html
from PIL import Image, ImageChops

out_dir = sys.argv[1]
runs = [('Android', sys.argv[2], '.')]
if len(sys.argv) > 4:
    runs.append(('iOS', sys.argv[3], sys.argv[4]))


def parse(path):
    cases, cur = {}, None
    for line in open(path, encoding='utf8', errors='replace'):
        line = line.rstrip('\n')
        if line.startswith('=== '):
            cur = line[4:].strip(); cases[cur] = []
        elif cur and line.strip() and line.strip() != 'DONE':
            cases[cur].append(line)
    return cases


def verdict(lines):
    bad = [l for l in lines if '<<<' in l or 'DIFF' in l or 'MISSING' in l or 'FAILED' in l]
    return ('ok' if not bad else 'diff'), bad


# differences that are not the twin's: (platform or None for both, case name prefix) -> reason
KNOWN = [
    (None, 'filter__bar-multirow', 'SIFilterBar (Wrap) je širok kot najdaljša vrstica, dvojček 360; na tem okvirju ni nič narisano, čipi se ujemajo'),
    ('Android', 'status__popup', 'v katalogu je pojavno okno nad zatemnjenim katalogom, dvojček nad svojo podlago; okno samo se ujema'),
    (None, 'loading-bar__indeterminate-true', 'neskončna animacija: izrisa sta dva različna trenutka'),
    ('Android', 'phone__search-hr', 'Flutter test pri tem koraku ne zamenja zastavice'),
    ('iOS', 'filter__filters-badge', 'knjižnica na iOS dvigne števko za 1,5 pt (badgeDigitOffsetYIOS), da izravna CoreText na napravi; '
     'v testu CoreText ni, zato je števka v Flutter izrisu višje, kot je na iPhonu - dvojček kaže izid na napravi (enako kot Android)'),
    ('iOS', 'calendar__swipe-next', 'Flutter test vlečenja ne izvede (koledar ostane na istem mesecu)'),
]


def known(plat, name):
    return next((r for p, prefix, r in KNOWN if (p is None or p == plat) and name.startswith(prefix)), None)


def image(work, name, dest):
    d = os.path.join(work, 'cat/test/out/')
    jf, tf = d + name + '.json', d + name + '.twin.png'
    if not (os.path.exists(jf) and os.path.exists(tf) and os.path.exists(d + name + '.full.png')):
        return False
    j = json.load(open(jf, encoding='utf8')); p = j['pad']
    a = Image.open(d + name + '.full.png').convert('RGB').crop(
        (int((j['x'] - p) * 2), int((j['y'] - p) * 2), int((j['x'] + j['w'] + p) * 2), int((j['y'] + j['h'] + p) * 2)))
    b = Image.open(tf).convert('RGB')
    # the Flutter crop past the screen edge is black (a full-width widget): show the twin's pixels there
    full_w, full_h = Image.open(d + name + '.full.png').size
    offl = max(0, int(round((p - j['x']) * 2))); offt = max(0, int(round((p - j['y']) * 2)))
    offr = max(0, int(round((j['x'] + j['w'] + p) * 2 - full_w))); offb = max(0, int(round((j['y'] + j['h'] + p) * 2 - full_h)))
    if offl: a.paste(b.crop((0, 0, offl, b.height)), (0, 0))
    if offt: a.paste(b.crop((0, 0, b.width, offt)), (0, 0))
    if offr: a.paste(b.crop((a.width - offr, 0, a.width, b.height)), (a.width - offr, 0))
    if offb: a.paste(b.crop((0, a.height - offb, b.width, a.height)), (0, a.height - offb))
    w, h = max(a.width, b.width), max(a.height, b.height)
    A = Image.new('RGB', (w, h), 'white'); A.paste(a, (0, 0))
    B = Image.new('RGB', (w, h), 'white'); B.paste(b, (0, 0))
    diff = ImageChops.difference(A, B).convert('L').point(lambda v: min(255, v * 6))
    red = Image.new('RGB', (w, h), 'white'); red.paste((210, 0, 0), mask=diff)
    sheet = Image.new('RGB', (w * 3 + 20, h), (255, 0, 255))
    sheet.paste(A, (0, 0)); sheet.paste(B, (w + 10, 0)); sheet.paste(red, (2 * w + 20, 0))
    scale = min(1.0, 1500 / sheet.width)  # 2x renders: about 1x for the gallery
    sheet = sheet.resize((int(sheet.width * scale), int(sheet.height * scale)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    sheet.save(dest, quality=88)
    return True


groups = {}
totals = {}
for plat, path, work in runs:
    ok = exc = diff = 0
    for name, lines in parse(path).items():
        v, bad = verdict(lines)
        if v != 'ok' and known(plat, name):
            v = 'known'
        rel = f'img/{plat.lower()}/{name}.jpg'
        has = image(work, name, os.path.join(out_dir, rel))
        widget = re.split(r'__', name)[0]
        groups.setdefault(widget, []).append((plat, name, v, bad, rel if has else None))
        ok += v == 'ok'; exc += v == 'known'; diff += v == 'diff'
    totals[plat] = (ok, exc, diff)

parts = ["""<!doctype html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Flutter proti Storybooku</title>
<style>
:root{--bg:#f6f7f8;--fg:#1b1d1f;--muted:#5e6366;--ok:#1d7a3e;--bad:#b3261e;--warn:#8a5300;--card:#fff;--line:#d9dcde}
body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}
h1{font-size:20px;margin:0 0 4px}h2{font-size:16px;margin:28px 0 8px}
.sum{color:var(--muted);margin-bottom:12px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}nav a{padding:2px 8px;border:1px solid var(--line);border-radius:12px;text-decoration:none;color:var(--fg);background:var(--card)}
nav a.bad{border-color:var(--bad);color:var(--bad)}
.case{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px;margin:8px 0}
.case h3{font-size:13px;margin:0 0 6px;font-weight:600}.ok{color:var(--ok)}.diff{color:var(--bad)}.known{color:var(--warn)}
.case figure{display:inline-block;max-width:100%;margin:0}
.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;font-size:12px;color:var(--muted);margin-bottom:2px}
.case img{max-width:100%;height:auto;display:block;border:1px solid var(--line)}
.why{font-size:12px;color:var(--warn);margin:6px 0 0}
pre{white-space:pre-wrap;font-size:12px;color:var(--bad);margin:6px 0 0}
label{display:inline-flex;gap:6px;align-items:center;margin-left:12px}
body.only-diff .case.ok-case{display:none}
.legend{font-size:12px;color:var(--muted)}
</style></head><body>
<h1>Gradniki - mobile: Flutter katalog proti Storybooku</h1>"""]
summ = ' · '.join(f'{p}: {o} ujemanje, {k} znane izjeme, {d} drugih razlik' for p, (o, k, d) in totals.items())
parts.append(f'<div class="sum">{html.escape(summ)} <label><input type="checkbox" onchange="document.body.classList.toggle(\'only-diff\', this.checked)"> samo razlike</label></div>')
parts.append('<div class="legend">Vsaka slika ima tri stolpce: <b>levo Flutter izris</b> (mobilna knjižnica: katalog, izrisan v Flutter testu) | <b>sredina Storybook dvojček</b> | <b>desno razlika</b> (ojačana 6×; rdeča = razlika). Preverjanja: postavitev, črnilo in barva besedila, ploskve, ikone in oblike. Obrisi črk v razliki so različno mehčanje robov (dva izrisovalnika), ne premik; podlaga okrog gradnika je podlaga primerjave, ne del gradnika. <b>Znana izjema</b> je razlika, ki ni napaka dvojčka - razlog je zapisan pri primeru.</div>')
parts.append('<nav>' + ''.join(
    f'<a href="#{w}" class="{"bad" if any(c[2] == "diff" for c in cs) else ""}">{html.escape(w)}</a>' for w, cs in sorted(groups.items())) + '</nav>')
for w, cs in sorted(groups.items()):
    parts.append(f'<h2 id="{w}">{html.escape(w)}</h2>')
    for plat, name, v, bad, rel in sorted(cs, key=lambda c: (c[1], c[0])):
        cls = 'ok-case' if v == 'ok' else 'diff-case'
        label = {'ok': 'ujemanje', 'known': 'znana izjema', 'diff': 'razlika'}[v]
        parts.append(f'<div class="case {cls}"><h3>{html.escape(name)} · {plat} · <span class="{v}">{label}</span></h3>')
        if rel:
            parts.append('<figure><div class="cols"><span>Flutter (mobilna knjižnica)</span><span>Storybook (dvojček)</span>'
                         f'<span>razlika ×6</span></div><img loading="lazy" src="{rel}" alt="{html.escape(name)} {plat}"></figure>')
        if v == 'known':
            parts.append(f'<div class="why">Znana izjema: {html.escape(known(plat, name))}</div>')
        if bad:
            parts.append('<pre>' + html.escape('\n'.join(bad[:12])) + '</pre>')
        parts.append('</div>')
parts.append('</body></html>')
os.makedirs(out_dir, exist_ok=True)
open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf8').write('\n'.join(parts))
print('gallery', os.path.join(out_dir, 'index.html'), totals)
