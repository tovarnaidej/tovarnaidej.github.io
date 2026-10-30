import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './checkbox.css';

export const Checkbox = ({
  checked: checkedProp = false,
  enabled = true,
  hasError = false,
  showLabel = true,
  label = 'Checkbox label',
  className = '',
}) => {
  const [checked, setChecked] = useState(checkedProp);

  return (
    <label
      className={[
        'si-checkbox',
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
      <span className="si-checkbox__control" aria-hidden="true" />
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
  className: PropTypes.string,
};
