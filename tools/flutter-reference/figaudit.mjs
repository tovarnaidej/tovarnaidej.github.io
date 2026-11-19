// For every Figma export section: which css values have no counterpart in the twin's computed styles.
// usage: node figaudit.mjs [section name]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('D:/projekti_tovarna/mslovenija_web/package.json');
const { chromium } = require('playwright');
const P = 'gradniki-mobile-';
const MAP = {
  'Gumb': ['gumb'], 'Vnosna polja': ['vnosno-polje'], 'Izbira - potrditveno polje': ['izbira-potrditveno-polje'],
  'Izbira izbirni gumb': ['izbira-izbirni-gumb'], 'Izbira - preklopnik': ['izbira-preklopnik'],
  'Navigacija - spodnji meni': ['navigacija-spodnji-meni'], 'Navigacija - zgornji meni': ['navigacija-zgornji-meni'],
  'Koledar': ['koledar'], 'Koledar - IOS': ['koledar'], 'Pojavno okno': ['pojavno-okno'], 'Iskalno polje': ['iskalno-polje'],
  'Razdelilnik': ['razdelilnik'], 'Opozorila': ['opozorila'], 'Obvestila': ['obvestila'], 'Avatar': ['avatar'],
  'Harmonika': ['harmonika'], 'Kartica - Cards': ['kartica'], 'Filter': ['filter'], 'Koledar input': ['vnosno-polje-za-datum'],
  'Loading bar': ['kazalnik-napredka'], 'TABS': ['zavihki'], 'Progress bars': ['kazalnik-napredka'], 'Rangebar - drsnik': ['drsnik'],
  'Phone number input': ['vnosno-polje-za-telefonsko-številko'], 'Login SIPASS': ['prijava-si-pass'],
  'Prisilna posodobitev aplikacije': ['gradnik-za-prisilno-posodobitev-aplikacije'],
  'Prisilna posodobitev aplikacije - popup pogled': ['gradnik-za-prisilno-posodobitev-aplikacije'],
  'Progress bar with label': ['prikaz-korakov'], 'linear Progress bar with label': ['prikaz-korakov'], 'Vertical progress bar with label': ['prikaz-korakov'],
};
const sections = JSON.parse(fs.readFileSync('fig/sections.json', 'utf8'));
const only = process.argv[2];
const b = await chromium.launch({ channel: 'msedge' });
const page = await b.newPage({ viewport: { width: 1600, height: 1200 } });
const KEYS = ['text', 'pad', 'gap', 'rad', 'w', 'h', 'colors', 'borders', 'op', 'shadow'];
const blank = () => Object.fromEntries(KEYS.map((k) => [k, []]));
const cache = {};
async function collect(slug) {
  if (cache[slug]) return cache[slug];
  const all = blank();
  for (const st of ['variants', 'default']) {
    await page.goto(`http://localhost:6006/iframe.html?id=${P}${encodeURIComponent(slug)}--${st}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate((KEYS) => {
      const o = Object.fromEntries(KEYS.map((k) => [k, []]));
      const f = (v) => +parseFloat(v).toFixed(2);
      const add = (cs, rect, hasText) => {
        if (hasText) o.text.push([f(cs.fontSize), +cs.fontWeight, cs.lineHeight === 'normal' ? 'normal' : f(cs.lineHeight), cs.letterSpacing === 'normal' ? 0 : f(cs.letterSpacing), cs.color].join('|'));
        const bw = [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(f);
        const bc = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor];
        const pd = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(f);
        o.pad.push(pd.join(' ')); o.pad.push(pd.map((v, i) => +(v + bw[i]).toFixed(2)).join(' '));
        if (cs.rowGap !== 'normal') o.gap.push(f(cs.rowGap));
        if (cs.columnGap !== 'normal') o.gap.push(f(cs.columnGap));
        o.rad.push([cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map(f).join(' '));
        if (rect) { o.w.push(+rect.width.toFixed(2)); o.h.push(+rect.height.toFixed(2)); }
        else { if (cs.width.endsWith('px')) o.w.push(f(cs.width)); if (cs.height.endsWith('px')) o.h.push(f(cs.height)); }
        for (const k of ['color', 'backgroundColor', 'outlineColor', 'fill', 'stroke']) o.colors.push(cs[k]);
        for (const c of bc) o.colors.push(c);
        (cs.backgroundImage + ' ' + cs.boxShadow).replace(/rgba?\([^)]+\)/g, (m) => o.colors.push(m));
        bw.forEach((w, i) => { if (w) o.borders.push(w + '|' + bc[i]); });
        if (cs.outlineStyle !== 'none') o.borders.push(f(cs.outlineWidth) + '|' + cs.outlineColor);
        o.op.push(f(cs.opacity));
        if (cs.boxShadow !== 'none') o.shadow.push(cs.boxShadow);
      };
      for (const el of document.querySelectorAll('#storybook-root *')) {
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || el.tagName === 'INPUT';
        add(getComputedStyle(el), el.getBoundingClientRect(), hasText);
        for (const ps of ['::before', '::after']) {
          const cs = getComputedStyle(el, ps);
          if (cs.content !== 'none') add(cs, null, cs.content !== '""');
        }
      }
      return o;
    }, KEYS);
    for (const k of KEYS) all[k].push(...r[k]);
  }
  for (const k of KEYS) all[k] = [...new Set(all[k])];
  return (cache[slug] = all);
}
const fmt = (p) => (p.length === 4 && p[3] !== 1 ? `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${+p[3].toFixed(2)})` : `rgb(${p[0]}, ${p[1]}, ${p[2]})`);
const toRgb = (c) => {
  c = c.trim();
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((x) => x + x).join('');
    const n = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    if (h.length === 8) n.push(parseInt(h.slice(6), 16) / 255);
    return fmt(n);
  }
  m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) return fmt(m[1].split(',').map((x) => +x));
  return null;
};
const normCol = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); return m ? fmt(m[1].split(',').map((x) => +x)) : c; };
const px = (v) => v.split(/\s+/).map((x) => parseFloat(x));
const four = (a) => (a.length === 1 ? [a[0], a[0], a[0], a[0]] : a.length === 2 ? [a[0], a[1], a[0], a[1]] : a.length === 3 ? [a[0], a[1], a[2], a[1]] : a);
const near = (set, v, t = 0.5) => set.some((x) => Math.abs(x - v) <= t);
for (const [name, nodes] of Object.entries(sections)) {
  if (only && name !== only) continue;
  const tw = blank();
  for (const s of MAP[name]) { const c = await collect(s); for (const k of KEYS) tw[k].push(...c[k]); }
  const colors = new Set(tw.colors.map(normCol));
  const borders = tw.borders.map((x) => { const [w, c] = x.split('|'); return `${+w} ${normCol(c)}`; });
  const texts = tw.text.map((t) => { const p = t.split('|'); return { size: +p[0], w: +p[1], lh: p[2] === 'normal' ? 'normal' : +p[2], ls: +p[3], col: normCol(p[4]) }; });
  const miss = new Map();
  const add = (kind, val, node, hint = '') => {
    const k = `${kind}  ${val}`;
    if (!miss.has(k)) miss.set(k, { n: 0, ex: node.path + (node.text ? ` «${String(node.text).slice(0, 30)}»` : ''), hint });
    miss.get(k).n++;
  };
  for (const n of nodes) {
    const p = n.props;
    if (n.type === 'TEXT' && p['font-size']) {
      const size = parseFloat(p['font-size']);
      const w = +p['font-weight'] || 400;
      const lh = /px/.test(p['line-height'] || '') ? parseFloat(p['line-height']) : 'normal';
      const ls = parseFloat(p['letter-spacing']) || 0;
      const col = toRgb(p.color || '') || p.color;
      const ok = texts.some((t) => Math.abs(t.size - size) < 0.05 && t.w === w && (lh === 'normal' || (t.lh !== 'normal' && Math.abs(t.lh - lh) < 0.05)) && Math.abs(t.ls - ls) < 0.02 && t.col === col);
      if (!ok) {
        const cand = texts.filter((t) => Math.abs(t.size - size) < 0.05 && t.w === w).map((t) => `${t.lh}/${t.ls}/${t.col}`);
        add('TEXT', `${size}/${w} lh ${lh} ls ${ls} ${col}`, n, cand.length ? 'twin same size+weight: ' + [...new Set(cand)].slice(0, 6).join(' ; ') : 'no twin text with this size+weight');
      }
      continue;
    }
    if (n.depth === 0) continue;
    if (p.padding) { const v = four(px(p.padding)); if (!tw.pad.some((t) => t.split(' ').every((x, i) => Math.abs(+x - v[i]) <= 0.01))) add('padding', v.join(' '), n); }
    if (p.gap && !/auto/.test(p.gap)) for (const g of px(p.gap)) if (!near(tw.gap, g, 0.01)) add('gap', g, n);
    if (p['border-radius']) { const v = four(px(p['border-radius'])); if (!tw.rad.some((t) => t.split(' ').every((x, i) => Math.abs(+x - v[i]) <= 0.01 || (+x >= 50 && v[i] >= 50)))) add('radius', v.join(' '), n); }
    if (p.width && /px$/.test(p.width) && !near(tw.w, parseFloat(p.width))) add('width', p.width, n);
    if (p.height && /px$/.test(p.height) && !near(tw.h, parseFloat(p.height))) add('height', p.height, n);
    for (const k of ['background', 'color', 'fill', 'stroke']) {
      if (!p[k]) continue;
      const c = toRgb(p[k]);
      if (c ? !colors.has(c) : !/url|none/.test(p[k])) add(k, p[k].slice(0, 90), n);
    }
    for (const k of ['border', 'border-top', 'border-bottom', 'border-left', 'border-right']) {
      if (!p[k]) continue;
      const m = p[k].match(/([\d.]+)px\s+\w+\s+(.+)/);
      const c = m && toRgb(m[2]);
      if (!c || !borders.includes(`${+m[1]} ${c}`)) add(k, p[k], n);
    }
    if (p.opacity && !near(tw.op, +p.opacity, 0.005)) add('opacity', p.opacity, n);
    if (p['box-shadow']) add('shadow(manual)', p['box-shadow'], n, 'twin: ' + tw.shadow.slice(0, 3).join(' || '));
  }
  console.log(`\n=== ${name}  (${nodes.length} nodes, ${miss.size} values without counterpart)`);
  for (const [k, v] of [...miss].sort()) console.log(`  ${k}   x${v.n}   e.g. ${v.ex}${v.hint ? '\n        ' + v.hint : ''}`);
}
await b.close();
