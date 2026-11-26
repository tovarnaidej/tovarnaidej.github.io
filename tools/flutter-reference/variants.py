"""usage: python variants.py <shots_dir> <out_dir>
Vse različice next to the design_data PNG (3x Figma exports, shown at 1x): one image per widget,
PNG left, Storybook right, for a review by eye. Shots come from variants.mjs."""
import os, sys
from PIL import Image

DD = r'd:\projekti_tovarna\components\design_data'
PAIRS = {
    'harmonika': ['Accoridions.png'], 'avatar': ['Avatar.png'], 'gumb': ['Button.png'], 'kartica': ['Cards.png'],
    'filter': ['Filter.png'], 'gradnik-za-prisilno-posodobitev-aplikacije': ['Gradnik za prisilno posodobitev aplikacije.png', 'Prisilen update Pop-up pregled.png'],
    'iskalno-polje': ['Iskalno polje.png'], 'izbira-izbirni-gumb': ['Izbira - Izbirni gumb.png'],
    'izbira-potrditveno-polje': ['Izbira - Potrditveno polje.png'], 'izbira-preklopnik': ['Izbira - Preklopnik.png'],
    'koledar': ['Koledar.png', 'Koledar iOS.png'], 'vnosno-polje-za-datum': ['Koledar input.png'], 'kazalnik-napredka': ['Loading bar.png'],
    'navigacija-spodnji-meni': ['Navigacija - Spodnji meni.png'], 'navigacija-zgornji-meni': ['Navigacija - zgornji meni.png'],
    'obvestila': ['Obvestila.png'], 'opozorila': ['Opozorila.png'], 'vnosno-polje-za-telefonsko-številko': ['Phone number input.png'],
    'pojavno-okno': ['Pojavno okno.png'], 'prijava-si-pass': ['Prijava Si-PASS.png'],
    'prikaz-korakov': ['Progress bars.png', 'Progress bar with label.png', 'Vertical progress bar.png', 'linear progress bar with label.png'],
    'razdelilnik': ['Razdelilnik.png'], 'zavihki': ['Tabs.png'], 'vnosno-polje': ['Vnosna polja.png'], 'drsnik': ['slider.png'],
}
shots, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for key, pngs in PAIRS.items():
    shot = os.path.join(shots, key + '.png')
    if not os.path.exists(shot):
        print('no shot', key); continue
    twin = Image.open(shot).convert('RGB')
    refs = []
    for f in pngs:
        im = Image.open(os.path.join(DD, f)).convert('RGB')
        refs.append(im.resize((im.width // 3, im.height // 3), Image.LANCZOS))
    rw = max(r.width for r in refs); rh = sum(r.height for r in refs) + 8 * (len(refs) - 1)
    W, H = rw + 12 + twin.width, max(rh, twin.height)
    sheet = Image.new('RGB', (W, H), (255, 0, 255))
    y = 0
    for r in refs:
        sheet.paste(r, (0, y)); y += r.height + 8
    sheet.paste(twin, (rw + 12, 0))
    scale = min(1.0, 2400 / W)
    if scale < 1: sheet = sheet.resize((int(W * scale), int(H * scale)), Image.LANCZOS)
    sheet.save(os.path.join(out, key + '.jpg'), quality=85)
    print(key, sheet.size)
