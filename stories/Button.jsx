import React from 'react';
import PropTypes from 'prop-types';

import addBlack from './assets/button/add-black.svg';
import addDisabled from './assets/button/add-disabled.svg';
import addPrimary from './assets/button/add-primary.svg';
import addWhite from './assets/button/add-white.svg';
import './button.css';

const VARIANT_ALIASES = {
  solid: 'filled',
  ghost: 'elevated',
};

const getIcon = (variant, state) => {
  if (state === 'disabled') {
    return ['filled', 'elevated'].includes(variant) ? addBlack : addDisabled;
  }

  return ['filled', 'elevated'].includes(variant) ? addWhite : addPrimary;
};

export const Button = ({
  label = 'Example Button',
  variant = 'filled',
  size = 'regular',
  state = 'enabled',
  leadingIcon = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const normalizedVariant = VARIANT_ALIASES[variant] || variant;
  const normalizedState = disabled ? 'disabled' : state;
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
        <img
          className="storybook-button__icon"
          src={getIcon(normalizedVariant, normalizedState)}
          width="24"
          height="24"
          alt=""
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
  className: PropTypes.string,
  onClick: PropTypes.func,
};
