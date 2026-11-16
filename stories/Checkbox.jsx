import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './mobile-tokens.css';
import './checkbox.css';

export const Checkbox = ({
  checked: checkedProp = false,
  enabled = true,
  hasError = false,
  showLabel = true,
  label = 'Placeholder text',
  thickness = 'thick',
  className = '',
}) => {
  const [checked, setChecked] = useState(checkedProp);

  return (
    <label
      className={[
        'si-checkbox',
        `si-checkbox--${thickness}`,
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
          // _CheckmarkPainter: (0.2,0.5)→(0.4,0.7)→(0.8,0.3) of the 16 box, stroke 2, butt/miter
          <svg className="si-checkbox__check" viewBox="0 0 16 16" width="16" height="16">
            <path d="M3.2 8L6.4 11.2L12.8 4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" />
          </svg>
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
  thickness: PropTypes.oneOf(['thin', 'thick']),
  className: PropTypes.string,
};
