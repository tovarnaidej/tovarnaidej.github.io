import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './mobile-tokens.css';
import './range-bar.css';

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
}) => {
  const [current, setCurrent] = useState(Math.min(1, Math.max(0, Number(value) || 0)));
  React.useEffect(() => setCurrent(Math.min(1, Math.max(0, Number(value) || 0))), [value]);
  const count = Math.min(Math.max(Number(tickCount) || 5, 2), 32);

  return (
    <div
      className={['si-range-bar', className].filter(Boolean).join(' ')}
      style={{ '--si-range-p': current }}
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
      <input
        className="si-range-bar__input"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={current}
        aria-label="Drsnik"
        onChange={(e) => setCurrent(Number(e.target.value))}
      />
    </div>
  );
};

RangeBar.propTypes = {
  value: PropTypes.number,
  showTicks: PropTypes.bool,
  tickCount: PropTypes.number,
  className: PropTypes.string,
};
