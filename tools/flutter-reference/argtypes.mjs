import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage();
const idx = await (await fetch('http://localhost:6006/index.json')).json();
const out = {};
for (const e of Object.values(idx.entries)) {
  if (!e.id.startsWith('gradniki-mobile-') || !e.id.endsWith('--default')) continue;
  await p.goto(`http://localhost:6006/iframe.html?id=${e.id}&viewMode=story`, { waitUntil: 'networkidle' });
  const r = await p.evaluate(async (id) => {
    const pv = window.__STORYBOOK_PREVIEW__;
    const store = pv.storyStoreValue || pv.storyStore;
    const s = await store.loadStory({ storyId: id });
    const at = {};
    for (const [k, v] of Object.entries(s.argTypes)) {
      if (v.table?.disable) continue;
      at[k] = { name: v.name, control: typeof v.control === 'object' ? v.control?.type : v.control, options: v.options, labels: v.control?.labels };
    }
    return { args: s.initialArgs, argTypes: at };
  }, e.id).catch((err) => ({ error: String(err) }));
  out[e.id] = r;
}
fs.writeFileSync('argtypes.json', JSON.stringify(out, null, 1));
for (const [id, r] of Object.entries(out)) console.log(id.replace('gradniki-mobile-', '').replace('--default', '').padEnd(46), r.error || Object.entries(r.argTypes).map(([k, v]) => `${k}${v.options ? `[${v.options.length}]` : ''}`).join(' '));
await b.close();
