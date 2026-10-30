import React from 'react';
import PropTypes from 'prop-types';

import './calendar-input.css';

export const CalendarInput = ({
  mode = 'single',
  className = '',
}) => (
  <div
    className={['si-calendar-input', className].filter(Boolean).join(' ')}
  >
    <label className="si-calendar-input__label">
      {mode === 'range' ? 'Obdobje' : 'Datum'}
    </label>
    <button type="button" className="si-calendar-input__field">
      <span>
        {mode === 'range' ? '1. 10. 2026 – 15. 10. 2026' : '15. 10. 2026'}
      </span>
      <span className="si-calendar-input__icon" aria-hidden="true">
        📅
      </span>
    </button>
  </div>
);

CalendarInput.propTypes = {
  mode: PropTypes.oneOf(['single', 'range']),
  className: PropTypes.string,
};
