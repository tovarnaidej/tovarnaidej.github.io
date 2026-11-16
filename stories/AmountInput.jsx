import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ngFlag from './assets/mobile/amount/ng.svg';
import chevronDown from './assets/mobile/amount/chevron-down.svg';
import './mobile-tokens.css';
import './amount-input.css';

const cx = (...names) => names.filter(Boolean).join(' ');

/**
 * Twin of SIAmountInput (components/flutter/lib/src/components/phone_amount/si_amount_input.dart
 * → SIPhoneAmountComposite). layout "style1" (Android default): label inside the 58 field;
 * "style2" (iOS default): label above, 52 fields.
 */
export const AmountInput = ({
  label = 'Znesek',
  style = 'outline',
  layout = 'style1',
  currencyCode = 'NGN',
  placeholder = '0.00',
  value = '',
  enabled = true,
  hasError = false,
  errorText = 'Prišlo je do napake...',
  helperText = '',
  className = '',
}) => {
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  React.useEffect(() => setText(value), [value]);
  const inner = layout === 'style1';
  const bottomText = hasError ? errorText : helperText;

  return (
    <div
      className={cx(
        'si-amount',
        `si-amount--${style}`,
        `si-amount--${layout}`,
        hasError ? 'si-amount--error' : '',
        focused ? 'si-amount--focused' : '',
        text ? 'si-amount--active' : '',
        !enabled ? 'si-amount--disabled' : '',
        className,
      )}
    >
      {!inner && <span className="si-amount__outer-label">{label}</span>}
      <div className="si-amount__row">
        <button type="button" className="si-amount__selector" disabled={!enabled} aria-label={`Valuta ${currencyCode}`}>
          <img className="si-amount__flag" src={ngFlag} alt="" width="35" height="24" />
          <span className="si-amount__code">{currencyCode}</span>
          <span className="si-amount__chevron-host" aria-hidden="true">
            <img src={chevronDown} alt="" width="16" height="16" />
          </span>
        </button>
        <label className="si-amount__field">
          {inner && <span className="si-amount__inner-label">{label}</span>}
          <input
            className="si-amount__editor"
            inputMode="decimal"
            value={text}
            placeholder={placeholder}
            disabled={!enabled}
            aria-label={label}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </label>
      </div>
      {bottomText ? <p className="si-amount__helper">{bottomText}</p> : null}
    </div>
  );
};

AmountInput.propTypes = {
  label: PropTypes.string,
  style: PropTypes.oneOf(['outline', 'filled']),
  layout: PropTypes.oneOf(['style1', 'style2']),
  currencyCode: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
};
