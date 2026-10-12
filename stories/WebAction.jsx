import React from 'react';
import PropTypes from 'prop-types';

import arrow from './assets/web-action/arrow.svg';
import downloadDefault from './assets/web-action/download-default.svg';
import downloadHover from './assets/web-action/download-hover.svg';
import downloadPressed from './assets/web-action/download-pressed.svg';
import './web-action.css';

export const LinkAction = ({
  label = 'Preberi več',
  state = 'default',
  showIcon = false,
  href = '#',
  className = '',
  ...props
}) => {
  const isDisabled = state === 'disabled';
  const classes = [
    'web-action-link',
    `web-action-link--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      className={classes}
      href={isDisabled ? undefined : href}
      aria-disabled={isDisabled || undefined}
      aria-current={state === 'visited' ? 'page' : undefined}
      {...props}
    >
      <span>{label}</span>
      {showIcon && (
        <img src={arrow} width="20" height="20" alt="" aria-hidden="true" />
      )}
    </a>
  );
};

LinkAction.propTypes = {
  label: PropTypes.string,
  state: PropTypes.oneOf(['default', 'hover', 'focus', 'pressed', 'visited', 'disabled']),
  showIcon: PropTypes.bool,
  href: PropTypes.string,
  className: PropTypes.string,
};

const getDownloadIcon = (state) => {
  if (state === 'hover') return downloadHover;
  if (state === 'pressed') return downloadPressed;
  return downloadDefault;
};

export const DownloadButton = ({
  label = 'Prenesi',
  size = 'medium',
  state = 'default',
  showIcon = true,
  className = '',
  ...props
}) => {
  const isDisabled = state === 'disabled';
  const classes = [
    'web-download-button',
    `web-download-button--${size}`,
    `web-download-button--${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} disabled={isDisabled} {...props}>
      {showIcon && (
        <img
          src={getDownloadIcon(state)}
          width="20"
          height="20"
          alt=""
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </button>
  );
};

DownloadButton.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  state: PropTypes.oneOf(['default', 'hover', 'focus', 'pressed', 'disabled']),
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
