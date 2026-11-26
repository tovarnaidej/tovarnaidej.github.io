// Work dir: $FLUTTER_REF_WORK (default <repo>/.flutter-ref), see README.md
// usage: node compare.mjs <flutterName> <storyId> <rootSelector> [args] [clickSelector]
// Compares text runs of the Flutter reference (sot_render/test/out/<name>.json) with the twin.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const HERE = (process.env.FLUTTER_REF_WORK || 'D:/projekti_tovarna/mslovenija_web/.flutter-ref').replace(/\\/g, '/');
const [name, id, rootSel, args = '', click = ''] = process.argv.slice(2);
const OUT = fs.existsSync(`${HERE}/cat/test/out/${name}.json`) ? `${HERE}/cat/test/out` : `${HERE}/sot_render/test/out`;
const ref = JSON.parse(fs.readFileSync(`${OUT}/${name}.json`, 'utf8'));
// Grayscale text anti-aliasing, as a phone draws it (Windows' LCD AA tints glyph edges and cores).
const b = await chromium.launch({ channel: 'msedge', args: ['--disable-lcd-text'] });
const p = await b.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 });
// AFTER_MOUNT=1: load the story with its default args and set the case's args afterwards, the way
// the Controls panel does (a twin that only seeds its state from a prop fails here, not on load).
const afterMount = process.env.AFTER_MOUNT === '1' && args;
await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story${args && !afterMount ? `&args=${args}` : ''}`, { waitUntil: 'networkidle' });
// Set args on the mounted story, typed by its argTypes (what a Controls panel change does).
async function setArgs(argStr) {
  await p.evaluate(async ([id, args]) => {
    const pv = window.__STORYBOOK_PREVIEW__;
    const story = await (pv.storyStoreValue || pv.storyStore).loadStory({ storyId: id });
    const updatedArgs = {};
    for (const pair of args.split(';').filter(Boolean)) {
      const i = pair.indexOf(':');
      const k = pair.slice(0, i), raw = decodeURIComponent(pair.slice(i + 1));
      const t = story.argTypes[k] || {};
      const ctl = typeof t.control === 'object' ? t.control?.type : t.control;
      let v = raw;
      if (raw === '!true' || raw === '!false') v = raw === '!true';
      else if (raw === '!null') v = null;
      else if (raw === '!undefined') v = undefined;
      else if (t.type?.name === 'number' || ctl === 'number' || ctl === 'range' || (t.options && t.options.includes(Number(raw)) && !t.options.includes(raw))) v = Number(raw);
      updatedArgs[k] = v;
    }
    await pv.onUpdateArgs({ storyId: id, updatedArgs });
  }, [id, argStr]);
  await p.waitForTimeout(500);
}
if (afterMount) {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await setArgs(args);
}
let bg = '#ffffff';
try {
  const { PNG } = require('pngjs');
  const full = fs.existsSync(`${OUT}/${name}.full.png`);
  const png = PNG.sync.read(fs.readFileSync(full ? `${OUT}/${name}.full.png` : `${OUT}/${name}.png`));
  const px = full ? Math.max(0, Math.round((ref.x - 8) * 2)) : 4, py = full ? Math.max(0, Math.round((ref.y - 8) * 2)) : 4;
  const i = (png.width * Math.min(py, png.height - 1) + Math.min(px, png.width - 1)) << 2;
  bg = `rgb(${png.data[i]},${png.data[i + 1]},${png.data[i + 2]})`;
} catch (e) { console.log('bg sample failed', e.message); }
// the caret is left out of the checks (blinking; 2px in Flutter, 1px here): carets.py
await p.addStyleTag({ content: `#storybook-root{margin:48px !important} html,body{background:${bg} !important} input,textarea{caret-color:transparent !important}` });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
// click: a selector (one click), or steps separated by ' ;; ' that mirror a man_test.dart case:
//   click:<sel>[@fx,fy]   press:<sel>[@fx,fy] (button held down while measuring)
//   type:<sel>=<text> (key by key)   key:<Key>   drag:<sel>@fx,fy>fx2,fy2   wait:<ms>
//   scroll:<sel> (into view, as tester.ensureVisible)   args:<k:v;k2:v2> (a control changed)
//   keys:<text> (typed into the focused field, key by key)   click?:<sel> (only if it is there)
// (fx, fy: fraction of the element's box; the middle when left out)
async function runSteps(steps) {
  const at = async (spec) => {
    const [sel, frac] = spec.split('@');
    const el = await p.waitForSelector(sel, { timeout: 10000 });
    const r = await el.boundingBox();
    const [fx, fy] = frac ? frac.split(',').map(Number) : [0.5, 0.5];
    return { x: r.x + r.width * fx, y: r.y + r.height * fy, r };
  };
  for (const step of (/^(click\??|press|type|keys|key|drag|wait|scroll|args):/.test(steps) ? steps.split(' ;; ') : [`click:${steps}`])) {
    const i = step.indexOf(':');
    const kind = step.slice(0, i), rest = step.slice(i + 1);
    if (kind === 'click') { const q = await at(rest); await p.mouse.click(q.x, q.y); }
    else if (kind === 'click?') { if (await p.$(rest.split('@')[0])) { const q = await at(rest); await p.mouse.click(q.x, q.y); } } // only if there
    else if (kind === 'press') { const q = await at(rest); await p.mouse.move(q.x, q.y); await p.mouse.down(); }
    else if (kind === 'type') { const [sel, ...t] = rest.split('='); await p.click(sel); await p.locator(sel).pressSequentially(t.join('='), { delay: 20 }); }
    else if (kind === 'key') await p.keyboard.press(rest);
    else if (kind === 'keys') await p.keyboard.type(rest, { delay: 20 }); // into the focused field
    else if (kind === 'drag') {
      const [sel, frac] = rest.split('@');
      const [a, z] = frac.split('>');
      const q = await at(`${sel}@${a}`);
      const [fx2, fy2] = z.split(',').map(Number);
      await p.mouse.move(q.x, q.y); await p.mouse.down();
      await p.mouse.move(q.r.x + q.r.width * fx2, q.r.y + q.r.height * fy2, { steps: 12 });
      await p.mouse.up();
    } else if (kind === 'wait') await p.waitForTimeout(Number(rest));
    else if (kind === 'scroll') await p.$eval(rest, (e) => e.scrollIntoView({ block: 'nearest', inline: 'start' }));
    else if (kind === 'args') await setArgs(rest);
    await p.waitForTimeout(kind === 'wait' ? 0 : 400);
  }
}
if (click) await runSteps(click);
const el = await p.$(rootSel);
if (!el) { console.log('ROOT NOT FOUND', rootSel); await b.close(); process.exit(1); }
// Put the twin on the same pixel fraction as the Flutter widget (a centred story lands on
// half pixels): glyphs snap to pixels, so inkruns.py needs both renders on the same grid.
await el.evaluate((root, [rx, ry]) => {
  const r = root.getBoundingClientRect();
  const frac = (v) => v - Math.floor(v);
  const shift = `${frac(rx) - frac(r.x)}px ${frac(ry) - frac(r.y)}px`;
  // A widget in a fixed layer (a dialog) moves itself: a transform on #storybook-root would make
  // the root the containing block of the fixed layer and move the dialog with it.
  let fixed = false;
  for (let a = root; a; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') fixed = true;
  (fixed ? root : document.getElementById('storybook-root')).style.translate = shift;
}, [ref.x ?? 0, ref.y ?? 0]);
const twin = await el.evaluate((root) => {
  const ASC = { 400: 0.916016, 500: 0.75, 700: 1.108887 };
  const ROBOTO = 0.927734; // the catalog's own texts (hhea 1900 / 2048)
  const rr = root.getBoundingClientRect();
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    // data-text: the full string of a label the twin shortens itself (Flutter reports the full text).
    const text = (n.parentElement.dataset.text ?? n.textContent).replace(/\s+/g, ' ').trim();
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
      text, x: left - rr.left, w: right - left, baseline: top + Math.round((cs.fontFamily.includes('Roboto') ? ROBOTO : ASC[w]) * size) - rr.top,
      size, weight: w, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color,
      // a fallback glyph (ellipsis) has its own rect top on the same line: lines are > 0.6em apart
      // shortened by CSS text-overflow: the range still spans the whole string
      clipped: cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1,
      cx: (left + right) / 2 - rr.left, cy: (top + Math.max(...rects.map((r) => r.bottom))) / 2 - rr.top,
      lines: rects.map((r) => r.top).sort((a, b) => a - b).filter((t, i, a) => i === 0 || t - a[i - 1] > size * 0.6).length, si: cs.fontFamily.includes('SI Republika'), font: cs.fontFamily,
    });
  }
  return { w: rr.width, h: rr.height, texts: out };
});
const box = await el.boundingBox();
const pad = ref.pad ?? 16;
await p.screenshot({ path: `${OUT}/${name}.twin.png`, clip: { x: Math.floor(box.x * 2) / 2 - pad, y: Math.floor(box.y * 2) / 2 - pad, width: box.width + 2 * pad, height: box.height + 2 * pad } });
const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
console.log(`SIZE ref ${ref.w}x${ref.h}  twin ${twin.w}x${twin.h}  ${Math.abs(ref.w - twin.w) < 0.3 && Math.abs(ref.h - twin.h) < 0.3 ? 'OK' : '<<< DIFF'}`);
const used = new Set();
const norm = (s) => s.replace(/\s+/g, ' ').trim();
let bad = 0;
for (const r of ref.texts) {
  if (/^[\ue000-\uf8ff]$/.test(r.text)) continue;
  const rt = norm(r.text.replace('[editable] ', ''));
  if (!rt) continue;
  if (r.editable || r.painted) {
    // TextField value / TextPainter text: no comparable run, the pixels are checked by inkruns.py
    const i = twin.texts.findIndex((t, k) => !used.has(k) && t.text === rt && t.cx > r.x - 2 && t.cx < r.x + r.w + 2 && t.cy > r.y - 2 && t.cy < r.y + r.h + 2);
    if (i >= 0) used.add(i);
    else if (r.painted) { console.log(`MISSING in twin: painted "${rt.slice(0, 40)}"`); bad++; }
    // an editable's value lives in the twin's <input>, which has no text node
    continue;
  }
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
  const styleDiff = [t.size !== r.size ? `size ${t.size}≠${r.size}` : '', r.weight && t.weight !== (r.weight >= 600 ? 700 : r.weight >= 500 ? 500 : 400) ? `weight ${t.weight}≠${r.weight}` : '', (r.family && !/Republika/.test(r.family) ? !/Roboto/.test(t.font || '') : !t.si) ? '!font' : '', (r.lines ?? 1) !== t.lines ? `lines ${t.lines}≠${r.lines}` : ''].filter(Boolean).join(' ');
  const flag = Math.abs(dx) > 0.6 || Math.abs(db) > 0.6 || (!t.clipped && Math.abs(dw) > 0.8) || styleDiff;
  if (flag) bad++;
  if (flag || process.env.ALL) console.log(`${flag ? '<<<' : '   '} dx ${f(dx)} dbl ${f(db)} dw ${f(dw)}  ${String(r.weight).padEnd(4)}${r.size}/${r.lh ? (r.lh * r.size).toFixed(0) : '-'} ls ${r.ls ?? '-'} | twin lh ${t.lh} ls ${t.ls}  "${rt.slice(0, 28)}" ${styleDiff}`);
}
// A lazy Flutter list builds only what is within its cache extent (250) of the viewport.
twin.texts.forEach((t, i) => { if (!used.has(i) && !(t.x > twin.w + 250 || t.x + t.w < -250)) { console.log(`EXTRA in twin: "${t.text.slice(0, 40)}"`); bad++; } });
console.log(bad ? `${bad} issue(s)` : 'ALL TEXT RUNS MATCH (≤0.6px)');
await b.close();
