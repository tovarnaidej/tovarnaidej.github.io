import React from 'react';
import PropTypes from 'prop-types';

import './range-bar.css';

export const RangeBar = ({
  value = 0.5,
  showTicks = true,
  tickCount = 5,
  className = '',
}) => {
  const pct = Math.round(Math.min(1, Math.max(0, Number(value) || 0)) * 100);
  const ticks = Array.from({ length: tickCount }, (_, i) => i);

  return (
    <div className={['si-range-bar', className].filter(Boolean).join(' ')}>
      <div className="si-range-bar__track">
        <div className="si-range-bar__fill" style={{ width: `${pct}%` }} />
        <div className="si-range-bar__thumb" style={{ left: `${pct}%` }} />
      </div>
      {showTicks && (
        <div className="si-range-bar__ticks" aria-hidden="true">
          {ticks.map((i) => (
            <span key={i} className="si-range-bar__tick" />
          ))}
        </div>
      )}
    </div>
  );
};

RangeBar.propTypes = {
  value: PropTypes.number,
  showTicks: PropTypes.bool,
  tickCount: PropTypes.number,
  className: PropTypes.string,
};
