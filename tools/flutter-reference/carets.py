"""Blank the carets of focused fields (reference JSON 'carets') in both images: Flutter draws a 2px
blinking caret, a browser a 1px one (hidden by compare.mjs). Used by shapediff / flatdiff / inkruns."""
from PIL import ImageDraw


def blank_carets(j, *images, pad=None):
    p = j.get('pad', 16) if pad is None else pad
    for im in images:
        d = ImageDraw.Draw(im)
        for c in j.get('carets', []):
            box = (int((c['x'] + p) * 2) - 2, int((c['y'] + p) * 2) - 2, int((c['x'] + c['w'] + p) * 2) + 2, int((c['y'] + c['h'] + p) * 2) + 2)
            # fill with the colour just left of the caret (the field background)
            x = max(0, box[0] - 3); y = min(im.height - 1, max(0, (box[1] + box[3]) // 2))
            d.rectangle(box, fill=im.getpixel((x, y)))
