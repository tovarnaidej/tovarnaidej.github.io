// Work dir: $FLUTTER_REF_WORK (see README.md). Storybook must run on :6006.
// usage: node controls.mjs [widget ...]        (after `flutter test test/controls_test.dart`)
//
// The Controls panel as a user uses it. For every state the catalog dump has
// (cat/test/out/controls/<widget>.json: default, one step, two steps, a tap on the preview):
//   1. open the story's Privzeto in the Storybook manager and replay the steps in the panel
//      (switch, chip -> select/radio, slider -> range/number, text emptied, tap on the twin);
//   2. PANEL  - the panel must show what the catalog shows: the same controls in the same
//      order, with the same labels, options and values (Platforma is Storybook's own);
//   3. STALE  - the preview after the steps must equal a fresh load of the same args
//      (a control that only seeds the twin's state changes the URL but not the preview).
// Flutter renders of those states are compared by fullpass.sh (compare.mjs AFTER_MOUNT=1).
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const HERE = (process.env.FLUTTER_REF_WORK || 'D:/projekti_tovarna/mslovenija_web/.flutter-ref').replace(/\\/g, '/');
const DUMP = `${HERE}/cat/test/out/controls`;
const only = process.argv.slice(2);

const rows = fs.readFileSync(`${HERE}/map.txt`, 'utf8').split('\n').filter((l) => l.trim()).map((l) => l.split('|'));
const story = Object.fromEntries(rows.map(([n, id, sel]) => [n, { id, sel }]));
story.calendar = { id: 'gradniki-mobile-koledar--default', sel: '.si-calendar, .si-cal-ios' };

// Storybook has these, the catalog does not (the device decides there).
const OWN = new Set(['Platforma']);
// Fields of the iOS catalog app that the Flutter (and Android) catalog fixes: Storybook has the
// fields of all three apps, shown as in the app that has them (iOS: always).
const IOS_FIELDS = {
  input: ['Besedilo', 'Besedilo napake'],
  'phone-input': ['Besedilo napake'],
  'search-bar': ['Besedilo'],
};
// Catalog controls a Storybook panel cannot show; what the twin has instead.
// Differences a Storybook control cannot avoid (reported as notes): a control's range is fixed,
// the catalog's "Trenutni korak" slider ends at Skupaj korakov (the story clamps the value).
const KNOWN = {
  'progress-bar': [/^"Trenutni korak" range 1\.\.\d+ vs 1\.\.10$/],
  // Oznaka shows only with Prikaži oznako, as in the iOS catalog (the Flutter one always shows it)
  checkbox: [/^missing "Oznaka"$/],
};
const NOT_IN_PANEL = {
  'progress-bar': { presets: 'the 0 / 25 / 50 / 100 buttons are shortcuts for the Vrednost slider' },
};
// States whose preview moves on its own (not compared as pictures): Kazalnik napredka, Animacija.

const norm = (s) => String(s).replace(/\s*[\d.,]+\s*%?(\s*\/\s*\d+)?\s*$/, '').trim();
const numIn = (s) => (String(s).match(/([\d.,]+)\s*%?(\s*\/\s*\d+)?\s*$/) || [])[1];

/** The catalog dump as the controls a user changes: headings name the slider or the row of
 * buttons under them ('Vrednost 50%' + 0 / 25 / 50 / 75 / 100 is one choice of five). */
function catalogControls(items) {
  const out = [];
  let heading = null;
  const vis = items.filter((c) => !c.hidden);
  for (let i = 0; i < vis.length; i++) {
    const c = vis[i];
    if (c.type === 'label') { heading = c.text; continue; }
    if (c.type === 'slider') { out.push({ name: norm(heading ?? ''), type: 'slider', value: c.value, min: c.min, max: c.max }); continue; }
    if (c.type === 'button') {
      const group = [c.label];
      while (vis[i + 1]?.type === 'button') group.push(vis[++i].label);
      const prev = out[out.length - 1];
      if (prev?.type === 'slider' && prev.name === norm(heading ?? '')) { prev.presets = group; continue; }
      out.push({ name: norm(heading ?? ''), type: 'enum', options: group, value: numIn(heading ?? '') });
      continue;
    }
    out.push({ name: c.label, type: c.type, value: c.value, options: c.options });
  }
  return out;
}

