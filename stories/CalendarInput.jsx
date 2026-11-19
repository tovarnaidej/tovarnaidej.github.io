import React, { useState } from 'react';
import PropTypes from 'prop-types';

import calendarIcon from './assets/mobile/calendar-input/calendar-input.svg';
import './calendar-input.css';

/**
 * _DateField (si_calendar_input.dart): the label floats when the field is focused or
 * filled; empty + unfocused shows the label as body text. Visible glyphs are spans,
 * the transparent <input> on top keeps caret, typing and a11y.
 */
const DateField = ({ label, hint, initialFocused = false }) => {
  const [focused, setFocused] = useState(initialFocused);
  const [value, setValue] = useState('');
  const floatLabel = focused || value !== '';
  const face = value !== '' ? value : floatLabel ? hint : label;

  return (
    <div
      className={[
        'si-calendar-input__field',
        focused ? 'si-calendar-input__field--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {floatLabel && <span className="si-calendar-input__field-label">{label}</span>}
      <span className="si-calendar-input__field-value">{face}</span>
      <input
        className="si-calendar-input__field-input"
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

DateField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
  initialFocused: PropTypes.bool,
};

export const CalendarInput = ({
  mode = 'single',
  focused = false,
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
      aria-label="Izberite datum"
    >
      <div className="si-calendar-input__header">
        <p className="si-calendar-input__label">Izberite datum</p>
        <div className="si-calendar-input__title-row">
          <p className="si-calendar-input__title">Vnesite datum</p>
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
        <DateField label="Datum" hint="dd/mm/llll" initialFocused={focused} />
        {isRange && <DateField label="Končni datum" hint="dd/mm/llll" />}
      </div>

      <div className="si-calendar-input__actions">
        <button type="button" className="si-calendar-input__action">
          Prekliči
        </button>
        <button type="button" className="si-calendar-input__action">
          V redu
        </button>
      </div>
    </div>
  );
};

CalendarInput.propTypes = {
  mode: PropTypes.oneOf(['single', 'range']),
  /** Start with the first field focused (the catalog preview starts unfocused). */
  focused: PropTypes.bool,
  className: PropTypes.string,
};
