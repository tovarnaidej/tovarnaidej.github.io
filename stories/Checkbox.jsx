import React, { useState } from 'react';
import PropTypes from 'prop-types';

import checkmark from './assets/mobile/checkbox/checkmark.svg';
import './checkbox.css';

export const Checkbox = ({
  checked: checkedProp = false,
  enabled = true,
  hasError = false,
  showLabel = true,
  label = 'Placeholder text',
  platform = 'ios',
  className = '',
}) => {
  const [checked, setChecked] = useState(checkedProp);

  return (
    <label
      className={[
        'si-checkbox',
        `si-checkbox--${platform}`,
        checked ? 'si-checkbox--checked' : '',
        hasError ? 'si-checkbox--error' : '',
        !enabled ? 'si-checkbox--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={!enabled}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <span className="si-checkbox__control" aria-hidden="true">
        {checked && (
          <img
            className="si-checkbox__check"
            src={checkmark}
            alt=""
            width="20"
            height="20"
          />
        )}
      </span>
      {showLabel && <span className="si-checkbox__label">{label}</span>}
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  platform: PropTypes.oneOf(['ios', 'android']),
  className: PropTypes.string,
};
