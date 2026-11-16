import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './mobile-tokens.css';
import './radio.css';

export const RadioItem = ({
  selected = false,
  enabled = true,
  hasError = false,
  label = 'Placeholder text',
  showLabel = true,
  thickness = 'thick',
  name = 'si-radio-item',
  onSelect,
  className = '',
}) => (
  <label
    className={[
      'si-radio',
      `si-radio--${thickness}`,
      selected ? 'si-radio--selected' : '',
      hasError ? 'si-radio--error' : '',
      !enabled ? 'si-radio--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <input
      type="radio"
      name={name}
      checked={selected}
      disabled={!enabled}
      onChange={() => onSelect && onSelect()}
    />
    <span className="si-radio__control" aria-hidden="true" />
    {showLabel && <span className="si-radio__label">{label}</span>}
  </label>
);

RadioItem.propTypes = {
  selected: PropTypes.bool,
  enabled: PropTypes.bool,
  hasError: PropTypes.bool,
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  thickness: PropTypes.oneOf(['thin', 'thick']),
  name: PropTypes.string,
  onSelect: PropTypes.func,
  className: PropTypes.string,
};

export const Radio = ({
  enabled = true,
  hasError = false,
  showLabels = true,
  label1 = 'Option 1',
  label2 = 'Option 2',
  label3 = 'Option 3',
  thickness = 'thick',
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
        <RadioItem
          key={opt.value}
          selected={selected === opt.value}
          enabled={enabled}
          hasError={hasError}
          label={opt.label}
          showLabel={showLabels}
          thickness={thickness}
          name="si-radio"
          onSelect={() => setSelected(opt.value)}
        />
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
  thickness: PropTypes.oneOf(['thin', 'thick']),
  className: PropTypes.string,
};
