import React, { useState } from 'react';
import PropTypes from 'prop-types';

import chevron from './assets/mobile/calendar/chevron.svg';
import './mobile-tokens.css';
import './calendar-ios.css';

const cx = (...names) => names.filter(Boolean).join(' ');
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Chevron = ({ className }) => (
  <span
    className={cx('si-cal-ios__chevron', className)}
    style={{ '--si-icon': `url(${JSON.stringify(chevron)})` }}
    aria-hidden="true"
  />
);

Chevron.propTypes = { className: PropTypes.string };

/**
 * Twin of SIDatePickerIOS (components/flutter/lib/src/components/datepicker/si_date_picker_ios.dart).
 * en_US symbols (weeks start on Sunday), as SIDateFormat in the library.
 */
export const CalendarIOS = ({
  style = 'outlined',
  year = 2022,
  month = 5,
  today = 10,
  selected = 16,
  className = '',
}) => {
  const [day, setDay] = useState(selected);
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return (
    <div className={cx('si-cal-ios', `si-cal-ios--${style}`, className)}>
      <div className="si-cal-ios__header">
        <button type="button" className="si-cal-ios__month">
          <span className="si-cal-ios__month-label">
            {MONTHS[month]} {year}
          </span>
          <span className="si-cal-ios__dropdown">
            <Chevron />
          </span>
        </button>
        {(
          <span className="si-cal-ios__arrows">
            <button type="button" className="si-cal-ios__arrow" aria-label="Prejšnji mesec">
              <Chevron className="si-cal-ios__chevron--flip" />
            </button>
            <button type="button" className="si-cal-ios__arrow" aria-label="Naslednji mesec">
              <Chevron />
            </button>
          </span>
        )}
      </div>
      <div className="si-cal-ios__body">
        <div className="si-cal-ios__row si-cal-ios__weekdays">
          {WEEKDAYS.map((w) => (
            <span key={w} className="si-cal-ios__cell si-cal-ios__weekday">
              {w}
            </span>
          ))}
        </div>
        <div className="si-cal-ios__grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="si-cal-ios__row">
              {week.map((d, di) =>
                d == null ? (
                  <span key={di} className="si-cal-ios__cell" />
                ) : (
                  <button
                    key={di}
                    type="button"
                    className={cx(
                      'si-cal-ios__cell',
                      'si-cal-ios__day',
                      d === day ? 'si-cal-ios__day--selected' : '',
                      d !== day && d === today ? 'si-cal-ios__day--today' : '',
                    )}
                    onClick={() => setDay(d)}
                  >
                    {d}
                  </button>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

CalendarIOS.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  year: PropTypes.number,
  month: PropTypes.number,
  today: PropTypes.number,
  selected: PropTypes.number,
  className: PropTypes.string,
};
