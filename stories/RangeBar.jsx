import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './mobile-tokens.css';
import './range-bar.css';
import { useControlled } from './use-controlled';

/**
 * Twin of SIRangeBar (components/flutter/lib/src/components/range_bar/si_range_bar.dart).
 * Geometry in CSS custom properties: track from 16 to width-16, thumb travel inset 19,
 * ticks inset 18 from the track ends.
 */
export const RangeBar = ({
  value = 0.5,
  showTicks = true,
  tickCount = 5,
  className = '',
  onChange,
}) => {
  const ref = useRef(null);
  const dragging = useRef(false);
  const clamp = (v) => Math.min(1, Math.max(0, Number(v) || 0));
  // One value for the bar and the "Vrednost" control, as in the catalog.
  const [current, setCurrent] = useControlled(clamp(value), onChange);
  const count = Math.min(Math.max(Number(tickCount) || 5, 2), 32);
  // _effectiveDivisions: tickCount - 1 with ticks, none without
  const divisions = showTicks ? count - 1 : null;

  // _applyDx: travel from 16 + 19 to width - 16 - 19 (_RangeBarGeometry), snapped to the divisions
  const fromX = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    const usable = Math.max(0, r.width - 2 * (16 + 19));
    let t = usable > 0 ? Math.min(1, Math.max(0, (clientX - r.left - 35) / usable)) : 0;
    if (divisions) t = Math.round(t * divisions) / divisions;
    return t;
  };
  const apply = (clientX) => {
    const v = fromX(clientX);
    if (v !== current) setCurrent(v);
  };

  return (
    <div
      ref={ref}
      className={['si-range-bar', className].filter(Boolean).join(' ')}
      style={{ '--si-range-p': current }}
      // GestureDetector: onTapDown and onHorizontalDragUpdate both set the value
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        apply(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && apply(e.clientX)}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      <span className="si-range-bar__track" />
      {current > 0 && <span className="si-range-bar__fill" />}
      {showTicks && (
        <span className="si-range-bar__ticks" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="si-range-bar__tick" style={{ '--si-tick-t': i / (count - 1) }} />
          ))}
        </span>
      )}
      <span className="si-range-bar__thumb" aria-hidden="true" />
      {/* keyboard and screen readers only; the pointer is handled above like the library */}
      <input
        className="si-range-bar__input"
        type="range"
        min={0}
        max={1}
        step={divisions ? 1 / divisions : 0.01}
        value={current}
        aria-label="Drsnik"
        onChange={(e) => setCurrent(Number(e.target.value))}
      />
    </div>
  );
};

// Order = the catalog's controls (Oznake, then the value).
RangeBar.propTypes = {
  showTicks: PropTypes.bool,
  value: PropTypes.number,
  tickCount: PropTypes.number,
  className: PropTypes.string,
  /** The bar was tapped or dragged: the new value (the story writes it back to "Vrednost"). */
  onChange: PropTypes.func,
};
