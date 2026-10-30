import React from 'react';
import PropTypes from 'prop-types';

import './input.css';

export const Input = ({
  style = 'outline',
  enabled = true,
  hasError = false,
  showIcon = false,
  obscure = false,
  label = 'Oznaka',
  placeholder = 'Nadomestno besedilo',
  className = '',
}) => (
  <div
    className={[
      'si-input',
      `si-input--${style}`,
      hasError ? 'si-input--error' : '',
      !enabled ? 'si-input--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {label && <label className="si-input__label">{label}</label>}
    <div className="si-input__field-wrap">
      <input
        className="si-input__field"
        type={obscure ? 'password' : 'text'}
        placeholder={placeholder}
        disabled={!enabled}
      />
      {showIcon && <span className="si-input__icon" aria-hidden="true">👁</span>}
    </div>
    {hasError && <div className="si-input__error">Besedilo napake</div>}
  </div>
);

Input.propTypes = {
  style: PropTypes.oneOf(['underline', 'outline', 'filled']),
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  showIcon: PropTypes.bool,
  obscure: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
