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
//
// DOCS=1: the docs pages (Dokumentacija) instead, where a click on a widget in the sidebar lands.
// Storybook's own page bound its Controls table to the first story of the file, an overview that
// ignores its args ("Vse različice", "Pregled"): every control there did nothing, and this script
// only looked at the stories. Per page (.storybook/preview.jsx, DocsPage):
// - LAYOUT: one story on top, the first with controls; the table right below it, bound to it, with
//   the rows of its Controls panel; the other stories below the table, none of them twice;
// - per change in the table (the same steps as above): NO EFFECT on the story on top, and STALE -
//   its HTML must equal the same story loaded in the canvas with the same args;
// - TAP: tapping the widget on top writes back to its control (TAPS).
import { createRequire } from 'module';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');

const want = process.argv.slice(2);
// MOBILE=1: the Gradniki - mobile stories instead (their panel is also checked against the
// Flutter catalog by controls.mjs; this adds NO EFFECT and the controls the catalog does not have)
const mobile = process.env.MOBILE === '1';
const docsMode = process.env.DOCS === '1';
const index = await (await fetch('http://localhost:6006/index.json')).json();
const entries = Object.values(index.entries);
const inScope = (e) => e.title.startsWith('Gradniki - mobile/') === mobile
  && (!want.length || want.some((w) => e.id.includes(w)));
const stories = entries.filter((e) => e.type === 'story' && inScope(e));
// the components' autodocs pages (not the MDX pages)
const docsPages = entries.filter((e) => e.type === 'docs' && e.tags?.includes('autodocs')
  && !e.tags.includes('unattached-mdx') && inScope(e));

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
// DOCS=1: a tap on the widget on top must change its control, as in the canvas.
// [docs id part, element in the story on top, where to tap (share of its width), control, state after]
const TAPS = [
  ['gradniki-mobile-drsnik', '.si-range-bar', 0.98, 'Vrednost', '100'],
  ['gradniki-mobile-izbira-potrditveno-polje', '.si-checkbox', 0.02, 'Označeno', 'true'],
  ['gradniki-mobile-izbira-preklopnik', '.si-switch__track', 0.5, 'Vklopljeno', 'true'],
];

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

const PANEL = '#storybook-panel-root table tbody tr';
const TABLE = '.docblock-argstable tbody tr';
// The controls in a table's rows (the Controls panel, a docs page's table). Runs in the page.
function readControls(rowSelector) {
  return [...document.querySelectorAll(rowSelector)].map((tr) => {
    const name = tr.querySelector('td')?.innerText.split('\n')[0].trim();
    const c = tr.lastElementChild;
    const sw = c.querySelector('input[role=switch]');
    const sel = c.querySelector('select');
    const radios = [...c.querySelectorAll('input[type=radio]')];
    const ta = c.querySelector('textarea, input[type=text]');
    const num = c.querySelector('input[type=number]');
    const range = c.querySelector('input[type=range]');
    const btn = c.querySelector('button');
    if (range) return { name, kind: 'range', id: range.id, value: range.value, min: range.min, max: range.max };
    if (sw) return { name, kind: 'bool', id: sw.id };
    if (sel) return { name, kind: 'select', id: sel.id, options: [...sel.options].map((o) => o.textContent.trim()).filter((t) => t && t !== 'Choose option...'), value: sel.selectedOptions[0]?.textContent.trim() };
    if (radios.length) return { name, kind: 'radio', options: radios.map((r) => r.id), labels: radios.map((r) => r.parentElement.innerText.trim()), value: radios.find((r) => r.checked)?.id };
    if (ta) return { name, kind: 'text', id: ta.id };
    if (num) return { name, kind: 'number', id: num.id, value: num.value };
    if (btn && /logičn|boolean/i.test(btn.innerText)) return { name, kind: 'setbool' };
    if (btn && /besedil|string/i.test(btn.innerText)) return { name, kind: 'settext' };
    if (btn && /števil|number/i.test(btn.innerText)) return { name, kind: 'setnumber' };
    return null;
  }).filter(Boolean);
}
function stepsOf(controls) {
  const steps = [];
  for (const c of controls) {
    if (c.kind === 'bool') steps.push({ c, v: 'toggle' });
    if (c.kind === 'select') for (const o of c.options) if (o !== c.value) steps.push({ c, v: o });
    if (c.kind === 'radio') c.options.forEach((o, i) => { if (o !== c.value) steps.push({ c, v: o, label: c.labels[i] }); });
    if (c.kind === 'text' || c.kind === 'settext') steps.push({ c, v: 'Besedilo testa' });
    if (c.kind === 'number') steps.push({ c, v: String(Number(c.value || 0) + 2) });
    // a slider (Kazalnik napredka, Prikaz korakov): both ends
    if (c.kind === 'range') for (const x of [c.min, c.max]) if (Number(x) !== Number(c.value)) steps.push({ c, v: x });
    if (c.kind === 'setnumber') steps.push({ c, v: '2' });
    if (c.kind === 'setbool') { steps.push({ c, v: 'false' }); steps.push({ c, v: 'true' }); }
  }
  return steps;
}
// the row of a control, by its name (runs in the page)
const clickSetButton = ([sel, name]) => [...document.querySelectorAll(sel)]
  .find((tr) => tr.querySelector('td')?.innerText.split('\n')[0].trim() === name)?.lastElementChild.querySelector('button')?.click();