async function readPanel(p) {
  return p.evaluate(() => {
    const out = [];
    for (const tr of document.querySelectorAll('#storybook-panel-root table tbody tr')) {
      const cells = tr.querySelectorAll('td');
      if (cells.length < 2) continue;
      const name = cells[0].innerText.split('\n')[0].trim();
      const last = tr.lastElementChild;
      const sw = last.querySelector('input[role=switch]');
      const sel = last.querySelector('select');
      const radios = [...last.querySelectorAll('input[type=radio]')];
      const range = last.querySelector('input[type=range]');
      const num = last.querySelector('input[type=number]');
      const ta = last.querySelector('textarea, input[type=text]');
      if (sw) out.push({ name, type: 'bool', value: sw.checked });
      else if (sel) out.push({ name, type: 'enum', value: sel.selectedOptions[0]?.textContent.trim(), options: [...sel.options].map((o) => o.textContent.trim()).filter((t) => t && t !== 'Choose option...') });
      else if (radios.length) out.push({ name, type: 'enum', value: radios.find((r) => r.checked)?.value, options: radios.map((r) => r.value) });
      else if (range) out.push({ name, type: 'slider', value: Number(range.value), min: Number(range.min), max: Number(range.max) });
      else if (num) out.push({ name, type: 'slider', value: Number(num.value), min: Number(num.min), max: Number(num.max) });
      else if (ta) out.push({ name, type: 'text', value: ta.value });
      else out.push({ name, type: 'other', html: last.innerText.slice(0, 40) });
    }
    return out;
  });
}

/** Two controls can share a label (Vnosno polje: "Oznaka" position and "Oznaka" text): the
 * k-th of a name in the catalog is paired with the k-th in Storybook. */
function keyed(list) {
  const seen = {};
  return list.map((c) => {
    seen[c.name] = (seen[c.name] || 0) + 1;
    return { ...c, name: seen[c.name] > 1 ? `${c.name} #${seen[c.name]}` : c.name };
  });
}

function comparePanel(catIn, sbIn, w) {
  const diffs = [];
  const cat = keyed(catIn);
  const sbOwn = keyed(sbIn.filter((r) => !OWN.has(r.name) && !(IOS_FIELDS[w] || []).includes(r.name)));
  const cn = cat.map((c) => c.name), sn = sbOwn.map((r) => r.name);
  for (const n of cn) if (!sn.includes(n)) diffs.push(`missing "${n}"`);
  for (const n of sn) if (!cn.includes(n)) diffs.push(`extra "${n}"`);
  const common = cn.filter((n) => sn.includes(n));
  if (common.join('|') !== sn.filter((n) => cn.includes(n)).join('|')) diffs.push(`order catalog [${common.join(', ')}] storybook [${sn.filter((n) => cn.includes(n)).join(', ')}]`);
  for (const c of cat) {
    const r = sbOwn.find((x) => x.name === c.name);
    if (!r) continue;
    const t = c.type === 'enum' && r.type === 'enum' ? 'enum' : c.type;
    if (t !== r.type) { diffs.push(`"${c.name}" type ${c.type} vs ${r.type}`); continue; }
    if (t === 'enum') {
      if ((c.options || []).join('|') !== (r.options || []).join('|')) diffs.push(`"${c.name}" options [${c.options}] vs [${r.options}]`);
      if (String(c.value) !== String(r.value)) diffs.push(`"${c.name}" value ${c.value} vs ${r.value}`);
    } else if (t === 'slider') {
      if (Math.abs(Number(c.value) - Number(r.value)) > 0.006) diffs.push(`"${c.name}" value ${c.value} vs ${r.value}`);
      if (c.min !== undefined && (c.min !== r.min || c.max !== r.max)) diffs.push(`"${c.name}" range ${c.min}..${c.max} vs ${r.min}..${r.max}`);
    } else if (c.value !== r.value) diffs.push(`"${c.name}" value ${JSON.stringify(c.value)} vs ${JSON.stringify(r.value)}`);
  }
  return diffs;
}

// The control a step needs: two rows can share a label (Vnosno polje: "Oznaka" position and text).
const KIND = {
  bool: 'input[role=switch]', enum: 'select, input[type=radio]', text: 'textarea, input[type=text]',
  slider: 'input[type=range], input[type=number]', button: 'input[type=range], input[type=number], input[type=radio], select',
};

async function rowControl(p, name, kind) {
  return p.evaluateHandle(([name, sel]) => {
    for (const tr of document.querySelectorAll('#storybook-panel-root table tbody tr')) {
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 2 && cells[0].innerText.split('\n')[0].trim() === name && (!sel || tr.lastElementChild.querySelector(sel))) return tr.lastElementChild;
    }
    return null;
  }, [name, KIND[kind]]);
}

