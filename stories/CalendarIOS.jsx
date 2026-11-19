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

const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
const YEARS_PER_PAGE = 12;

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
 * Views as in the library: days → (tap label) years → months → days.
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
  initialView = 'days',
  className = '',
}) => {
  const [view, setView] = useState(initialView);
  const [yearPage, setYearPage] = useState(0);
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
  /* _startYearForPage: the first page starts with the displayed year. */
  const startYear = year + yearPage * YEARS_PER_PAGE;
  const step = (delta) => {
    if (view === 'days') setDisplayed(new Date(year, month + delta, 1));
    else if (view === 'years') setYearPage((p) => p + delta);
  };
  const pickerCell = (key, label, selected, onClick) => (
    <span key={key} className="si-cal-ios__picker-slot">
      <button
        type="button"
        className={cx('si-cal-ios__picker-cell', selected && 'si-cal-ios__picker-cell--selected')}
        onClick={onClick}
      >
        <span className="si-cal-ios__picker-label">{label}</span>
      </button>
    </span>
  );
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return (
    <div className={cx('si-cal-ios', `si-cal-ios--${style}`, `si-cal-ios--view-${view}`, className)}>
      <div className="si-cal-ios__header">
        <button
          type="button"
          className="si-cal-ios__month"
          aria-label="Izberi mesec in leto"
          onClick={() => {
            setYearPage(0);
            setView(view === 'days' ? 'years' : 'days');
          }}
        >
          <span className="si-cal-ios__month-label">
            {view === 'years'
              ? `${startYear} - ${startYear + YEARS_PER_PAGE - 1}`
              : `${MONTHS[month]} ${year}`}
          </span>
          <span className={cx('si-cal-ios__dropdown', view !== 'days' && 'si-cal-ios__dropdown--open')}>
            <Chevron />
          </span>
        </button>
        {view !== 'months' && (
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
      {view === 'years' && (
        <div className="si-cal-ios__years">
          {Array.from({ length: 4 }, (_, row) => (
            <div key={row} className="si-cal-ios__picker-row">
              {Array.from({ length: 3 }, (_, col) => {
                const y = startYear + row * 3 + col;
                return pickerCell(y, y, y === year, () => {
                  setDisplayed(new Date(y, month, 1));
                  setView('months');
                });
              })}
            </div>
          ))}
        </div>
      )}
      {view === 'months' && (
        <div className="si-cal-ios__months">
          {Array.from({ length: 4 }, (_, row) => (
            <div key={row} className="si-cal-ios__picker-row">
              {Array.from({ length: 3 }, (_, col) => {
                const m = row * 3 + col;
                return pickerCell(m, MONTHS_SHORT[m], m === month, () => {
                  setDisplayed(new Date(year, m, 1));
                  setView('days');
                });
              })}
            </div>
          ))}
        </div>
      )}
      {view === 'days' && (
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
      )}
    </div>
  );
};

CalendarIOS.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  /** `YYYY-MM-DD` or Date; defaults to today (catalog: `DateTime.now()`). */
  initialDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  /** `YYYY-MM-DD` or Date; defaults to the current day. */
  today: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  initialView: PropTypes.oneOf(['days', 'years', 'months']),
  className: PropTypes.string,
};
