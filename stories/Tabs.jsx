import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './tabs.css';
import { useControlled } from './use-controlled';

/* Fiksno: Flutter's `TextOverflow.ellipsis` keeps the longest prefix that fits together
   with "…" and centres the shortened line (`TextAlign.center`). CSS `text-overflow` would
   leave it at the start of the box, so the same cut is made here by measuring. */
const TabLabel = ({ label, selected, truncate }) => {
  const box = useRef(null);
  const probe = useRef(null);
  const [shown, setShown] = useState(label);

  useLayoutEffect(() => {
    if (!truncate) {
      setShown(label);
      return undefined;
    }
    const fit = () => {
      if (!box.current || !probe.current) return;
      // Room from the tab itself (Expanded share of the row) and the label padding
      // clamp((tab - 24) / 2, 4, 16): the label box can still hold the previous text while the
      // row is re-laid out after a tab count change, the tab cannot.
      const tab = box.current.parentElement;
      const tw = tab.getBoundingClientRect().width;
      const pad = Math.min(16, Math.max(4, (tw - 24) / 2));
      const room = tw - 2 * pad;
      const width = (text) => {
        probe.current.textContent = text;
        return probe.current.getBoundingClientRect().width;
      };
      let next = label;
      if (width(label) > room + 0.01) {
        next = '…';
        for (let end = label.length - 1; end > 0; end -= 1) {
          const candidate = `${label.slice(0, end).trimEnd()}…`;
          if (width(candidate) <= room + 0.01) {
            next = candidate;
            break;
          }
        }
      }
      probe.current.textContent = '';
      setShown(next);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box.current.parentElement);
    // "…" in Medium comes from its own face (unicode-range U+2026), which the browser loads only
    // when the glyph is first drawn: a cut measured before that uses a wider fallback glyph
    // (5 tabs after a count change showed "Zav…" instead of "Zavi…"). Load it, then fit again.
    const cs = getComputedStyle(box.current);
    document.fonts?.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, `${label}…`).then(fit, fit);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [label, selected, truncate]);

  return (
    <span className="si-tabs__label" ref={box}>
      <span className="si-tabs__text" data-text={label}>
        {truncate ? shown : label}
      </span>
      <span className="si-tabs__probe" ref={probe} aria-hidden="true" />
    </span>
  );
};

TabLabel.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  truncate: PropTypes.bool.isRequired,
};

/* Curves.easeOut = Cubic(0.0, 0.0, 0.58, 1.0), solved for x */
const easeOut = (x) => {
  if (x <= 0 || x >= 1) return Math.min(1, Math.max(0, x));
  const bez = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 30; i += 1) {
    t = (lo + hi) / 2;
    if (bez(t, 0, 0.58) < x) lo = t; else hi = t;
  }
  return bez(t, 0, 1);
};

export const Tabs = ({
  style = 'underline',
  configuration = 'fixed',
  tabCount = 3,
  selectedIndex = 0,
  onTap,
  className = '',
}) => {
  const count = Number(tabCount);
  // The catalog keeps the tapped index and clamps it for the widget: 8 -> 3 tabs shows the
  // last tab selected, back to 8 shows tab 8 again.
  const [picked, setPicked] = useControlled(selectedIndex, onTap);
  const selected = Math.min(Math.max(Number(picked) || 0, 0), count - 1);
  const labels = Array.from({ length: count }, (_, i) => `Zavihek ${i + 1}`);
  const list = useRef(null);
  const anim = useRef(0);

  // _scrollToSelected: Pomakljivo puts the selected tab in the middle
  // (Scrollable.ensureVisible alignment 0.5, 220 ms, Curves.easeOut), after the first frame and
  // whenever the selection, the tab count or the configuration changes.
  useEffect(() => {
    const el = list.current;
    if (configuration !== 'scrollable' || !el) return undefined;
    const tab = el.children[selected];
    if (!tab) return undefined;
    const er = el.getBoundingClientRect(), tr = tab.getBoundingClientRect();
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.min(max, Math.max(0, el.scrollLeft + (tr.left + tr.width / 2) - (er.left + el.clientWidth / 2)));
    const frac0 = Number(el.style.getPropertyValue('--si-tabs-frac')) || 0;
    const start = el.scrollLeft + frac0;
    if (Math.abs(target - start) < 0.01) return undefined;
    const t0 = performance.now();
    cancelAnimationFrame(anim.current);
    // Chromium keeps scrollLeft on whole pixels (279 for Flutter's 279.48): the rest of the
    // offset moves the tabs (--si-tabs-frac), so the row lands where Flutter's does.
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 220);
      const off = start + (target - start) * easeOut(p);
      el.scrollLeft = Math.floor(off);
      el.style.setProperty('--si-tabs-frac', String(off - el.scrollLeft));
      if (p < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim.current);
  }, [selected, count, configuration]);

  return (
    <div
      ref={list}
      // a scroll by the user drops the sub-pixel rest of the last animated scroll
      onWheel={() => list.current?.style.removeProperty('--si-tabs-frac')}
      onPointerDown={() => list.current?.style.removeProperty('--si-tabs-frac')}
      className={[
        'si-tabs',
        `si-tabs--${style}`,
        `si-tabs--${configuration}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
    >
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={selected === index}
          aria-label={label}
          className={[
            'si-tabs__tab',
            selected === index ? 'si-tabs__tab--selected' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setPicked(index)}
        >
          <TabLabel
            label={label}
            selected={selected === index}
            truncate={configuration === 'fixed'}
          />
          {selected === index && style === 'underline' ? (
            <span className="si-tabs__pill" aria-hidden="true">
              <span className="si-tabs__pill-size">{label}</span>
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  style: PropTypes.oneOf(['underline', 'filled']),
  configuration: PropTypes.oneOf(['fixed', 'scrollable']),
  tabCount: PropTypes.oneOf([3, 4, 5, 8]),
  /** Tapped tab (may exceed the count: shown clamped, like the catalog). */
  selectedIndex: PropTypes.number,
  /** A tab was tapped: its index (the story keeps it for "Izbrano: …"). */
  onTap: PropTypes.func,
  className: PropTypes.string,
};
