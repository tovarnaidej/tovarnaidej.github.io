// usage: node webcontrols.mjs [id-part ...]        (Storybook on :6006)
// The Controls panel of every story outside Gradniki - mobile (no catalog to compare with): each
// control is set to each of its other values in the panel, and the preview must then equal a
// fresh load with the same args (STALE otherwise: the control did nothing after the story
// mounted). Stories whose panel has no controls are skipped.
import { createRequire } from 'module';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');

const want = process.argv.slice(2);
const index = await (await fetch('http://localhost:6006/index.json')).json();
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.title.startsWith('Gradniki - mobile/')
  && (!want.length || want.some((w) => e.id.includes(w))));

function samePng(a, b) {
  const x = PNG.sync.read(a), y = PNG.sync.read(b);
  if (x.width !== y.width || x.height !== y.height) return `size ${x.width}x${x.height} vs ${y.width}x${y.height}`;
  let n = 0;
  for (let i = 0; i < x.data.length; i += 4) {
    if (Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i + 1] - y.data[i + 1]) + Math.abs(x.data[i + 2] - y.data[i + 2]) > 60) n++;
  }
  return n > 6 ? `${n} px differ` : '';
}

const b = await chromium.launch({ channel: 'msedge', args: ['--disable-lcd-text'] });
const fresh = await b.newPage({ viewport: { width: 1400, height: 1100 } });
let checked = 0, bad = 0;
let p = null;
for (const s of stories) {
  // a new context per story: the manager keeps its UI state in localStorage, and a state left by
  // one story's steps (a moved panel, a shortcut) made every click of the next one time out
  if (p) await p.context().close();
  p = await (await b.newContext({ viewport: { width: 1400, height: 2400 } })).newPage();
  const open = async () => {
    await p.goto(`http://localhost:6006/?path=/story/${s.id}`, { waitUntil: 'networkidle' });
    await p.waitForSelector('#storybook-panel-root', { timeout: 20000 });
    // the first load in a new context is slow: wait for the rows instead of a fixed time (a story
    // whose panel was not filled yet used to be skipped as one without controls)
    await p.waitForSelector('#storybook-panel-root table tbody tr', { timeout: 10000 }).catch(() => {});
    await p.waitForTimeout(900);
  };
  await open();
  const controls = await p.evaluate(() => [...document.querySelectorAll('#storybook-panel-root table tbody tr')].map((tr) => {
    const name = tr.querySelector('td')?.innerText.split('\n')[0].trim();
    const c = tr.lastElementChild;
    const sw = c.querySelector('input[role=switch]');
    const sel = c.querySelector('select');
    const radios = [...c.querySelectorAll('input[type=radio]')];
    const ta = c.querySelector('textarea, input[type=text]');
    if (sw) return { name, kind: 'bool', id: sw.id };
    if (sel) return { name, kind: 'select', id: sel.id, options: [...sel.options].map((o) => o.textContent.trim()).filter((t) => t && t !== 'Choose option...'), value: sel.selectedOptions[0]?.textContent.trim() };
    if (radios.length) return { name, kind: 'radio', options: radios.map((r) => r.id), value: radios.find((r) => r.checked)?.id };
    if (ta) return { name, kind: 'text', id: ta.id };
    return null;
  }).filter(Boolean));
  if (!controls.length) { console.log(`${s.id}: no controls`); continue; }
  const steps = [];
  for (const c of controls) {
    if (c.kind === 'bool') steps.push({ c, v: 'toggle' });
    if (c.kind === 'select') for (const o of c.options) if (o !== c.value) steps.push({ c, v: o });
    if (c.kind === 'radio') for (const o of c.options) if (o !== c.value) steps.push({ c, v: o });
    if (c.kind === 'text') steps.push({ c, v: 'Besedilo testa' });
  }
  const report = [];
  for (const { c, v } of steps) {
    checked++;
    try {
      await open();
      if (c.kind === 'bool') await p.click(`label[for="${c.id}"]`);
      else if (c.kind === 'select') await p.selectOption(`[id="${c.id}"]`, { label: v });
      else if (c.kind === 'radio') await p.click(`label[for="${v}"]`);
      else await p.fill(`[id="${c.id}"]`, v);
      let args = '';
      for (let t = 0; t < 4000; t += 100) {
        await p.waitForTimeout(100);
        const a = new URL(p.url()).searchParams.get('args') || '';
        if (a && a === args && t > 600) break;
        args = a;
      }
      const iframe = await p.$('#storybook-preview-iframe');
      const vp = await iframe.evaluate((f) => ({ width: f.clientWidth, height: f.clientHeight }));
      const inner = await iframe.contentFrame();
      await p.waitForTimeout(400);
      const now = await (await inner.$('#storybook-root')).screenshot();
      if (!args) { report.push(`  "${c.name}" → ${v}: not in the URL (cannot compare)`); continue; }
      await fresh.setViewportSize(vp);
      await fresh.goto(`http://localhost:6006/iframe.html?id=${s.id}&viewMode=story&args=${args}`, { waitUntil: 'networkidle' });
      await fresh.evaluate(() => document.fonts.ready);
      await fresh.waitForTimeout(700);
      const then = await (await fresh.$('#storybook-root')).screenshot();
      const d = samePng(now, then);
      if (d) { bad++; report.push(`  STALE "${c.name}" → ${v}: ${d} (args=${args})`); }
    } catch (e) {
      bad++; report.push(`  ERROR "${c.name}" → ${v}: ${String(e.message || e).split('\n').filter((l) => l.trim()).slice(0, 6).join(' | ')}`);
    }
  }
  console.log(`${s.id}: ${report.some((r) => /STALE|ERROR/.test(r)) ? 'FAIL' : 'OK'} (${steps.length} changes)`);
  if (report.length) console.log(report.join('\n'));
}
console.log(`changes checked: ${checked}, failing: ${bad}`);
await b.close();
