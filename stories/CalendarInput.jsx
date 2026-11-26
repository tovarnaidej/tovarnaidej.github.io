import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import calendarIcon from './assets/mobile/calendar-input/calendar-input.svg';
import { Calendar } from './Calendar';
import { CalendarIOS } from './CalendarIOS';
import './calendar-input.css';

// assets/localization/sl.json, calendarInput.*
const STRINGS = {
  title: 'Izberite datum',
  headline: 'Vnesite datum',
  dateLabel: 'Datum',
  endDateLabel: 'Končni datum',
  dateHint: 'dd/mm/llll',
  cancel: 'Prekliči',
  ok: 'V redu',
  invalidDate: 'Vnesite veljaven datum (dd/mm/llll)',
  invalidEndDate: 'Vnesite veljaven končni datum (dd/mm/llll)',
  endBeforeStart: 'Končni datum ne sme biti pred začetnim',
};

const pad = (n) => String(n).padStart(2, '0');
export const formatDate = (d) => (d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '');

/** _parseDate: exactly dd/mm/yyyy and a real day. */
const parseDate = (raw) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw.trim());
  if (!m) return null;
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day ? d : null;
};

/** _DateInputFormatter: digits only, at most 8, "/" after the day and the month. */
const mask = (raw) => {
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 8);
  let out = '';
  for (let i = 0; i < digits.length; i += 1) {
    if (i === 2 || i === 4) out += '/';
    out += digits[i];
  }
  return out;
};

/**
 * _DateField (si_calendar_input.dart): the label floats when the field is focused or
 * filled; empty + unfocused shows the label as body text. Visible glyphs are spans,
 * the transparent <input> on top keeps caret, typing and a11y.
 */
const DateField = ({ label, hint, value, onChange, inputRef, initialFocused = false }) => {
  // initialFocused: the focused look for static previews (Vse različice), not a real focus
  const [focused, setFocused] = useState(initialFocused);
  const floatLabel = focused || value !== '';
  const face = value !== '' ? value : floatLabel ? hint : label;
  // the formatter puts the caret at the end of the text
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement === el) el.setSelectionRange(value.length, value.length);
  }, [value]);
  return (
    <div className={['si-calendar-input__field', focused ? 'si-calendar-input__field--active' : ''].filter(Boolean).join(' ')}>
      {floatLabel && <span className="si-calendar-input__field-label">{label}</span>}
      <span className="si-calendar-input__field-value">{face}</span>
      <input
        ref={inputRef}
        className="si-calendar-input__field-input"
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => onChange(mask(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

DateField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  inputRef: PropTypes.object.isRequired,
  initialFocused: PropTypes.bool,
};

/**
 * Twin of SICalendarInput: typed dates (masked dd/mm/yyyy), V redu checks them (an error line
 * above the actions) and reports the result, Prekliči reports a cancel, the calendar icon opens
 * the date picker (SIDatePicker on Android, SIDatePickerIOS on iOS) in a dialog and fills the
 * field that had the focus.
 */
export const CalendarInput = ({
  mode = 'single',
  platform = 'android',
  focused = false,
  onConfirmed,
  onCancelled,
  className = '',
}) => {
  const isRange = mode === 'range';
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState(null);
  const [picker, setPicker] = useState(null); // { fillingEnd, seed }
  const startRef = useRef(null);
  const endRef = useRef(null);

  const edit = (set) => (v) => {
    set(v);
    setError(null);
  };
  const ok = () => {
    const s = parseDate(start);
    if (!s) return setError(STRINGS.invalidDate);
    if (!isRange) return onConfirmed?.(formatDate(s));
    const e = parseDate(end);
    if (!e) return setError(STRINGS.invalidEndDate);
    if (e < s) return setError(STRINGS.endBeforeStart);
    return onConfirmed?.(`${formatDate(s)} – ${formatDate(e)}`);
  };
  const openPicker = () => {
    const fillingEnd = isRange && document.activeElement === endRef.current;
    const seed = parseDate(fillingEnd ? end : start) || new Date();
    setPicker({ fillingEnd, seed });
  };
  const picked = (date) => {
    const text = formatDate(date);
    (picker.fillingEnd ? setEnd : setStart)(text);
    setError(null);
    setPicker(null);
  };
  const seedIso = picker
    ? `${picker.seed.getFullYear()}-${pad(picker.seed.getMonth() + 1)}-${pad(picker.seed.getDate())}`
    : null;

  return (
    <div
      className={['si-calendar-input', isRange ? 'si-calendar-input--range' : 'si-calendar-input--single', className]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-label={STRINGS.title}
    >
      <div className="si-calendar-input__header">
        <p className="si-calendar-input__label">{STRINGS.title}</p>
        <div className="si-calendar-input__title-row">
          <p className="si-calendar-input__title">{STRINGS.headline}</p>
          <button
            type="button"
            className="si-calendar-input__icon-btn"
            aria-label="Koledar"
            // keep the focus in the field (an IconButton does not take it): it picks the field
            onMouseDown={(e) => e.preventDefault()}
            onClick={openPicker}
          >
            <img src={calendarIcon} alt="" width="16" height="16" />
          </button>
        </div>
      </div>
      <div className="si-calendar-input__fields">
        <DateField
          label={STRINGS.dateLabel}
          hint={STRINGS.dateHint}
          value={start}
          onChange={edit(setStart)}
          inputRef={startRef}
          initialFocused={focused}
        />
        {isRange && (
          <DateField label={STRINGS.endDateLabel} hint={STRINGS.dateHint} value={end} onChange={edit(setEnd)} inputRef={endRef} />
        )}
      </div>
      {error ? <p className="si-calendar-input__error">{error}</p> : null}
      <div className="si-calendar-input__actions">
        <button type="button" className="si-calendar-input__action" onClick={() => onCancelled?.()}>
          {STRINGS.cancel}
        </button>
        <button type="button" className="si-calendar-input__action" onClick={ok}>
          {STRINGS.ok}
        </button>
      </div>
      {picker ? (
        // SIDatePicker.show: Dialog(insetPadding 24), barrier black 32 %
        <div
          className="catalog-dialog catalog-dialog--light"
          onClick={(e) => { if (e.target === e.currentTarget) setPicker(null); }}
        >
          {platform === 'ios' ? (
            <CalendarIOS initialDate={seedIso} onDateSelected={picked} />
          ) : (
            <Calendar initialDate={seedIso} onDateSelected={picked} onCancelled={() => setPicker(null)} />
          )}
        </div>
      ) : null}
    </div>
  );
};

CalendarInput.propTypes = {
  mode: PropTypes.oneOf(['single', 'range']),
  /** Which date picker the calendar icon opens (SIDatePicker.show: SIDatePickerIOS on iOS). */
  platform: PropTypes.oneOf(['ios', 'android']),
  /** Start with the first field focused (the catalog preview starts unfocused). */
  focused: PropTypes.bool,
  /** V redu with valid dates: "dd/mm/yyyy" or "dd/mm/yyyy – dd/mm/yyyy". */
  onConfirmed: PropTypes.func,
  /** Prekliči. */
  onCancelled: PropTypes.func,
  className: PropTypes.string,
};
