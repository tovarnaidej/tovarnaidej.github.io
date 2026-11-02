import React from 'react';
import PropTypes from 'prop-types';

import calendarIcon from './assets/mobile/calendar-input/calendar-input.svg';
import './calendar-input.css';

export const CalendarInput = ({
  mode = 'single',
  className = '',
}) => {
  const isRange = mode === 'range';

  return (
    <div
      className={[
        'si-calendar-input',
        isRange ? 'si-calendar-input--range' : 'si-calendar-input--single',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-label="Select date"
    >
      <div className="si-calendar-input__header">
        <p className="si-calendar-input__label">Select date</p>
        <div className="si-calendar-input__title-row">
          <p className="si-calendar-input__title">Enter date</p>
          <button
            type="button"
            className="si-calendar-input__icon-btn"
            aria-label="Koledar"
          >
            <img src={calendarIcon} alt="" width="16" height="16" />
          </button>
        </div>
      </div>

      <div className="si-calendar-input__fields">
        <div className="si-calendar-input__field si-calendar-input__field--active">
          <span className="si-calendar-input__field-label">Date</span>
          <span className="si-calendar-input__field-value">dd/mm/yyyy</span>
        </div>
        {isRange && (
          <div className="si-calendar-input__field">
            <span className="si-calendar-input__field-value si-calendar-input__field-value--placeholder">
              End date
            </span>
          </div>
        )}
      </div>

      <div className="si-calendar-input__actions">
        <button type="button" className="si-calendar-input__action">
          Cancel
        </button>
        <button type="button" className="si-calendar-input__action">
          OK
        </button>
      </div>
    </div>
  );
};

CalendarInput.propTypes = {
  mode: PropTypes.oneOf(['single', 'range']),
  className: PropTypes.string,
};
