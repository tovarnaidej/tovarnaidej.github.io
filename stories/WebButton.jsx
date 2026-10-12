import React from 'react';
import PropTypes from 'prop-types';

import arrowPrimary from './assets/web-button/arrow-primary.svg';
import arrowSecondary from './assets/web-button/arrow-secondary.svg';
import arrowOutline from './assets/web-button/arrow-outline.svg';
import arrowText from './assets/web-button/arrow-text.svg';
import './web-button.css';

const icons = {
  primary: arrowPrimary,
  secondary: arrowSecondary,
  outline: arrowOutline,
  text: arrowText,
};

export const WebButton = ({
  label = 'Nadaljuj',
  hierarchy = 'primary',
  size = 'medium',
  state = 'default',
  leadingIcon = false,
  trailingIcon = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const isDisabled = state === 'disabled';
  const classes = [
    'web-button',
    `web-button--${hierarchy}`,
    `web-button--${size}`,
    `web-button--state-${state}`,
    fullWidth ? 'web-button--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-pressed={state === 'pressed' ? true : undefined}
      {...props}
    >
      {leadingIcon && (
        <img
          className="web-button__icon web-button__icon--leading"
          src={icons[hierarchy]}
          width="20"
          height="20"
          alt=""
          aria-hidden="true"
        />
      )}
      <span className="web-button__label">{label}</span>
      {trailingIcon && (
        <img
          className="web-button__icon"
          src={icons[hierarchy]}
          width="20"
          height="20"
          alt=""
          aria-hidden="true"
        />
      )}
    </button>
  );
};

WebButton.propTypes = {
  label: PropTypes.string,
  hierarchy: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  state: PropTypes.oneOf(['default', 'hover', 'focus', 'pressed', 'disabled']),
  leadingIcon: PropTypes.bool,
  trailingIcon: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