/** One catalog step, done in the Storybook panel (or on the twin). */
async function act(p, frame, w, step, catBefore) {
  const i = step.indexOf(':');
  const kind = step.slice(0, i), rest = step.slice(i + 1);
  const eq = rest.lastIndexOf('=');
  const label = eq < 0 ? rest : rest.slice(0, eq), value = eq < 0 ? '' : rest.slice(eq + 1);
  const cell = async (name) => {
    const h = await rowControl(p, name, kind);
    if (!(await h.evaluate((x) => !!x))) throw new Error(`no control "${name}" in the panel`);
    return h.asElement();
  };
  if (kind === 'bool') {
    const c = await cell(label);
    await (await c.$('label')).click();
  } else if (kind === 'enum') {
    const c = await cell(label);
    const sel = await c.$('select');
    if (sel) await sel.selectOption({ label: value });
    else await (await c.$(`label:has(input[value="${value}"])`) ?? await c.$(`text=${value}`)).click();
  } else if (kind === 'slider' || kind === 'button') {
    // the heading above the catalog slider (or above its row of buttons) names the control
    const items = catBefore.filter((c) => !c.hidden);
    let heading = null, target = null;
    for (const c of items) {
      if (c.type === 'label') heading = c.text;
      if (kind === 'slider' && c.type === 'slider' && Math.abs(c.y - Number(label)) < 0.5) { target = c; break; }
      if (kind === 'button' && c.type === 'button' && c.label === label) { target = c; break; }
    }
    const name = norm(heading ?? '');
    const c = await cell(name);
    const range = await c.$('input[type=range], input[type=number]');
    if (kind === 'button' && !range) {
      await (await c.$(`label:has(input[value="${label}"])`) ?? await c.$(`text=${label}`)).click();
    } else {
      const v = kind === 'button' ? Number(label) / 100 : value === 'min' ? Number(await range.getAttribute('min')) : Number(await range.getAttribute('max'));
      await range.evaluate((el, v) => {
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        set.call(el, String(v));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, v);
    }
  } else if (kind === 'text') {
    const c = await cell(label);
    await (await c.$('textarea, input[type=text]')).fill(value);
  } else if (kind === 'preview') {
    const at = { 'range-bar': [0.8, 0.5] }[w] || [0.5, 0.5];
    const el = frame.locator(story[w].sel).first();
    const box = await el.boundingBox();
    await el.click({ position: { x: box.width * at[0], y: box.height * at[1] } });
  }
  await p.waitForTimeout(450);
}

/** Same picture? Both are blurred by one pixel first: the manager's frame can have a fractional
 * size, so a centred widget lands a fraction of a pixel elsewhere than in a fresh load (anti-aliased
 * edges differ); a state that did not change (a mark, a colour, a moved thumb) still shows. */
function samePng(a, b) {
  const x = PNG.sync.read(a), y = PNG.sync.read(b);
  if (x.width !== y.width || x.height !== y.height) return `size ${x.width}x${x.height} vs ${y.width}x${y.height}`;
  const W = x.width, H = x.height;
  const blur = (d) => {
    const o = new Float32Array(W * H * 3);
    for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) for (let c = 0; c < 3; c++) {
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = xx + dx, Y = yy + dy;
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        s += d[(Y * W + X) * 4 + c]; n++;
      }
      o[(yy * W + xx) * 3 + c] = s / n;
    }
    return o;
  };
  const bx = blur(x.data), by = blur(y.data);
  let n = 0;
  for (let i = 0; i < bx.length; i += 3) {
    if (Math.abs(bx[i] - by[i]) + Math.abs(bx[i + 1] - by[i + 1]) + Math.abs(bx[i + 2] - by[i + 2]) > 45) n++;
  }
  return n > 3 ? `${n} px differ` : '';
}

