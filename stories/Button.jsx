import React from 'react';

import PropTypes from 'prop-types';

import './button.css';

export const Button = ({
  label = 'Example Button',
  variant = 'solid',
  size = 'medium',
  leadingIcon = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const classes = [
    'storybook-button',
    `storybook-button--${variant}`,
    `storybook-button--${size}`,
    leadingIcon ? 'storybook-button--icon' : '',
    disabled ? 'storybook-button--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {leadingIcon && <span className="storybook-button__icon" aria-hidden="true">+</span>}
      <span>{label}</span>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  variant: PropTypes.oneOf(['solid', 'outline', 'ghost', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  leadingIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
