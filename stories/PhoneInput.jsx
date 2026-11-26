import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import chevronDown from './assets/mobile/phone/chevron-down.svg';
import magnifyingGlass from './assets/mobile/phone/magnifying-glass.svg';
import { DIAL_COUNTRIES, NO_RESULTS, SEARCH_COUNTRIES } from './phone-countries';
import './phone-input.css';

// SIFlag: icons/flags/<iso2>.svg of the library (copied to assets/mobile/phone/flags).
const FLAG_FILES = import.meta.glob('./assets/mobile/phone/flags/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const flagOf = (iso2) => FLAG_FILES[`./assets/mobile/phone/flags/${iso2.toLowerCase()}.svg`];
const findCountry = (code) =>
  DIAL_COUNTRIES.find((c) => c.iso2.toLowerCase() === String(code).toLowerCase() || c.dial === code) ||
  DIAL_COUNTRIES[0];

/** A text the user types: the glyphs are drawn by the face span (the Flutter text position), a
 * transparent input over it takes the typing, the caret and the focus. */
const TypedText = ({ value, hint, onChange, className, faceClassName, hintClassName, inputRef, label, inputMode }) => (
  <label className={className}>
    <span className={value ? faceClassName : hintClassName}>{value || hint}</span>
    <input
      ref={inputRef}
      className="si-phone-input__typed"
      type="text"
      inputMode={inputMode}
      value={value}
      aria-label={label}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

TypedText.propTypes = {
  value: PropTypes.string.isRequired,
  hint: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  faceClassName: PropTypes.string,
  hintClassName: PropTypes.string,
  inputRef: PropTypes.object,
  label: PropTypes.string,
  inputMode: PropTypes.string,
};

/**
 * Twin of SIPhoneInput (components/flutter/lib/src/components/phone_amount/si_phone_input.dart):
 * the flag button opens the inline country picker (SIPrefixSearchPanel: search, list of the
 * library's 65 countries, Slovenia first); picking one closes it. The number is typed after the
 * dial code. The border of the phone field does not change with focus (phoneOutline).
 */
export const PhoneInput = ({
  enabled = true,
  hasError = false,
  errorText = 'Prišlo je do napake...',
  label = 'Telefonska številka',
  countryCode = 'SI',
  value = '',
  open = false,
  onCountryChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [country, setCountry] = useState(() => findCountry(countryCode));
  const [number, setNumber] = useState(value);
  const [query, setQuery] = useState('');
  const numberInput = useRef(null);
  const q = query.trim().toLowerCase();
  const listLabel = (c) => `${c.name} (${c.dial})`;
  // _filter: the label "Name (+code)" contains the query (case-insensitive)
  const visible = q ? DIAL_COUNTRIES.filter((c) => listLabel(c).toLowerCase().includes(q)) : DIAL_COUNTRIES;

  const togglePicker = () => {
    // _onPrefixTap: opening the picker takes the focus from the number field
    if (!isOpen) numberInput.current?.blur();
    setIsOpen(!isOpen);
  };
  const select = (c) => {
    setCountry(c);
    setIsOpen(false);
    onCountryChange?.(c.iso2);
  };

  return (
    <div
      className={[
        'si-phone-input',
        hasError ? 'si-phone-input--error' : '',
        !enabled ? 'si-phone-input--disabled' : '',
        isOpen ? 'si-phone-input--open' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="si-phone-input__row">
        <button
          type="button"
          className="si-phone-input__selector"
          disabled={!enabled}
          aria-expanded={isOpen}
          aria-label={`Klicna koda ${country.dial}`}
          onClick={togglePicker}
        >
          <span className="si-phone-input__flag-host">
            <img className="si-phone-input__flag" src={flagOf(country.iso2)} alt="" width="30" height="20" />
          </span>
          <img
            className={['si-phone-input__chevron', isOpen ? 'si-phone-input__chevron--up' : ''].filter(Boolean).join(' ')}
            src={chevronDown}
            alt=""
            width="20"
            height="20"
          />
        </button>
        <div className="si-phone-input__field">
          <span className="si-phone-input__field-label">{label}</span>
          <div className="si-phone-input__value-row">
            <span className="si-phone-input__prefix">{country.dial}</span>
            <TypedText
              className="si-phone-input__number-host"
              faceClassName="si-phone-input__number"
              hintClassName="si-phone-input__number"
              value={number}
              hint=""
              inputMode="tel"
              label={label}
              inputRef={numberInput}
              onChange={setNumber}
            />
          </div>
        </div>
      </div>
      {hasError && errorText ? <p className="si-phone-input__error">{errorText}</p> : null}
      {isOpen && (
        <div className="si-phone-input__panel" role="listbox">
          <div className="si-phone-input__panel-header">
            <span
              className="si-phone-input__search-icon"
              style={{ '--si-icon': `url(${JSON.stringify(magnifyingGlass)})` }}
              aria-hidden="true"
            />
            <TypedText
              className="si-phone-input__search-host"
              faceClassName="si-phone-input__search-placeholder"
              hintClassName="si-phone-input__search-placeholder"
              value={query}
              hint={SEARCH_COUNTRIES}
              label={SEARCH_COUNTRIES}
              onChange={setQuery}
            />
          </div>
          <div className="si-phone-input__panel-divider" />
          {visible.length ? (
            <ul className="si-phone-input__list">
              {visible.map((c) => (
                <li key={c.iso2}>
                  <button type="button" className="si-phone-input__list-item" onClick={() => select(c)}>
                    {/* BoxFit.fitWidth: the flag as wide as the box, centred, cut or letterboxed */}
                    <span className="si-phone-input__list-flag" aria-hidden="true">
                      <img src={flagOf(c.iso2)} alt="" />
                    </span>
                    <span>{listLabel(c)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="si-phone-input__no-results">{NO_RESULTS}</div>
          )}
        </div>
      )}
    </div>
  );
};

PhoneInput.propTypes = {
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  /** Shown under the field while `hasError` (catalog: 'Prišlo je do napake...'). */
  errorText: PropTypes.string,
  label: PropTypes.string,
  /** ISO 3166-1 alpha-2 (or a dial code) of the starting country; Slovenia by default. */
  countryCode: PropTypes.string,
  /** Number the field starts with. */
  value: PropTypes.string,
  /** Picker open at the start. */
  open: PropTypes.bool,
  /** A country was picked: its ISO2 (the catalog keeps it and rebuilds the field). */
  onCountryChange: PropTypes.func,
  className: PropTypes.string,
};
