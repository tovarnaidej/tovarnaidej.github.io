// usage: node variants.mjs <shots_dir>   - a full-page shot (1x) of every Gradniki - mobile "Vse različice"
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const dir = process.argv[2];
fs.mkdirSync(dir, { recursive: true });
const index = await (await fetch('http://localhost:6006/index.json')).json();
const ids = Object.values(index.entries).filter((e) => e.type === 'story' && e.id.startsWith('gradniki-mobile-') && e.id.endsWith('--variants')).map((e) => e.id);
const b = await chromium.launch({ channel: 'msedge', args: ['--disable-lcd-text'] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
for (const id of ids) {
  await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(700);
  const key = id.replace('gradniki-mobile-', '').replace('--variants', '');
  await p.screenshot({ path: `${dir}/${key}.png`, fullPage: true });
  console.log(key);
}
await b.close();
