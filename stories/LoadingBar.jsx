import React from 'react';
import PropTypes from 'prop-types';

import './loading-bar.css';

export const LoadingBar = ({
  variant = 'linear',
  thickness = 'thin',
  indeterminate = false,
  value = 0.5,
  className = '',
}) => {
  const pct = Math.round(Math.min(1, Math.max(0, Number(value) || 0)) * 100);
  const classes = [
    'si-loading-bar',
    `si-loading-bar--${variant}`,
    `si-loading-bar--${thickness}`,
    indeterminate ? 'si-loading-bar--indeterminate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'circular') {
    return (
      <div
        className={classes}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="si-loading-bar__spinner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="si-loading-bar__fill"
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
};

LoadingBar.propTypes = {
  variant: PropTypes.oneOf(['linear', 'circular']),
  thickness: PropTypes.oneOf(['thin', 'thick']),
  indeterminate: PropTypes.bool,
  value: PropTypes.number,
  className: PropTypes.string,
};
