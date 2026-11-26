import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/* Curves.easeInOut = Cubic(0.42, 0.0, 0.58, 1.0), solved for x */
export const easeInOut = (x) => {
  if (x <= 0 || x >= 1) return Math.min(1, Math.max(0, x));
  const bez = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 30; i += 1) {
    t = (lo + hi) / 2;
    if (bez(t, 0.42, 0.58) < x) lo = t;
    else hi = t;
  }
  return bez(t, 0, 1);
};

/**
 * The date pickers' PageView (months, year pages): the arrows slide to the next / previous page
 * (nextPage / previousPage, 300 ms, Curves.easeInOut); a horizontal drag moves the pages with the
 * pointer and lets go to the nearer page (or the one it was flung towards). `go(±1)` through the
 * ref is the arrow. A drag does not count as a tap on a day.
 */
export const Pager = forwardRef(({ page, onPage, renderPage, onMove, className, style }, ref) => {
  const box = useRef(null);
  const [x, setXState] = useState(0);
  const xRef = useRef(0);
  const anim = useRef(0);
  const drag = useRef(null);
  const moved = useRef(false);
  const setX = (v) => {
    xRef.current = v;
    setXState(v);
    onMove?.(v / (box.current?.getBoundingClientRect().width || 1));
  };
  const width = () => box.current?.getBoundingClientRect().width || 1;
  const animateTo = (target, dir, ms = 300) => {
    cancelAnimationFrame(anim.current);
    const from = xRef.current;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      setX(from + (target - from) * easeInOut(p));
      if (p < 1) anim.current = requestAnimationFrame(step);
      else {
        if (dir) onPage(page + dir);
        setX(0);
      }
    };
    anim.current = requestAnimationFrame(step);
  };
  useImperativeHandle(ref, () => ({ go: (dir) => animateTo(-dir * width(), dir) }));

  return (
    <div
      ref={box}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y', ...style }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        cancelAnimationFrame(anim.current);
        drag.current = { x0: e.clientX, from: xRef.current, t: performance.now(), last: e.clientX, v: 0 };
        moved.current = false;
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x0;
        if (!moved.current && Math.abs(dx) > 4) {
          moved.current = true;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }
        if (!moved.current) return;
        const now = performance.now();
        d.v = (e.clientX - d.last) / Math.max(1, now - d.t);
        d.last = e.clientX;
        d.t = now;
        setX(d.from + dx);
      }}
      onPointerUp={() => {
        const d = drag.current;
        drag.current = null;
        if (!d || !moved.current) return;
        const w = width();
        // PageScrollPhysics: the nearer page, or the next one in a fling's direction
        let dir = 0;
        if (xRef.current < -w / 2 || d.v < -0.3) dir = 1;
        else if (xRef.current > w / 2 || d.v > 0.3) dir = -1;
        animateTo(-dir * w, dir);
      }}
      onClickCapture={(e) => {
        if (moved.current) {
          e.stopPropagation();
          e.preventDefault();
          moved.current = false;
        }
      }}
    >
      <div style={{ position: 'relative', transform: `translateX(${x}px)` }}>
        <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%' }} aria-hidden="true">
          {renderPage(page - 1)}
        </div>
        <div className="si-pager__current">{renderPage(page)}</div>
        <div style={{ position: 'absolute', top: 0, left: '100%', width: '100%' }} aria-hidden="true">
          {renderPage(page + 1)}
        </div>
      </div>
    </div>
  );
});

Pager.displayName = 'Pager';

Pager.propTypes = {
  page: PropTypes.number.isRequired,
  onPage: PropTypes.func.isRequired,
  renderPage: PropTypes.func.isRequired,
  /** Offset of the pages, as a fraction of the width (negative: towards the next page). */
  onMove: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};
