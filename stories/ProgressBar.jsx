import React from 'react';
import PropTypes from 'prop-types';

import './progress-bar.css';

export const ProgressBar = ({
  variant = 'segmented',
  value = 0.5,
  currentStep = 1,
  totalSteps = 6,
  className = '',
}) => {
  const pct = Math.round(Math.min(1, Math.max(0, Number(value) || 0)) * 100);

  if (variant === 'linear') {
    return (
      <div
        className={['si-progress', 'si-progress--linear', className]
          .filter(Boolean)
          .join(' ')}
        role="progressbar"
        aria-valuenow={pct}
      >
        <div className="si-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    );
  }

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div
      className={[
        'si-progress',
        `si-progress--${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemax={totalSteps}
    >
      {steps.map((step) => (
        <span
          key={step}
          className={[
            'si-progress__step',
            step <= currentStep ? 'si-progress__step--done' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
};

ProgressBar.propTypes = {
  variant: PropTypes.oneOf(['segmented', 'linear', 'stepped']),
  value: PropTypes.number,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  className: PropTypes.string,
};
