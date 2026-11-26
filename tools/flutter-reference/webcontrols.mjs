// usage: node webcontrols.mjs [id-part ...]        (Storybook on :6006)
// The Controls panel of every story outside Gradniki - mobile (no catalog to compare with): each
// control is set to each of its other values in the panel. Two checks per change:
// - STALE: the preview must equal a fresh load with the same args (the control did nothing after
//   the story mounted);
// - NO EFFECT: the preview must differ from the one before the change. A story that renders a
//   showcase and ignores its args passed the first check (a fresh load ignores them too) while
//   every control in its panel did nothing. A change that shows nothing by design (an accessible
//   name, a CSS class, a link target, a Figma state that looks like the current one) is listed
//   with its reason from BY_DESIGN, not as a failure.
// Args without a value ("Nastavi logično vrednost / besedilo / število") are set first, then
// changed; for a boolean one of false / true is its default, so one of them must show. Object
// (JSON) controls are not set. Stories whose panel has no controls are listed.
import { createRequire } from 'module';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');

const want = process.argv.slice(2);
// MOBILE=1: the Gradniki - mobile stories instead (their panel is also checked against the
// Flutter catalog by controls.mjs; this adds NO EFFECT and the controls the catalog does not have)
const mobile = process.env.MOBILE === '1';
const index = await (await fetch('http://localhost:6006/index.json')).json();
const stories = Object.values(index.entries).filter((e) => e.type === 'story'
  && e.title.startsWith('Gradniki - mobile/') === mobile
  && (!want.length || want.some((w) => e.id.includes(w))));

// [story id part ('' = any), control name, value (null = any), why nothing shows]
const BY_DESIGN = [
  ['', 'Razred CSS', null, 'dodaten razred CSS'],
  ['search-iskalnik', 'Oznaka', null, 'vizualno skrita oznaka polja'],
  ['search-iskalnik--compact', 'Besedilo akcije', null, 'gumb je ikona, besedilo je njeno dostopno ime'],
  ['search-iskalnik--embedded-compact', 'Besedilo akcije', null, 'gumb je ikona, besedilo je njeno dostopno ime'],
  ['search-iskalnik--compact', 'Stanje', 'Rezultati (vrstica)', 'Figma: Compact Results je enak Default'],
  ['search-iskalnik--universal', 'Stanje', 'Izpolnjeno', 'polje z vrednostjo je že izpolnjeno'],
  ['search-iskalnik--universal', 'Stanje', 'Rezultati (vrstica)', 'obroba vrstice je enaka obrobi izpolnjenega polja'],
  ['search-iskalnik--results', 'Stanje', 'Izpolnjeno', 'polje z vrednostjo je že izpolnjeno'],
  ['search-iskalnik--results', 'Stanje', 'Rezultati (vrstica)', 'obroba vrstice je enaka obrobi izpolnjenega polja'],
  ['gumb-spletna-različica--text', 'Stanje', 'Pritisnjen', 'Figma: besedilni gumb ob pritisku nima drugega videza'],
  ['obvestilo', 'Povezava akcije', null, 'cilj povezave, videz ostane enak'],
  ['obvestilo', 'Pogled', 'Samodejno', 'sledi širini okna, ki je tu namizna'],
  // Gradniki - mobile (MOBILE=1): Platforma is Storybook's own; it changes what the device changes
  ['gradniki-mobile-gumb', 'Platforma', 'iOS', 'spremeni odziv ob pritisku (iOS prosojnost, Android poudarek)'],
  ['gradniki-mobile-izbira-izbirni-gumb', 'Platforma', 'iOS', 'spremeni odziv ob pritisku (iOS prosojnost 0,7)'],
  ['gradniki-mobile-izbira-potrditveno-polje', 'Platforma', 'iOS', 'spremeni odziv ob pritisku (iOS prosojnost 0,7)'],
  ['gradniki-mobile-navigacija-zgornji-meni', 'Platforma', 'iOS', 'spremeni gumbe zgornje vrstice dvovrstične glave (Srednja, Široka)'],
  ['gradniki-mobile-iskalno-polje', 'Platforma', 'iOS', 'spremeni dotično območje ikon (40 pt), ikona ostane na mestu'],
  ['gradniki-mobile-vnosno-polje--', 'Platforma', 'iOS', 'spremeni debelino obrobe v fokusu in pri napaki'],
  ['gradniki-mobile-vnosno-polje-za-datum', 'Platforma', 'iOS', 'izbere izbirnik datuma, ki se odpre ob ikoni'],
  // as in all three catalog apps
  ['gradniki-mobile-iskalno-polje', 'Avatarji rezultatov', null, 'kot v katalogih: vpliva, ko so rezultati prikazani'],
  ['gradniki-mobile-iskalno-polje', 'Zapri', null, 'kot v katalogih: gumb x in vzorčno besedilo, ko so rezultati prikazani'],
  ['gradniki-mobile-obvestila', 'Največje št. vrstic', null, 'privzeto sporočilo je v eni vrstici'],
  // the iOS catalog's fields, always shown as there
  ['gradniki-mobile-vnosno-polje--', 'Besedilo napake', null, 'kot v iOS appu: besedilo se pokaže ob vklopljeni Napaki'],
  ['gradniki-mobile-vnosno-polje-za-telefonsko', 'Besedilo napake', null, 'kot v iOS appu: besedilo se pokaže ob vklopljeni Napaki'],
  ['gradniki-mobile-iskalno-polje', 'Besedilo', null, 'kot v iOS appu: podvrstica rezultatov, ko so prikazani'],
];
// Changes after which the preview moves on its own: two renders are two moments, not comparable.
const MOVING = [['gradniki-mobile-kazalnik-napredka', 'Animacija']];
const moving = (id, name) => MOVING.some(([part, n]) => n === name && id.includes(part));
const byDesign = (id, name, v) => BY_DESIGN.find(([part, n, value]) => n === name && id.includes(part) && (value === null || value === v))?.[3];

