import React from 'react';
import PropTypes from 'prop-types';

import pencilIcon from './assets/mobile/calendar/pencil.svg';
import chevronIcon from './assets/mobile/calendar/chevron.svg';
import navLeft from './assets/mobile/calendar/date-picker-left.svg';
import navRight from './assets/mobile/calendar/date-picker-right.svg';
import './calendar.css';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Januar 2026 starts Thursday → offsets: Sun/Mon empty, then 1..31 */
const buildCells = () => {
  const cells = [];
  for (let i = 0; i < 2; i += 1) cells.push(null);
  for (let d = 1; d <= 31; d += 1) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
};

const CELLS = buildCells();
const TODAY = 5;
const SELECTED = 17;

export const Calendar = ({
  style = 'outlined',
  className = '',
}) => {
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
        <p className="si-calendar__label">Select date</p>
        <div className="si-calendar__date-row">
          <p className="si-calendar__date">Mon, Jan 17</p>
          <button
            type="button"
            className="si-calendar__icon-btn"
            aria-label="Uredi"
          >
            <img src={pencilIcon} alt="" width="24" height="24" />
          </button>
        </div>
      </div>

      <div className="si-calendar__month-row">
        <button type="button" className="si-calendar__month-btn">
          <span>Januar 2026</span>
          <img
            src={chevronIcon}
            alt=""
            width="18"
            height="18"
            className="si-calendar__month-chevron"
          />
        </button>
        <div className="si-calendar__nav">
          <button
            type="button"
            className="si-calendar__icon-btn"
            aria-label="Prejšnji mesec"
          >
            <img src={navLeft} alt="" width="24" height="24" />
          </button>
          <button
            type="button"
            className="si-calendar__icon-btn"
            aria-label="Naslednji mesec"
          >
            <img src={navRight} alt="" width="24" height="24" />
          </button>
        </div>
      </div>

      <div className="si-calendar__grid-wrap">
        <div className="si-calendar__weekdays">
          {WEEKDAYS.map((d, i) => (
            <span key={`${d}-${i}`} className="si-calendar__weekday">
              {d}
            </span>
          ))}
        </div>
        <div className="si-calendar__grid">
          {CELLS.map((day, idx) => {
            if (day == null) {
              return (
                <span
                  key={idx}
                  className="si-calendar__day si-calendar__day--empty"
                />
              );
            }
            const isSelected = day === SELECTED;
            const isToday = day === TODAY;
            return (
              <span
                key={idx}
                className={[
                  'si-calendar__day',
                  isSelected ? 'si-calendar__day--selected' : '',
                  isToday && !isSelected ? 'si-calendar__day--today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      <div className="si-calendar__actions">
        <button type="button" className="si-calendar__action">
          Cancel
        </button>
        <button type="button" className="si-calendar__action">
          OK
        </button>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  style: PropTypes.oneOf(['outlined', 'filled', 'elevated']),
  className: PropTypes.string,
};
