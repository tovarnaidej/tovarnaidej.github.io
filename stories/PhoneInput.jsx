import React from 'react';
import PropTypes from 'prop-types';

import './phone-input.css';

export const PhoneInput = ({
  enabled = true,
  hasError = false,
  countryCode = '+386',
  className = '',
}) => (
  <div
    className={[
      'si-phone-input',
      hasError ? 'si-phone-input--error' : '',
      !enabled ? 'si-phone-input--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <label className="si-phone-input__label">Telefonska številka</label>
    <div className="si-phone-input__row">
      <button type="button" className="si-phone-input__country" disabled={!enabled}>
        {countryCode}
        <span aria-hidden="true">▾</span>
      </button>
      <input
        className="si-phone-input__field"
        type="tel"
        placeholder="40 123 456"
        disabled={!enabled}
      />
    </div>
    {hasError && (
      <div className="si-phone-input__error">Prišlo je do napake.</div>
    )}
  </div>
);

PhoneInput.propTypes = {
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  countryCode: PropTypes.string,
  className: PropTypes.string,
};
