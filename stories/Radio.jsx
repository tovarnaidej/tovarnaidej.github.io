import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './radio.css';

export const Radio = ({
  enabled = true,
  hasError = false,
  showLabels = true,
  label1 = 'Option 1',
  label2 = 'Option 2',
  label3 = 'Option 3',
  className = '',
}) => {
  const [selected, setSelected] = useState(0);
  const options = [
    { value: 0, label: label1 },
    { value: 1, label: label2 },
    { value: 2, label: label3 },
  ];

  return (
    <div
      className={[
        'si-radio-group',
        hasError ? 'si-radio-group--error' : '',
        !enabled ? 'si-radio-group--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="radiogroup"
    >
      {options.map((opt) => (
        <label key={opt.value} className="si-radio">
          <input
            type="radio"
            name="si-radio"
            checked={selected === opt.value}
            disabled={!enabled}
            onChange={() => setSelected(opt.value)}
          />
          <span className="si-radio__control" aria-hidden="true" />
          {showLabels && <span className="si-radio__label">{opt.label}</span>}
        </label>
      ))}
    </div>
  );
};

Radio.propTypes = {
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  showLabels: PropTypes.bool,
  label1: PropTypes.string,
  label2: PropTypes.string,
  label3: PropTypes.string,
  className: PropTypes.string,
};