function diffPixels(a, b, threshold) {
  const x = PNG.sync.read(a), y = PNG.sync.read(b);
  if (x.width !== y.width || x.height !== y.height) return Infinity;
  let n = 0;
  for (let i = 0; i < x.data.length; i += 4) {
    if (Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i + 1] - y.data[i + 1]) + Math.abs(x.data[i + 2] - y.data[i + 2]) > threshold) n++;
  }
  return n;
}
// two loads of the same state (the manager's iframe and a fresh one) may differ by anti-aliasing
const samePng = (a, b) => { const n = diffPixels(a, b, 60); return n > 6 ? (n === Infinity ? 'size differs' : `${n} px differ`) : ''; };
// before / after a change on the same page: nothing else moves, so a small colour change counts
// (Primarni #3c7b94 and Sekundarni #447972 differ by 44 in the sum of channels)
const unchanged = (a, b) => diffPixels(a, b, 12) <= 4;

const rowOf = (name) => [...document.querySelectorAll('#storybook-panel-root table tbody tr')]
  .find((tr) => tr.querySelector('td')?.innerText.split('\n')[0].trim() === name);

const b = await chromium.launch({ channel: 'msedge', args: ['--disable-lcd-text'] });
// The fresh load is the same manager page with the args in its URL: an iframe and a top-level
// page draw some things differently (the rounded inset outline of Harmonika differs at the corners).
const fresh = await (await b.newContext({ viewport: { width: 1400, height: 2400 } })).newPage();
let checked = 0, bad = 0, dead = 0;
let p = null;
for (const s of stories) {
  // a new context per story: the manager keeps its UI state in localStorage, and a state left by
  // one story's steps (a moved panel, a shortcut) made every click of the next one time out
  if (p) await p.context().close();
  p = await (await b.newContext({ viewport: { width: 1400, height: 2400 } })).newPage();
  const urlArgs = () => new URL(p.url()).searchParams.get('args') || '';
  const open = async () => {
    await p.goto(`http://localhost:6006/?path=/story/${s.id}`, { waitUntil: 'networkidle' });
    await p.waitForSelector('#storybook-panel-root', { timeout: 20000 });
    // the first load in a new context is slow: wait for the rows instead of a fixed time (a story
    // whose panel was not filled yet used to be skipped as one without controls)
    await p.waitForSelector('#storybook-panel-root table tbody tr', { timeout: 10000 }).catch(() => {});
    await p.waitForTimeout(900);
  };
  // the whole visible preview, not #storybook-root's box: a dropdown or panel overflows it
  const preview = async () => {
    const iframe = await p.$('#storybook-preview-iframe');
    await (await iframe.contentFrame()).evaluate(() => document.fonts.ready);
    return iframe.screenshot();
  };
  await open();
  const controls = await p.evaluate(() => [...document.querySelectorAll('#storybook-panel-root table tbody tr')].map((tr) => {
    const name = tr.querySelector('td')?.innerText.split('\n')[0].trim();
    const c = tr.lastElementChild;
    const sw = c.querySelector('input[role=switch]');
    const sel = c.querySelector('select');
    const radios = [...c.querySelectorAll('input[type=radio]')];
    const ta = c.querySelector('textarea, input[type=text]');
    const num = c.querySelector('input[type=number]');
    const btn = c.querySelector('button');
    if (sw) return { name, kind: 'bool', id: sw.id };
    if (sel) return { name, kind: 'select', id: sel.id, options: [...sel.options].map((o) => o.textContent.trim()).filter((t) => t && t !== 'Choose option...'), value: sel.selectedOptions[0]?.textContent.trim() };
    if (radios.length) return { name, kind: 'radio', options: radios.map((r) => r.id), labels: radios.map((r) => r.parentElement.innerText.trim()), value: radios.find((r) => r.checked)?.id };
    if (ta) return { name, kind: 'text', id: ta.id };
    if (num) return { name, kind: 'number', id: num.id, value: num.value };
    if (btn && /logičn|boolean/i.test(btn.innerText)) return { name, kind: 'setbool' };
    if (btn && /besedil|string/i.test(btn.innerText)) return { name, kind: 'settext' };
    if (btn && /števil|number/i.test(btn.innerText)) return { name, kind: 'setnumber' };
    return null;
  }).filter(Boolean));
  if (!controls.length) { console.log(`${s.id}: no controls`); continue; }
  const steps = [];
  for (const c of controls) {
    if (c.kind === 'bool') steps.push({ c, v: 'toggle' });
    if (c.kind === 'select') for (const o of c.options) if (o !== c.value) steps.push({ c, v: o });
    if (c.kind === 'radio') c.options.forEach((o, i) => { if (o !== c.value) steps.push({ c, v: o, label: c.labels[i] }); });
    if (c.kind === 'text' || c.kind === 'settext') steps.push({ c, v: 'Besedilo testa' });
    if (c.kind === 'number') steps.push({ c, v: String(Number(c.value || 0) + 2) });
    if (c.kind === 'setnumber') steps.push({ c, v: '2' });
    if (c.kind === 'setbool') { steps.push({ c, v: 'false' }); steps.push({ c, v: 'true' }); }
  }
  const report = [];
  const boolEffect = {};
  for (const { c, v, label } of steps) {
    checked++;
    const shown = label || v;
    try {
      await open();
      const before = await preview();
      let a0 = urlArgs();
      if (c.kind.startsWith('set')) {
        // the arg has no value: its button sets one (false / '' / 0) and shows the control
        await p.evaluate(([src, name]) => eval(src)(name)?.lastElementChild.querySelector('button')?.click(), [rowOf.toString(), c.name]); // eslint-disable-line no-eval
        await p.waitForTimeout(400);
        c.id = await p.evaluate(([src, name]) => eval(src)(name)?.lastElementChild.querySelector('input, textarea')?.id, [rowOf.toString(), c.name]); // eslint-disable-line no-eval
        if (!(c.kind === 'setbool' && v === 'false')) a0 = urlArgs();
      }
      if (c.kind === 'bool' || (c.kind === 'setbool' && v === 'true')) await p.click(`label[for="${c.id}"]`);
      else if (c.kind === 'select') await p.selectOption(`[id="${c.id}"]`, { label: v });
      else if (c.kind === 'radio') await p.click(`label[for="${v}"]`);
      else if (c.kind !== 'setbool') await p.fill(`[id="${c.id}"]`, v);
      // the URL must show the change (a value typed after "Nastavi ..." reaches it later than the
      // button's own value), then stay the same for 600 ms
      let args = urlArgs(), changedAt = 0;
      // an arg set with "Nastavi ...": its first value (false / '') may reach the URL after the
      // change, so wait for the value itself
      const expected = c.kind.startsWith('set') && `${c.id.replace(/^control-/, '')}:${v === 'true' || v === 'false' ? `!${v}` : v}`;
      for (let t = 0; t < 5000; t += 100) {
        await p.waitForTimeout(100);
        const a = urlArgs();
        if (a !== args) { args = a; changedAt = t; continue; }
        if (expected ? a.split(';').includes(expected) && t - changedAt >= 300 : a !== a0 && t - changedAt >= 600) break;
      }
      const iframe = await p.$('#storybook-preview-iframe');
      await p.waitForTimeout(400);
      const now = await preview();
      const none = unchanged(before, now);
      if (c.kind === 'setbool') boolEffect[c.name] = (boolEffect[c.name] || false) || !none;
      else if (none) {
        const why = byDesign(s.id, c.name, shown);
        if (why) report.push(`  by design: "${c.name}" → ${shown} (${why})`);
        else { dead++; report.push(`  NO EFFECT "${c.name}" → ${shown}`); }
      }
      if (!args) { report.push(`  "${c.name}" → ${shown}: not in the URL (cannot compare)`); continue; }
      if (moving(s.id, c.name)) { report.push(`  by design: "${c.name}" → ${shown} (animacija: izrisa sta dva trenutka)`); continue; }
      // Storybook leaves values with unsafe characters (a comma, č) out of the URL: a fresh load
      // would get the story's own value for them, so it cannot be compared
      const missing = await (await iframe.contentFrame()).evaluate((id) => {
        const store = window.__STORYBOOK_PREVIEW__?.storyStoreValue?.args;
        const now = store?.argsByStoryId?.[id] || {}, init = store?.initialArgsByStoryId?.[id] || {};
        return Object.keys(now).filter((k) => typeof now[k] !== 'function' && JSON.stringify(now[k]) !== JSON.stringify(init[k]));
      }, s.id).then((changed) => changed.filter((k) => !args.split(';').some((kv) => kv.split(':')[0] === k)));
      if (missing.length) { report.push(`  "${c.name}" → ${shown}: the URL leaves out ${missing.join(', ')} (unsafe characters), not compared with a fresh load`); continue; }
      await fresh.goto(`http://localhost:6006/?path=/story/${s.id}&args=${args}`, { waitUntil: 'networkidle' });
      await fresh.waitForSelector('#storybook-panel-root table tbody tr', { timeout: 10000 }).catch(() => {});
      const freshFrame = await fresh.$('#storybook-preview-iframe');
      await (await freshFrame.contentFrame()).evaluate(() => document.fonts.ready);
      await fresh.waitForTimeout(900);
      const then = await freshFrame.screenshot();
      const d = samePng(now, then);
      if (d) { bad++; report.push(`  STALE "${c.name}" → ${shown}: ${d} (args=${args})`); }
    } catch (e) {
      bad++; report.push(`  ERROR "${c.name}" → ${shown}: ${String(e.message || e).split('\n').filter((l) => l.trim()).slice(0, 6).join(' | ')}`);
    }
  }
  for (const [name, showsSomething] of Object.entries(boolEffect)) {
    if (showsSomething) continue;
    const why = byDesign(s.id, name, null);
    if (why) report.push(`  by design: "${name}" (false / true) (${why})`);
    else { dead++; report.push(`  NO EFFECT "${name}" (false / true)`); }
  }
  console.log(`${s.id}: ${report.some((r) => /STALE|ERROR|NO EFFECT/.test(r)) ? 'FAIL' : 'OK'} (${steps.length} changes)`);
  if (report.length) console.log(report.join('\n'));
}
console.log(`changes checked: ${checked}, stale or error: ${bad}, no effect: ${dead}`);
await b.close();
