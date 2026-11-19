// usage: node inkprobe.mjs <storyId> "<args>" <rootSel> <textSel> [fracY] "<css decl>" ...
// For each css override on textSel: ink top/bottom of the first match (dark-or-light vs local bg),
// relative to root, 2x. Root is moved to an integer pixel + fracY first.
import { createRequire } from 'module';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const [id, args, rootSel, textSel, fracY, ...decls] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 });
await p.goto(`http://localhost:6006/iframe.html?id=${id}&viewMode=story${args ? `&args=${args}` : ''}`, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
await p.evaluate(([rootSel, fy]) => {
  const r = document.querySelector(rootSel).getBoundingClientRect();
  const frac = (v) => v - Math.floor(v);
  document.getElementById('storybook-root').style.translate = `${-frac(r.x)}px ${fy - frac(r.y)}px`;
}, [rootSel, Number(fracY)]);
for (const decl of decls.length ? decls : ['']) {
  const tag = await p.addStyleTag({ content: decl ? `${textSel}{${decl} !important}` : "/**/" });
  await p.waitForTimeout(100);
  const info = await p.evaluate(([rootSel, textSel]) => {
    const rr = document.querySelector(rootSel).getBoundingClientRect();
    const e = document.querySelector(rootSel + ' ' + textSel) || document.querySelector(textSel);
    const range = document.createRange(); range.selectNodeContents(e);
    const r = range.getBoundingClientRect();
    return { rx: rr.x, ry: rr.y, x: r.x, y: r.y, w: r.width, h: r.height };
  }, [rootSel, textSel]);
  const clip = { x: Math.floor(info.x) - 2, y: Math.floor(info.y) - 6, width: Math.ceil(info.w) + 4, height: Math.ceil(info.h) + 12 };
  const png = PNG.sync.read(await p.screenshot({ clip }));
  const px = (x, y) => { const i = (png.width * y + x) << 2; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
  const bg = px(0, 0);
  let max = 0;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) { const q = px(x, y); max = Math.max(max, Math.abs(q[0] - bg[0]), Math.abs(q[1] - bg[1]), Math.abs(q[2] - bg[2])); }
  let top = -1, bottom = -1;
  for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++) { const q = px(x, y); if (Math.max(Math.abs(q[0] - bg[0]), Math.abs(q[1] - bg[1]), Math.abs(q[2] - bg[2])) > max * 0.55) { if (top < 0) top = y; bottom = y + 1; } }
  console.log(`${(decl || '(as is)').padEnd(34)} layout text top ${(info.y - info.ry).toFixed(2)}  ink ${(clip.y - info.ry + top / 2).toFixed(1)} .. ${(clip.y - info.ry + bottom / 2).toFixed(1)}`);
  await tag.evaluate((n) => n.remove());
}
await b.close();