const b = await chromium.launch({ channel: 'msedge' });
const OUTDIR = `${HERE}/controls-out`;
fs.mkdirSync(OUTDIR, { recursive: true });
let total = 0, bad = 0;
const names = (only.length ? only : Object.keys(story)).filter((n) => fs.existsSync(`${DUMP}/${n}.json`));
for (const w of names) {
  const dump = JSON.parse(fs.readFileSync(`${DUMP}/${w}.json`, 'utf8'));
  const base = dump.states.find((s) => s.path.length === 0);
  const p = await b.newPage({ viewport: { width: 1400, height: 2600 } });
  const fresh = await b.newPage({ viewport: { width: 1400, height: 1100 } });
  const report = [], notes = [];
  for (const s of dump.states) {
    // A step the catalog itself cannot take (Navigacija - zgornji meni has no preview pane to tap).
    if (s.error) { notes.push(`  [${s.path.join(' > ')}] not in the catalog: ${s.error}`); continue; }
    total++;
    const label = s.path.length ? s.path.join(' > ') : 'default';
    try {
      await p.goto(`http://localhost:6006/?path=/story/${story[w].id}`, { waitUntil: 'networkidle' });
      // a story without controls (Prijava SI-PASS, as the catalog) has no table in the panel
      await p.waitForSelector('#storybook-panel-root table tbody tr, #storybook-panel-root :text("not configured to handle controls"), #storybook-panel-root :text("This story is not configured")', { timeout: 20000 }).catch(() => {});
      const frame = p.frameLocator('#storybook-preview-iframe');
      await frame.locator('#storybook-root > *').first().waitFor({ timeout: 20000 });
      await p.waitForTimeout(600);
      let prev = base.controls;
      for (let k = 0; k < s.path.length; k++) {
        await act(p, frame, w, s.path[k], prev);
        prev = dump.states.find((x) => x.path.join('>') === s.path.slice(0, k + 1).join('>'))?.controls ?? prev;
      }
      const diffs = comparePanel(catalogControls(s.controls), await readPanel(p), w);
      // STALE: the preview now vs a fresh load with the same args. The manager writes the args
      // into its URL up to a second after a change: wait until every changed arg is there.
      const iframe = await p.$('#storybook-preview-iframe');
      const changed = await (await iframe.contentFrame()).evaluate(async (id) => {
        const st = window.__STORYBOOK_PREVIEW__.storyStoreValue;
        const init = (await st.loadStory({ storyId: id })).initialArgs, now = st.args.get(id);
        return Object.keys(now).filter((k) => JSON.stringify(now[k]) !== JSON.stringify(init[k]));
      }, story[w].id);
      let args = '';
      for (let t = 0; t < 5000; t += 100) {
        args = new URL(p.url()).searchParams.get('args') || '';
        const inUrl = args.split(';').filter(Boolean).map((x) => x.slice(0, x.indexOf(':')));
        if (changed.every((k) => inUrl.includes(k)) && inUrl.every((k) => changed.includes(k))) break;
        await p.waitForTimeout(100);
      }
      const inUrl = args.split(';').filter(Boolean).map((x) => x.slice(0, x.indexOf(':')));
      const missingInUrl = changed.filter((k) => !inUrl.includes(k));
      const vp = await iframe.evaluate((f) => ({ width: f.clientWidth, height: f.clientHeight }));
      const inner = await iframe.contentFrame();
      const rootBox = await (await inner.$('#storybook-root')).evaluate((r) => { const b = r.getBoundingClientRect(); return { bottom: b.bottom, right: b.right }; });
      if (rootBox.bottom > vp.height + 1 || rootBox.right > vp.width + 1) diffs.push(`(preview taller than the manager's frame: ${Math.round(rootBox.bottom)} > ${vp.height}, not compared)`);
      const shotNow = await (await inner.$('#storybook-root')).screenshot();
      const animated = /(^|;)indeterminate:!true/.test(args);
      if (missingInUrl.length) notes.push(`  [${label}] not compared with a fresh load: ${missingInUrl.join(', ')} cannot go into a URL`);
      if (!s.path.some((x) => x.startsWith('preview')) && !animated && !missingInUrl.length) {
        await fresh.setViewportSize(vp);
        await fresh.goto(`http://localhost:6006/iframe.html?id=${story[w].id}&viewMode=story${args ? `&args=${args}` : ''}`, { waitUntil: 'networkidle' });
        await fresh.evaluate(() => document.fonts.ready);
        await fresh.waitForTimeout(600);
        const shotFresh = await (await fresh.$('#storybook-root')).screenshot();
        const d = samePng(shotNow, shotFresh);
        if (d) {
          diffs.push(`STALE: preview after the steps differs from a fresh load (${d}) args=${args}`);
          const f = `${OUTDIR}/${w}__${label.replace(/[^\w=-]+/g, '_')}`;
          fs.writeFileSync(`${f}.now.png`, shotNow); fs.writeFileSync(`${f}.fresh.png`, shotFresh);
        }
      }
      const known = diffs.filter((d) => (KNOWN[w] || []).some((re) => re.test(d)));
      for (const d of known) notes.push(`  [${label}] known: ${d}`);
      const real = diffs.filter((d) => !known.includes(d));
      if (real.length) { bad++; report.push(`  [${label}]\n    ${real.join('\n    ')}`); }
    } catch (e) {
      bad++; report.push(`  [${label}] ERROR ${String(e.message || e).split('\n')[0]}`);
    }
  }
  console.log(`${w}: ${report.length ? 'FAIL' : 'OK'} (${dump.states.length} states)`);
  if (report.length) console.log(report.join('\n'));
  if (notes.length) console.log(notes.join('\n'));
  await p.close(); await fresh.close();
}
console.log(`states checked: ${total}, failing: ${bad}`);
await b.close();
