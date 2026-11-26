import React from 'react';
import PropTypes from 'prop-types';

import './switch.css';
import { useControlled } from './use-controlled';

export const Switch = ({
  value: valueProp = false,
  enabled = true,
  showLabel = false,
  label = 'Switch label',
  platform = 'android',
  className = '',
  onChange,
}) => {
  // One state for the switch and the "Vklopljeno" control, as in the catalog.
  const [on, setOn] = useControlled(valueProp, onChange);

  return (
    <label
      className={[
        'si-switch',
        `si-switch--${platform}`,
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
        onClick={() => setOn(!on)}
      >
        <span className="si-switch__thumb" />
      </button>
      {showLabel && <span className="si-switch__label">{label}</span>}
    </label>
  );
};

// Order = the catalog's controls (Storybook lists the controls in this order).
Switch.propTypes = {
  value: PropTypes.bool,
  enabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  /** iOS: green, 27 thumb with a shadow, 44 tap target, dims to 0.7 while pressed;
   * Android: primary, 23 thumb without a shadow, 48 tap target. */
  platform: PropTypes.oneOf(['ios', 'android']),
  className: PropTypes.string,
  /** The switch was tapped: the new value (the story writes it back to "Vklopljeno"). */
  onChange: PropTypes.func,
};
