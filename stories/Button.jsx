import React from 'react';
import PropTypes from 'prop-types';

import plusIcon from './assets/button/plus.svg';
import './button.css';

const VARIANT_ALIASES = {
  solid: 'filled',
  ghost: 'elevated',
};

export const Button = ({
  variant = 'filled',
  enabled = true,
  leadingIcon = false,
  label = 'Example Button',
  platform = 'android',
  size = 'regular',
  state = 'enabled',
  disabled = false,
  className = '',
  ...props
}) => {
  const normalizedVariant = VARIANT_ALIASES[variant] || variant;
  const normalizedState = disabled || !enabled ? 'disabled' : state;
  const isDisabled = normalizedState === 'disabled';
  // The catalog passes an empty "Oznaka" as no label: an icon alone, padded 16 both sides.
  const hasLabel = label !== '' && label != null;
  const classes = [
    'storybook-button',
    `storybook-button--${normalizedVariant}`,
    `storybook-button--${size}`,
    `storybook-button--${normalizedState}`,
    `storybook-button--${platform}`,
    leadingIcon && hasLabel ? 'storybook-button--with-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-pressed={normalizedState === 'pressed' ? true : undefined}
      {...props}
    >
      {leadingIcon && (
        <span
          className="storybook-button__icon"
          style={{ '--si-icon': `url(${JSON.stringify(plusIcon)})` }}
          aria-hidden="true"
        />
      )}
      {hasLabel && <span className="storybook-button__label">{label}</span>}
    </button>
  );
};

// Order = the catalog's controls (Slog, Omogočeno, Ikona, Oznaka).
Button.propTypes = {
  variant: PropTypes.oneOf(['filled', 'elevated', 'outline', 'text', 'solid', 'ghost']),
  enabled: PropTypes.bool,
  leadingIcon: PropTypes.bool,
  label: PropTypes.string,
  /** Pressed: iOS fades to 0.8 (100 ms); Android 0.8 at once plus the ink highlight (white
   * 20 % on Zapolnjeno / S senco). Smallest target: iOS 44, Android 48. */
  platform: PropTypes.oneOf(['ios', 'android']),
  size: PropTypes.oneOf(['regular', 'small']),
  state: PropTypes.oneOf(['enabled', 'pressed', 'disabled']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
