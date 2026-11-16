import React from 'react';
import PropTypes from 'prop-types';

import checkIcon from './assets/mobile/progress-bar/check.svg';
import './mobile-tokens.css';
import './progress-bar.css';

const cx = (...names) => names.filter(Boolean).join(' ');

const DEFAULT_STEPS = { segmented: 6, stepped: 3, linear: 1 };
const CROWDED_THRESHOLD = 6;

const stepState = (index, current) => {
  if (index < current) return 'completed';
  if (index === current) return 'active';
  return 'upcoming';
};

const StepCircle = ({ index, state, crowded }) => (
  <span
    className={cx(
      'si-progress__circle',
      `si-progress__circle--${state}`,
      crowded ? 'si-progress__circle--crowded' : '',
    )}
  >
    {state === 'completed' ? (
      <span
        className="si-progress__check"
        style={{ '--si-icon': `url(${JSON.stringify(checkIcon)})` }}
        aria-hidden="true"
      />
    ) : (
      <span className="si-progress__number">{index}</span>
    )}
  </span>
);

StepCircle.propTypes = {
  index: PropTypes.number,
  state: PropTypes.oneOf(['completed', 'active', 'upcoming']),
  crowded: PropTypes.bool,
};

/**
 * Twin of SIProgressBar (components/flutter/lib/src/components/progress_bar/si_progress_bar.dart).
 * Catalog name: "Prikaz korakov".
 */
export const ProgressBar = ({
  variant = 'segmented',
  orientation = 'horizontal',
  value = 0.4,
  currentStep = 1,
  totalSteps,
  label = '',
  supportingText = '',
  stepLabels,
  className = '',
}) => {
  const steps = Math.min(Math.max(Number(totalSteps) || DEFAULT_STEPS[variant] || 1, 1), 100);
  const step = Math.min(Math.max(Number(currentStep) || 0, 0), steps);
  const isVertical = variant === 'stepped' && orientation === 'vertical';
  const labeled = Boolean(label || supportingText);
  const range = Array.from({ length: steps }, (_, i) => i + 1);

  let indicator;
  if (variant === 'linear') {
    const progress = Math.min(Math.max(Number(value) || 0, 0), 1);
    indicator = (
      <div
        className={cx('si-progress__linear', labeled ? 'si-progress__linear--labeled' : '')}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="si-progress__linear-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    );
  } else if (variant === 'segmented') {
    indicator = (
      <div className="si-progress__segments" role="progressbar" aria-valuenow={step} aria-valuemax={steps}>
        {range.map((i) => (
          <span key={i} className={cx('si-progress__segment', i <= step ? 'si-progress__segment--filled' : '')} />
        ))}
      </div>
    );
  } else if (isVertical) {
    const current = Math.max(step, 1);
    indicator = (
      <ol className="si-progress__vertical">
        {range.map((i) => {
          const text = stepLabels?.[i - 1];
          return (
            <li key={i} className={cx('si-progress__vrow', i === steps ? 'si-progress__vrow--last' : '')}>
              <span className="si-progress__vrail">
                <StepCircle index={i} state={stepState(i, current)} crowded />
                {i < steps && (
                  <span className={cx('si-progress__vline', i < current ? 'si-progress__vline--done' : '')} />
                )}
              </span>
              {text != null && (
                <span className={cx('si-progress__vlabel', i === current ? 'si-progress__vlabel--current' : '')}>
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    );
  } else {
    const current = Math.max(step, 1);
    const crowded = steps >= CROWDED_THRESHOLD;
    indicator = (
      <div
        className={cx('si-progress__stepped', crowded ? 'si-progress__stepped--crowded' : '')}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemax={steps}
      >
        {range.map((i) => (
          <React.Fragment key={i}>
            {i > 1 && (
              <span
                className={cx(
                  'si-progress__connector',
                  !crowded || i - 1 < current ? '' : 'si-progress__connector--upcoming',
                )}
              />
            )}
            <StepCircle index={i} state={stepState(i, current)} crowded={crowded} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const showSupporting = variant === 'linear' && Boolean(supportingText);

  return (
    <div className={cx('si-progress', `si-progress--${variant}`, isVertical ? 'si-progress--vertical' : '', className)}>
      {label ? (
        <p className={cx('si-progress__label', isVertical ? 'si-progress__label--heading' : '')}>{label}</p>
      ) : null}
      {indicator}
      {showSupporting ? <p className="si-progress__supporting">{supportingText}</p> : null}
    </div>
  );
};

ProgressBar.propTypes = {
  variant: PropTypes.oneOf(['segmented', 'linear', 'stepped']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  value: PropTypes.number,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  label: PropTypes.string,
  supportingText: PropTypes.string,
  stepLabels: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};
