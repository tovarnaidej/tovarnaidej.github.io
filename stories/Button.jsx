import React from 'react';
import PropTypes from 'prop-types';

import plusIcon from './assets/button/plus.svg';
import './button.css';

const VARIANT_ALIASES = {
  solid: 'filled',
  ghost: 'elevated',
};

export const Button = ({
  label = 'Example Button',
  variant = 'filled',
  size = 'regular',
  state = 'enabled',
  leadingIcon = false,
  disabled = false,
  enabled = true,
  className = '',
  ...props
}) => {
  const normalizedVariant = VARIANT_ALIASES[variant] || variant;
  const normalizedState = disabled || !enabled ? 'disabled' : state;
  const isDisabled = normalizedState === 'disabled';
  const classes = [
    'storybook-button',
    `storybook-button--${normalizedVariant}`,
    `storybook-button--${size}`,
    `storybook-button--${normalizedState}`,
    leadingIcon ? 'storybook-button--with-icon' : '',
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
      <span className="storybook-button__label">{label}</span>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'elevated', 'outline', 'text', 'solid', 'ghost']),
  size: PropTypes.oneOf(['regular', 'small']),
  state: PropTypes.oneOf(['enabled', 'pressed', 'disabled']),
  leadingIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  enabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
