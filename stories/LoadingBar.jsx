import React from 'react';
import PropTypes from 'prop-types';

import './loading-bar.css';

// Figma 3911:6592 — circular indicators
//   thin  → 40×40, stroke 4
//   thick → 44×44, stroke 8
// Both share the same circle radius: (40 − 4) / 2 = (44 − 8) / 2 = 18.
const CIRCULAR = {
  thin: { size: 40, stroke: 4 },
  thick: { size: 44, stroke: 8 },
};

// Share of the circumference drawn while indeterminate.
const INDETERMINATE_ARC = 0.3;

const CircularIndicator = ({ thickness, progress, indeterminate }) => {
  const { size, stroke } = CIRCULAR[thickness] || CIRCULAR.thin;
  const center = size / 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const share = indeterminate ? INDETERMINATE_ARC : progress;
  const arcLength = circumference * share;

  return (
    <svg
      className="si-loading-bar__svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="si-loading-bar__circle-track"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={stroke}
      />
      {share > 0 && (
        <circle
          className="si-loading-bar__circle-active"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </svg>
  );
};

CircularIndicator.propTypes = {
  thickness: PropTypes.oneOf(['thin', 'thick']),
  progress: PropTypes.number.isRequired,
  indeterminate: PropTypes.bool,
};

export const LoadingBar = ({
  variant = 'linear',
  thickness = 'thin',
  indeterminate = false,
  value = 0.5,
  className = '',
}) => {
  const progress = Math.min(1, Math.max(0, Number(value) || 0));
  const pct = Math.round(progress * 100);
  const classes = [
    'si-loading-bar',
    `si-loading-bar--${variant}`,
    variant === 'circular' ? `si-loading-bar--${thickness}` : '',
    indeterminate ? 'si-loading-bar--indeterminate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ariaProps = {
    role: 'progressbar',
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': indeterminate ? undefined : pct,
  };

  if (variant === 'circular') {
    return (
      <div className={classes} {...ariaProps}>
        <CircularIndicator
          thickness={thickness}
          progress={progress}
          indeterminate={indeterminate}
        />
      </div>
    );
  }

  if (indeterminate) {
    return (
      <div className={classes} {...ariaProps}>
        <div className="si-loading-bar__track">
          <div className="si-loading-bar__fill" />
        </div>
      </div>
    );
  }

  // Determinate: active fill, then a 6px gap, then the remaining track.
  return (
    <div className={classes} {...ariaProps}>
      {pct > 0 && (
        <div
          className="si-loading-bar__fill"
          style={{ flexBasis: `${progress * 100}%` }}
        />
      )}
      {pct < 100 && <div className="si-loading-bar__track" />}
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