const inputIdOf = ([sel, name]) => [...document.querySelectorAll(sel)]
  .find((tr) => tr.querySelector('td')?.innerText.split('\n')[0].trim() === name)?.lastElementChild.querySelector('input, textarea')?.id;
// the change itself, in the frame that holds the table
async function apply(frame, c, v) {
  if (c.kind === 'bool' || (c.kind === 'setbool' && v === 'true')) await frame.click(`label[for="${c.id}"]`);
  else if (c.kind === 'select') await frame.selectOption(`[id="${c.id}"]`, { label: v });
  else if (c.kind === 'radio') await frame.click(`label[for="${v}"]`);
  else if (c.kind !== 'setbool') await frame.fill(`[id="${c.id}"]`, v);
}

const b = await chromium.launch({ channel: 'msedge', args: ['--disable-lcd-text'] });
// The fresh load is the same manager page with the args in its URL: an iframe and a top-level
// page draw some things differently (the rounded inset outline of Harmonika differs at the corners).
const fresh = await (await b.newContext({ viewport: { width: 1400, height: 2400 } })).newPage();
let checked = 0, bad = 0, dead = 0;

if (docsMode) {
  // The DOM of a story as state, not as markup (runs in the page): a tree that was updated and one
  // mounted with the same args differ in attribute order, in the checked / value attributes (React
  // sets the properties on an update), in the order of inline style properties and in an empty
  // style="" the docs page leaves; React's ids (useId, react-aria) depend on where the tree is.
  const snapshot = (rootSelector) => {
    const ids = (s) => s.replace(/react-aria\d+-/g, 'RA-').replace(/_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g, 'ID');
    const out = [];
    const walk = (n, depth) => {
      if (n.nodeType === 3) {
        const t = n.textContent.replace(/\s+/g, ' ').trim();
        if (t) out.push(`${depth}"${t}"`);
        return;
      }
      if (n.nodeType !== 1) return;
      const attrs = [...n.attributes]
        .filter((a) => !['checked', 'value'].includes(a.name) && !(a.name === 'style' && !a.value.trim()))
        .map((a) => (a.name === 'style'
          ? `style=${a.value.split(';').map((d) => d.trim()).filter(Boolean).sort().join('; ')}`
          : `${a.name}=${ids(a.value)}`))
        .sort();
      if (n.type === 'checkbox' || n.type === 'radio') attrs.push(`:checked=${n.checked}`);
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(n.tagName)) attrs.push(`:value=${n.value}`);
      out.push(`${depth}<${n.tagName.toLowerCase()}${attrs.length ? ` ${attrs.join(' ')}` : ''}>`);
      for (const c of n.childNodes) walk(c, `${depth} `);
    };
    const root = document.querySelector(rootSelector);
    if (root) for (const c of root.childNodes) walk(c, '');
    return out.join('\n');
  };
  const firstDiff = (x, y) => {
    const a = x.split('\n'), c = y.split('\n');
    let i = 0;
    while (i < a.length && a[i] === c[i]) i++;
    return `line ${i + 1}: docs ${(a[i] || '(end)').trim().slice(0, 160)} / canvas ${(c[i] || '(end)').trim().slice(0, 160)}`;
  };
  // the story in the canvas, mounted with these args: Storybook writes them to the manager's URL
  // (its own encoding), then that URL is loaded again
  const canvasHtml = async (id, changed) => {
    await fresh.goto(`http://localhost:6006/?path=/story/${id}`, { waitUntil: 'networkidle' });
    await fresh.waitForSelector(PANEL, { timeout: 10000 }).catch(() => {});
    await fresh.waitForTimeout(600);
    let frame = await (await fresh.$('#storybook-preview-iframe')).contentFrame();
    const keys = Object.keys(changed);
    if (keys.length) {
      await frame.evaluate(([storyId, updatedArgs]) => window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId, updatedArgs }), [id, changed]);
      let last = null, since = 0;
      for (let t = 0; t < 5000; t += 100) {
        await fresh.waitForTimeout(100);
        const a = new URL(fresh.url()).searchParams.get('args') || '';
        if (a !== last) { last = a; since = t; } else if (a && t - since >= 500) break;
      }
      const inUrl = (new URL(fresh.url()).searchParams.get('args') || '').split(';').map((kv) => kv.split(':')[0].split(/[.[]/)[0]);
      const missing = keys.filter((k) => !inUrl.includes(k));
      if (missing.length) return { missing };
      await fresh.goto(fresh.url(), { waitUntil: 'networkidle' });
      await fresh.waitForSelector(PANEL, { timeout: 10000 }).catch(() => {});
      frame = await (await fresh.$('#storybook-preview-iframe')).contentFrame();
    }
    await frame.evaluate(() => document.fonts.ready);
    await fresh.waitForTimeout(900);
    return { html: await frame.evaluate(snapshot, '#storybook-root') };
  };
  for (const d of docsPages) {
    const report = [];
    const p = await (await b.newContext({ viewport: { width: 1400, height: 2400 } })).newPage();
    let topId = null;
    const open = async () => {
      await p.goto(`http://localhost:6006/?path=/docs/${d.id}`, { waitUntil: 'networkidle' });
      const f = await (await p.waitForSelector('#storybook-preview-iframe', { timeout: 20000 })).contentFrame();
      await f.waitForSelector('#storybook-docs .sb-story', { timeout: 60000 });
      if (topId) await f.waitForFunction((id) => document.getElementById(`story--${id}--primary-inner`)?.childElementCount > 0, topId, { timeout: 20000 });
      await f.waitForSelector(TABLE, { timeout: 5000 }).catch(() => {});
      await f.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(900);
      return f;
    };
    let f = await open();
    // the component's stories, as the docs page gets them
    const ids = entries.filter((e) => e.type === 'story' && e.title === d.title).map((e) => e.id);
    const info = await f.evaluate(async (list) => {
      const store = window.__STORYBOOK_PREVIEW__.storyStoreValue;
      const out = [];
      for (const storyId of list) {
        const s = await store.loadStory({ storyId });
        out.push({
          id: storyId,
          onPage: s.tags.includes('autodocs') && !s.usesMount,
          controls: !s.parameters.controls?.disable,
          rows: Object.values(s.argTypes).some((a) => !a.table?.disable),
        });
      }
      return out;
    }, ids);
    const onPage = info.filter((s) => s.onPage);
    const top = onPage.find((s) => s.controls) || onPage[0];
    topId = top.id;
    const withTable = top.controls && top.rows;
    const layout = await f.evaluate(() => {
      const docs = document.querySelector('#storybook-docs');
      const anchors = [...docs.querySelectorAll('[id^="anchor--"]')];
      const t = docs.querySelector('.docblock-argstable');
      return {
        anchors: anchors.map((a) => a.id),
        // eslint-disable-next-line no-bitwise
        aboveTable: t ? anchors.filter((a) => a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING).map((a) => a.id) : null,
        controlIds: t ? [...t.querySelectorAll('input, select, textarea')].map((c) => c.id).filter(Boolean) : [],
        rows: t ? [...t.querySelectorAll('tbody tr')].map((tr) => tr.querySelector('td')?.innerText.split('\n')[0].trim()) : [],
      };
    });
    const expected = [`anchor--primary--${top.id}`, ...onPage.filter((s) => s !== top).map((s) => `anchor--${s.id}`)];
    if (layout.anchors.join() !== expected.join()) report.push(`  LAYOUT stories ${layout.anchors.join(', ')}\n         expected ${expected.join(', ')}`);
    if (withTable) {
      if (!layout.aboveTable) report.push('  LAYOUT no Controls table');
      else {
        if (layout.aboveTable.join() !== `anchor--primary--${top.id}`) report.push(`  LAYOUT above the table: ${layout.aboveTable.join(', ')}`);
        const other = layout.controlIds.find((id) => !id.includes(`-${top.id}-`));
        if (other) report.push(`  LAYOUT the table drives ${other.replace(/^control-.*?(gradniki)/, '$1')}, not ${top.id}`);
        // its rows = the story's Controls panel
        await fresh.goto(`http://localhost:6006/?path=/story/${top.id}`, { waitUntil: 'networkidle' });
        await fresh.waitForSelector(PANEL, { timeout: 10000 }).catch(() => {});
        await fresh.waitForTimeout(600);
        const panel = await fresh.evaluate((sel) => [...document.querySelectorAll(sel)].map((tr) => tr.querySelector('td')?.innerText.split('\n')[0].trim()), PANEL);
        if (panel.join(' | ') !== layout.rows.join(' | ')) report.push(`  LAYOUT table rows ${layout.rows.join(' | ')}\n         panel      ${panel.join(' | ')}`);
      }
    } else if (layout.aboveTable) report.push(`  LAYOUT a Controls table, but ${top.id} has no controls`);
    if (report.length) {
      // how it looks to a user: the first control in the table - do its story's args change, and
      // does any story on the page (the table itself hidden) show it?
      const [c] = await f.evaluate(readControls, TABLE);
      const driven = ids.find((id) => layout.controlIds[0]?.includes(`-${id}-`));
      if (c && driven) {
        const page = async () => {
          const show = (v) => f.evaluate((x) => { document.querySelector('.docblock-argstable').style.visibility = x; }, v);
          await show('hidden');
          const shot = await (await f.$('#storybook-docs')).screenshot();
          await show('');
          return shot;
        };
        const argsOf = () => f.evaluate((id) => JSON.stringify(window.__STORYBOOK_PREVIEW__.storyStoreValue.args.argsByStoryId[id], (k, x) => (typeof x === 'function' ? undefined : x)), driven);
        const before = await page(), a0 = await argsOf();
        const [step] = stepsOf([c]);
        if (c.kind.startsWith('set')) await f.evaluate(clickSetButton, [TABLE, c.name]);
        else await apply(f, c, step.v);
        await p.waitForTimeout(1500);
        const moved = (await argsOf()) !== a0 ? `args of ${driven.split('--')[1]} changed` : `args of ${driven.split('--')[1]} did not change`;
        report.push(`  probe "${c.name}" → ${step.label || step.v}: ${moved}, ${unchanged(before, await page()) ? 'nothing on the page changed' : 'the page changed'}`);
      }
      bad++;
      console.log(`${d.id}: FAIL (layout)\n${report.join('\n')}`);
      await p.context().close();
      continue;
    }
    const steps = withTable ? stepsOf(await f.evaluate(readControls, TABLE)) : [];
    const boolEffect = {};
    for (const { c, v, label } of steps) {
      checked++;
      const shown = label || v;
      try {
        f = await open();
        // the table's control ids carry a react-aria id that is new on every load: find the
        // control again by its name (a radio option by its place)
        const cur = (await f.evaluate(readControls, TABLE)).find((x) => x.name === c.name && x.kind === c.kind);
        if (!cur) throw new Error(`no control "${c.name}" in the table`);
        const at = c.kind === 'radio' ? cur.options[c.options.indexOf(v)] : v;
        const block = async () => (await f.$(`#anchor--primary--${top.id}`)).screenshot();
        const argsNow = () => f.evaluate((id) => JSON.stringify(window.__STORYBOOK_PREVIEW__.storyStoreValue.args.argsByStoryId[id], (k, x) => (typeof x === 'function' ? undefined : x)), top.id);
        const before = await block();
        let a0 = await argsNow();
        if (c.kind.startsWith('set')) {
          await f.evaluate(clickSetButton, [TABLE, c.name]);
          await p.waitForTimeout(400);
          cur.id = await f.evaluate(inputIdOf, [TABLE, c.name]);
          if (!(c.kind === 'setbool' && v === 'false')) a0 = await argsNow();
        }
        await apply(f, cur, at);
        // the story's args change, then stay the same for 600 ms
        let args = await argsNow(), changedAt = 0;
        for (let t = 0; t < 5000; t += 100) {
          await p.waitForTimeout(100);
          const a = await argsNow();
          if (a !== args) { args = a; changedAt = t; continue; }
          if (a !== a0 && t - changedAt >= 600) break;
        }
        await p.waitForTimeout(400);
        const now = await block();
        const none = unchanged(before, now);
        if (c.kind === 'setbool') boolEffect[c.name] = (boolEffect[c.name] || false) || !none;
        else if (none) {
          const why = byDesign(top.id, c.name, shown);
          if (why) report.push(`  by design: "${c.name}" → ${shown} (${why})`);
          else { dead++; report.push(`  NO EFFECT "${c.name}" → ${shown}`); }
        }
        if (args === a0) { bad++; report.push(`  "${c.name}" → ${shown}: the story's args did not change`); continue; }
        if (moving(top.id, c.name)) { report.push(`  by design: "${c.name}" → ${shown} (animacija: izrisa sta dva trenutka)`); continue; }
        const html = await f.evaluate(snapshot, `[id="story--${top.id}--primary-inner"]`);
        const changed = await f.evaluate((id) => {
          const store = window.__STORYBOOK_PREVIEW__.storyStoreValue.args;
          const now = store.argsByStoryId[id] || {}, init = store.initialArgsByStoryId[id] || {};
          return Object.fromEntries(Object.keys(now)
            .filter((k) => typeof now[k] !== 'function' && JSON.stringify(now[k]) !== JSON.stringify(init[k]))
            .map((k) => [k, now[k]]));
        }, top.id);
        const canvas = await canvasHtml(top.id, changed);
        if (canvas.missing) report.push(`  "${c.name}" → ${shown}: the URL leaves out ${canvas.missing.join(', ')} (unsafe characters), not compared with the canvas`);
        else if (canvas.html !== html) { bad++; report.push(`  STALE "${c.name}" → ${shown}: HTML differs from the canvas with the same args\n    ${firstDiff(html, canvas.html)}`); }
      } catch (e) {
        bad++; report.push(`  ERROR "${c.name}" → ${shown}: ${String(e.message || e).split('\n').filter((l) => l.trim()).slice(0, 6).join(' | ')}`);
      }
    }
    for (const [name, showsSomething] of Object.entries(boolEffect)) {
      if (showsSomething) continue;
      const why = byDesign(top.id, name, null);
      if (why) report.push(`  by design: "${name}" (false / true) (${why})`);
      else { dead++; report.push(`  NO EFFECT "${name}" (false / true)`); }
    }
    for (const [, sel, share, name, after] of TAPS.filter(([part]) => d.id.includes(part))) {
      f = await open();
      const box = await (await f.$(`#story--${top.id}--primary-inner ${sel}`)).boundingBox();
      await p.mouse.click(box.x + box.width * share, box.y + box.height / 2);
      await p.waitForTimeout(800);
      const state = await f.evaluate(([rows, n]) => {
        const tr = [...document.querySelectorAll(rows)].find((r) => r.querySelector('td')?.innerText.split('\n')[0].trim() === n);
        const sw = tr?.querySelector('input[role=switch]');
        if (sw) return String(sw.checked);
        const r = tr && [...tr.querySelectorAll('input[type=radio]')].find((x) => x.checked);
        return r ? r.parentElement.innerText.trim() : null;
      }, [TABLE, name]);
      if (state === after) report.push(`  tap ${sel}: "${name}" → ${state}`);
      else { bad++; report.push(`  TAP ${sel}: "${name}" is ${state}, expected ${after}`); }
    }
    const where = `on top ${top.id.split('--')[1]}${withTable ? '' : ', no controls'}`;
    console.log(`${d.id}: ${report.some((r) => /STALE|ERROR|NO EFFECT|TAP |did not change/.test(r)) ? 'FAIL' : 'OK'} (${where}, ${steps.length} changes)`);
    if (report.length) console.log(report.join('\n'));
    await p.context().close();
  }
  console.log(`docs pages: ${docsPages.length}, changes checked: ${checked}, failures: ${bad}, no effect: ${dead}`);
  await b.close();
  process.exit(0);
}

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
    await p.waitForSelector(PANEL, { timeout: 10000 }).catch(() => {});
    await p.waitForTimeout(900);
  };
  // the whole visible preview, not #storybook-root's box: a dropdown or panel overflows it
  const preview = async () => {
    const iframe = await p.$('#storybook-preview-iframe');
    await (await iframe.contentFrame()).evaluate(() => document.fonts.ready);
    return iframe.screenshot();
  };
  await open();
  const controls = await p.evaluate(readControls, PANEL);
  if (!controls.length) { console.log(`${s.id}: no controls`); continue; }
  const steps = stepsOf(controls);
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
        await p.evaluate(clickSetButton, [PANEL, c.name]);
        await p.waitForTimeout(400);
        c.id = await p.evaluate(inputIdOf, [PANEL, c.name]);
        if (!(c.kind === 'setbool' && v === 'false')) a0 = urlArgs();
      }
      await apply(p, c, v);
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
      await fresh.waitForSelector(PANEL, { timeout: 10000 }).catch(() => {});
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
