import React, { useState } from 'react';
import PropTypes from 'prop-types';

import flagSi from './assets/mobile/phone/flags/si.svg';
import flagDe from './assets/mobile/phone/flags/de.svg';
import flagGh from './assets/mobile/phone/flags/gh.svg';
import flagGr from './assets/mobile/phone/flags/gr.svg';
import flagGt from './assets/mobile/phone/flags/gt.svg';
import chevronDown from './assets/mobile/phone/chevron-down.svg';
import magnifyingGlass from './assets/mobile/phone/magnifying-glass.svg';
import './phone-input.css';

const COUNTRIES = [
  { code: 'si', dial: '+386', name: 'Slovenija', flag: flagSi },
  { code: 'de', dial: '+49', name: 'Nemčija', flag: flagDe },
  { code: 'gh', dial: '+233', name: 'Gana', flag: flagGh },
  { code: 'gr', dial: '+30', name: 'Grčija', flag: flagGr },
  { code: 'gt', dial: '+502', name: 'Gvatemala', flag: flagGt },
];

export const PhoneInput = ({
  enabled = true,
  hasError = false,
  countryCode = 'si',
  value = '',
  open = false,
  label = 'Telefonska številka',
  errorText = 'Prišlo je do napake...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [selected, setSelected] = useState(
    COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0],
  );

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
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="si-phone-input__flag-host">
            <img
              className="si-phone-input__flag"
              src={selected.flag}
              alt=""
              width="30"
              height="20"
            />
          </span>
          <img
            className={[
              'si-phone-input__chevron',
              isOpen ? 'si-phone-input__chevron--up' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            src={chevronDown}
            alt=""
            width="20"
            height="20"
          />
        </button>

        <div className="si-phone-input__field">
          <span className="si-phone-input__field-label">{label}</span>
          <div className="si-phone-input__value-row">
            <span className="si-phone-input__prefix">{selected.dial}</span>
            {value ? (
              <span className="si-phone-input__number">{value}</span>
            ) : null}
          </div>
        </div>
      </div>

      {hasError && errorText ? (
        <p className="si-phone-input__error">{errorText}</p>
      ) : null}

      {isOpen && (
        <div className="si-phone-input__panel" role="listbox">
          <div className="si-phone-input__panel-header">
            <img
              src={magnifyingGlass}
              alt=""
              width="24"
              height="24"
              className="si-phone-input__search-icon"
            />
            <span className="si-phone-input__search-placeholder">
              Iskanje držav
            </span>
          </div>
          <div className="si-phone-input__panel-divider" />
          <ul className="si-phone-input__list">
            {COUNTRIES.filter((c) => c.code !== 'si').map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  className="si-phone-input__list-item"
                  onClick={() => {
                    setSelected(c);
                    setIsOpen(false);
                  }}
                >
                  <img
                    className="si-phone-input__list-flag"
                    src={c.flag}
                    alt=""
                    width="24"
                    height="16"
                  />
                  <span>
                    {c.name} ({c.dial})
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
  countryCode: PropTypes.string,
  value: PropTypes.string,
  open: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};
