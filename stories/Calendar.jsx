import React, { useState } from 'react';
import PropTypes from 'prop-types';

import pencilIcon from './assets/mobile/calendar/pencil.svg';
import navLeft from './assets/mobile/calendar/date-picker-left.svg';
import navRight from './assets/mobile/calendar/date-picker-right.svg';
import './mobile-tokens.css';
import './calendar.css';

/* SIDateFormat.localeName = 'en_US' — dates are not localised in the library. */
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
const YEARS_PER_PAGE = 12;

const toDate = (value) => {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  if (typeof value === 'string' && value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const joinClasses = (...names) => names.filter(Boolean).join(' ');

/**
 * Twin of SIDatePicker (components/flutter/lib/src/components/datepicker/si_date_picker.dart).
 * 328 × 520 for every month and view: header 116 + divider 1 + navigation 56 + content 287 + actions 60.
 * Views as in the library: days → (tap label) years → months → days.
 */
export const Calendar = ({
  style = 'outlined',
  initialDate,
  today,
  initialView = 'days',
  onDateSelected,
  onCancelled,
  className = '',
}) => {
  const [selected, setSelected] = useState(() => toDate(initialDate));
  const [displayed, setDisplayed] = useState(() => {
    const d = toDate(initialDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [view, setView] = useState(initialView);
  const [yearPage, setYearPage] = useState(0);
  const todayDate = toDate(today);

  const year = displayed.getFullYear();
  const month = displayed.getMonth();
  const startYear = Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE + yearPage * YEARS_PER_PAGE;

  const label =
    view === 'years'
      ? `${startYear} – ${startYear + YEARS_PER_PAGE - 1}`
      : `${MONTHS[month]} ${year}`;

  const step = (delta) => {
    if (view === 'days') setDisplayed(new Date(year, month + delta, 1));
    else if (view === 'years') setYearPage((p) => p + delta);
  };

  const offset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rowCount = Math.floor((offset + daysInMonth + 6) / 7);

  const headerDate = `${WEEKDAYS_SHORT[selected.getDay()]}, ${MONTHS_SHORT[selected.getMonth()]} ${selected.getDate()}`;

  return (
    <div className={joinClasses('si-calendar', `si-calendar--${style}`, className)}>
      <div className="si-calendar__header">
        <p className="si-calendar__label">Izberite datum</p>
        <div className="si-calendar__date-row">
          <p className="si-calendar__date">{headerDate}</p>
          <button type="button" className="si-calendar__icon-btn" aria-label="Uredi datum">
            <img src={pencilIcon} alt="" width="24" height="24" />
          </button>
        </div>
      </div>

      <div className="si-calendar__nav-row">
        <button
          type="button"
          className="si-calendar__month-btn"
          aria-label="Izberi mesec in leto"
          onClick={() => {
            setYearPage(0);
            setView(view === 'days' ? 'years' : 'days');
          }}
        >
          <span className="si-calendar__month-label">{label}</span>
          <svg
            className={joinClasses(
              'si-calendar__month-arrow',
              view !== 'days' && 'si-calendar__month-arrow--open',
            )}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {/* Material Icons.arrow_drop_down */}
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </button>
        {view !== 'months' && (
          <div className="si-calendar__nav">
            <button
              type="button"
              className="si-calendar__icon-btn"
              aria-label="Prejšnji mesec"
              onClick={() => step(-1)}
            >
              <img src={navLeft} alt="" width="24" height="24" />
            </button>
            <button
              type="button"
              className="si-calendar__icon-btn"
              aria-label="Naslednji mesec"
              onClick={() => step(1)}
            >
              <img src={navRight} alt="" width="24" height="24" />
            </button>
          </div>
        )}
      </div>

      <div className="si-calendar__content">
        {view === 'days' && (
          <>
            <div className="si-calendar__week">
              {WEEKDAYS.map((d, i) => (
                <span key={`${d}-${i}`} className="si-calendar__cell si-calendar__weekday">
                  {d}
                </span>
              ))}
            </div>
            {Array.from({ length: rowCount }, (_, row) => (
              <div key={row} className="si-calendar__week">
                {Array.from({ length: 7 }, (_, col) => {
                  const day = row * 7 + col - offset + 1;
                  if (day < 1 || day > daysInMonth) {
                    return <span key={col} className="si-calendar__cell" />;
                  }
                  const date = new Date(year, month, day);
                  const isSelected = sameDay(date, selected);
                  const isToday = sameDay(date, todayDate);
                  return (
                    <button
                      key={col}
                      type="button"
                      className={joinClasses(
                        'si-calendar__cell',
                        'si-calendar__day',
                        isSelected && 'si-calendar__day--selected',
                        isToday && !isSelected && 'si-calendar__day--today',
                      )}
                      aria-pressed={isSelected}
                      onClick={() => setSelected(date)}
                    >
                      <span className="si-calendar__day-number">{day}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </>
        )}

        {view === 'years' &&
          Array.from({ length: 5 }, (_, row) => (
            <div key={row} className="si-calendar__picker-row">
              {Array.from({ length: 3 }, (_, col) => {
                const y = startYear + row * 3 + col;
                return (
                  <button
                    key={y}
                    type="button"
                    className={joinClasses(
                      'si-calendar__picker-cell',
                      y === year && 'si-calendar__picker-cell--selected',
                    )}
                    onClick={() => {
                      setDisplayed(new Date(y, month, 1));
                      setView('months');
                    }}
                  >
                    <span className="si-calendar__picker-pill">{y}</span>
                  </button>
                );
              })}
            </div>
          ))}

        {view === 'months' &&
          Array.from({ length: 4 }, (_, row) => (
            <div key={row} className="si-calendar__picker-row">
              {Array.from({ length: 3 }, (_, col) => {
                const m = row * 3 + col;
                return (
                  <button
                    key={m}
                    type="button"
                    className={joinClasses(
                      'si-calendar__picker-cell',
                      m === month && 'si-calendar__picker-cell--selected',
                    )}
                    onClick={() => {
                      setDisplayed(new Date(year, m, 1));
                      setView('days');
                    }}
                  >
                    <span className="si-calendar__picker-pill">{MONTHS_SHORT[m]}</span>
                  </button>
                );
              })}
            </div>
          ))}
      </div>

      <div className="si-calendar__actions">
        <button type="button" className="si-calendar__action" onClick={() => onCancelled?.()}>
          Prekliči
        </button>
        <button type="button" className="si-calendar__action" onClick={() => onDateSelected?.(selected)}>
          V redu
        </button>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  /** V redu: the selected date (SIDatePicker.show returns it). */
  onDateSelected: PropTypes.func,
  /** Prekliči. */
  onCancelled: PropTypes.func,
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  /** `YYYY-MM-DD` or Date; defaults to today (catalog: `DateTime.now()`). */
  initialDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  /** `YYYY-MM-DD` or Date; defaults to the current day. */
  today: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  initialView: PropTypes.oneOf(['days', 'years', 'months']),
  className: PropTypes.string,
};
