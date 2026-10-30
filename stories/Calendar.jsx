import React from 'react';
import PropTypes from 'prop-types';

import './calendar.css';

const DAYS = ['Po', 'To', 'Sr', 'Če', 'Pe', 'So', 'Ne'];
const CELLS = Array.from({ length: 35 }, (_, i) => {
  const day = i - 1;
  if (day < 1 || day > 31) return null;
  return day;
});

export const Calendar = ({
  style = 'outlined',
  className = '',
}) => {
  const today = 15;
  return (
    <div
      className={[
        'si-calendar',
        `si-calendar--${style}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="si-calendar__header">
        <button type="button" className="si-calendar__nav" aria-label="Prejšnji">
          ‹
        </button>
        <div className="si-calendar__month">Oktober 2026</div>
        <button type="button" className="si-calendar__nav" aria-label="Naslednji">
          ›
        </button>
      </div>
      <div className="si-calendar__weekdays">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="si-calendar__grid">
        {CELLS.map((day, idx) => (
          <span
            key={idx}
            className={[
              'si-calendar__day',
              day === today ? 'si-calendar__day--selected' : '',
              !day ? 'si-calendar__day--empty' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  className: PropTypes.string,
};
