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
const toDate = (value) => {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  if (typeof value === 'string' && value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const CalendarIOS = ({
  style = 'outlined',
  initialDate,
  today: todayProp,
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState(() => toDate(initialDate));
  const [displayed, setDisplayed] = useState(() => {
    const d = toDate(initialDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const todayDate = toDate(todayProp);
  const year = displayed.getFullYear();
  const month = displayed.getMonth();
  const inMonth = (d) => d.getFullYear() === year && d.getMonth() === month;
  const day = inMonth(selectedDate) ? selectedDate.getDate() : null;
  const today = inMonth(todayDate) ? todayDate.getDate() : null;
  const setDay = (d) => setSelectedDate(new Date(year, month, d));
  const step = (delta) => setDisplayed(new Date(year, month + delta, 1));
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
            {`${MONTHS[month]} ${year}`}
          </span>
          <span className="si-cal-ios__dropdown">
            <Chevron />
          </span>
        </button>
        {(
          <span className="si-cal-ios__arrows">
            <button type="button" className="si-cal-ios__arrow" aria-label="Prejšnji mesec" onClick={() => step(-1)}>
              <Chevron className="si-cal-ios__chevron--flip" />
            </button>
            <button type="button" className="si-cal-ios__arrow" aria-label="Naslednji mesec" onClick={() => step(1)}>
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
                    <span className="si-cal-ios__day-number">{d}</span>
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
  /** `YYYY-MM-DD` or Date; defaults to today (catalog: `DateTime.now()`). */
  initialDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  /** `YYYY-MM-DD` or Date; defaults to the current day. */
  today: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  className: PropTypes.string,
};
