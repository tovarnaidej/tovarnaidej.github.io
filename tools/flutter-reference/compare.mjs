// Work dir: $FLUTTER_REF_WORK (default <repo>/.flutter-ref), see README.md
// usage: node compare.mjs <flutterName> <storyId> <rootSelector> [args] [clickSelector]
// Compares text runs of the Flutter reference (sot_render/test/out/<name>.json) with the twin.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const HERE = (process.env.FLUTTER_REF_WORK || 'D:/projekti_tovarna/mslovenija_web/.flutter-ref').replace(/\/g, '/');
const [name, id, rootSel, args = '', click = ''] = process.argv.slice(2);
const OUT = fs.existsSync(`${HERE}/cat/test/out/${name}.json`) ? `${HERE}/cat/test/out` : `${HERE}/sot_render/test/out`;
const ref = JSON.parse(fs.readFileSync(`${OUT}/${name}.json`, 'utf8'));
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story${args ? `&args=${args}` : ''}`, { waitUntil: 'networkidle' });
let bg = '#ffffff';
try {
  const { PNG } = require('pngjs');
  const full = fs.existsSync(`${OUT}/${name}.full.png`);
  const png = PNG.sync.read(fs.readFileSync(full ? `${OUT}/${name}.full.png` : `${OUT}/${name}.png`));
  const px = full ? Math.max(0, Math.round((ref.x - 8) * 2)) : 4, py = full ? Math.max(0, Math.round((ref.y - 8) * 2)) : 4;
  const i = (png.width * Math.min(py, png.height - 1) + Math.min(px, png.width - 1)) << 2;
  bg = `rgb(${png.data[i]},${png.data[i + 1]},${png.data[i + 2]})`;
} catch (e) { console.log('bg sample failed', e.message); }
await p.addStyleTag({ content: `#storybook-root{margin:48px !important} html,body{background:${bg} !important}` });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
if (click) { await p.click(click); await p.waitForTimeout(400); }
const el = await p.$(rootSel);
if (!el) { console.log('ROOT NOT FOUND', rootSel); await b.close(); process.exit(1); }
const twin = await el.evaluate((root) => {
  const ASC = { 400: 0.916016, 500: 0.75, 700: 1.108887 };
  const rr = root.getBoundingClientRect();
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const text = n.textContent.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const e = n.parentElement;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    let hidden = false;
    for (let a = e; a && a !== root.parentElement; a = a.parentElement) if (getComputedStyle(a).opacity === '0') hidden = true;
    if (hidden) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0);
    if (!rects.length) continue;
    const top = Math.min(...rects.map((r) => r.top));
    const first = rects.filter((r) => Math.abs(r.top - top) < 2);
    const size = parseFloat(cs.fontSize);
    const w = Number(cs.fontWeight) >= 600 ? 700 : Number(cs.fontWeight) >= 500 ? 500 : 400;
    const left = Math.min(...rects.map((r) => r.left));
    const right = Math.max(...rects.map((r) => r.right));
    out.push({
      text, x: left - rr.left, w: right - left, baseline: top + Math.round(ASC[w] * size) - rr.top,
      size, weight: w, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color,
      lines: new Set(rects.map((r) => Math.round(r.top))).size, si: cs.fontFamily.includes('SI Republika'),
    });
  }
  return { w: rr.width, h: rr.height, texts: out };
});
const box = await el.boundingBox();
const pad = ref.pad ?? 16;
await p.screenshot({ path: `${OUT}/${name}.twin.png`, clip: { x: Math.round(box.x) - pad, y: Math.round(box.y) - pad, width: box.width + 2 * pad, height: box.height + 2 * pad } });
const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
console.log(`SIZE ref ${ref.w}x${ref.h}  twin ${twin.w}x${twin.h}  ${Math.abs(ref.w - twin.w) < 0.3 && Math.abs(ref.h - twin.h) < 0.3 ? 'OK' : '<<< DIFF'}`);
const used = new Set();
const norm = (s) => s.replace(/\s+/g, ' ').trim();
let bad = 0;
for (const r of ref.texts) {
  if (/^[\ue000-\uf8ff]$/.test(r.text)) continue;
  const rt = norm(r.text.replace('[editable] ', ''));
  if (!rt) continue;
  if (r.editable) { console.log(`    (editable "${rt.slice(0, 24)}" bl ${r.baseline.toFixed(2)} x ${r.x.toFixed(2)} — check image)`); continue; }
  let best = -1, bd = 1e9;
  twin.texts.forEach((t, i) => {
    if (used.has(i) || t.text !== rt) return;
    const d = Math.abs(t.x - r.x) + Math.abs(t.baseline - r.baseline);
    if (d < bd) { bd = d; best = i; }
  });
  if (best < 0) { console.log(`MISSING in twin: "${rt.slice(0, 40)}" (x ${r.x.toFixed(1)} bl ${r.baseline.toFixed(1)} ${r.weight} ${r.size})`); bad++; continue; }
  used.add(best);
  const t = twin.texts[best];
  const dx = t.x - r.x, db = t.baseline - r.baseline, dw = t.w - r.w;
  const styleDiff = [t.size !== r.size ? `size ${t.size}≠${r.size}` : '', r.weight && t.weight !== (r.weight >= 600 ? 700 : r.weight >= 500 ? 500 : 400) ? `weight ${t.weight}≠${r.weight}` : '', t.si ? '' : '!font', (r.lines ?? 1) !== t.lines ? `lines ${t.lines}≠${r.lines}` : ''].filter(Boolean).join(' ');
  const flag = Math.abs(dx) > 0.6 || Math.abs(db) > 0.6 || Math.abs(dw) > 0.8 || styleDiff;
  if (flag) bad++;
  if (flag || process.env.ALL) console.log(`${flag ? '<<<' : '   '} dx ${f(dx)} dbl ${f(db)} dw ${f(dw)}  ${String(r.weight).padEnd(4)}${r.size}/${r.lh ? (r.lh * r.size).toFixed(0) : '-'} ls ${r.ls ?? '-'} | twin lh ${t.lh} ls ${t.ls}  "${rt.slice(0, 28)}" ${styleDiff}`);
}
twin.texts.forEach((t, i) => { if (!used.has(i)) { console.log(`EXTRA in twin: "${t.text.slice(0, 40)}"`); bad++; } });
console.log(bad ? `${bad} issue(s)` : 'ALL TEXT RUNS MATCH (≤0.6px)');
await b.close();
