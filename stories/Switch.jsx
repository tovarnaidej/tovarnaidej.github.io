import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './switch.css';

export const Switch = ({
  value: valueProp = false,
  enabled = true,
  showLabel = true,
  label = 'Switch label',
  className = '',
}) => {
  const [on, setOn] = useState(valueProp);

  return (
    <label
      className={[
        'si-switch',
        on ? 'si-switch--on' : '',
        !enabled ? 'si-switch--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="si-switch__track"
        role="switch"
        aria-checked={on}
        disabled={!enabled}
        onClick={() => setOn((v) => !v)}
      >
        <span className="si-switch__thumb" />
      </button>
      {showLabel && <span className="si-switch__label">{label}</span>}
    </label>
  );
};

Switch.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};
